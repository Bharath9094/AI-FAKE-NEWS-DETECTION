from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.ocr_service import ocr_service
from .predict_router import predict_news
from ..schemas.schemas import AnalyzeTextRequest

router = APIRouter(prefix="", tags=["Image OCR"])

@router.post("/ocr")
async def process_ocr_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    content = await file.read()
    res = ocr_service.extract_text_from_image(content)
    
    if not res.get("success") or not res.get("text"):
        raise HTTPException(status_code=400, detail=res.get("error", "Could not extract text from image"))

    text = res.get("text")
    req = AnalyzeTextRequest(
        text=text,
        headline=f"Image OCR Scan: {file.filename}",
        input_type="ocr"
    )
    
    analysis_result = await predict_news(req=req, db=db, current_user=None)
    
    return {
        "extracted_text": text,
        "ocr_engine": res.get("ocr_engine"),
        "analysis": analysis_result
    }
