from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.schemas import AnalyzeURLRequest, AnalyzeTextRequest
from ..services.url_service import url_service
from .predict_router import predict_news

router = APIRouter(prefix="", tags=["URL Analysis"])

@router.post("/url")
async def process_url(
    req: AnalyzeURLRequest,
    db: Session = Depends(get_db)
):
    scraped = await url_service.scrape_url(req.url)
    
    if scraped.get("error") or not scraped.get("text"):
        raise HTTPException(status_code=400, detail=scraped.get("error", "Unable to extract readable content from URL"))

    headline = scraped.get("headline", req.url)
    text = scraped.get("text")
    
    text_req = AnalyzeTextRequest(
        text=text,
        headline=headline,
        language=req.language or "en",
        input_type="url"
    )
    
    analysis_result = await predict_news(req=text_req, db=db, current_user=None)
    
    return {
        "url": req.url,
        "domain": scraped.get("domain"),
        "extracted_headline": headline,
        "extracted_text": text,
        "analysis": analysis_result
    }
