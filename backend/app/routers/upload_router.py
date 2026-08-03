from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.doc_service import doc_service
from .predict_router import predict_news
from ..schemas.schemas import AnalyzeTextRequest

router = APIRouter(prefix="", tags=["File Upload"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    content = await file.read()
    res = doc_service.read_file(file.filename, content)
    
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Failed to parse uploaded document"))

    text = res.get("text")
    req = AnalyzeTextRequest(
        text=text,
        headline=f"Uploaded Document: {file.filename}",
        input_type="file"
    )
    
    return await predict_news(req=req, db=db, current_user=None)
