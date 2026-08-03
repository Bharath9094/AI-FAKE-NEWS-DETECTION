from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.schemas import AnalyzeTextRequest, PredictionResponse
from ..services.ml_service import ml_service
from ..services.llm_service import llm_service
from ..services.fact_checker import fact_checker
from ..services.export_service import export_service
from ..models.db_models import ScanHistory, User
from ..utils.auth import get_current_user_optional

router = APIRouter(prefix="", tags=["Prediction Engine"])

@router.post("/predict", response_model=PredictionResponse)
async def predict_news(
    req: AnalyzeTextRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    text = req.text.strip()
    if not text or len(text) < 10:
        raise HTTPException(status_code=400, detail="Article text must be at least 10 characters long.")

    # Step 1-4: ML Classification & Feature Extraction
    ml_res = ml_service.predict(text)
    
    # Step 5: LLM Explanation
    llm_res = await llm_service.analyze_article(text, ml_res)
    
    # Step 6: Fact Checking
    is_fake = ml_res["prediction"] == "FAKE"
    fact_res = fact_checker.check_claims(text, is_fake)

    # Save to Scan History
    user_id = current_user.id if current_user else None
    title = req.headline if req.headline else (text[:60] + "...")
    
    db_scan = ScanHistory(
        user_id=user_id,
        title=title,
        input_type=req.input_type or "text",
        original_input=text,
        cleaned_text=ml_res["cleaned_text"],
        prediction=ml_res["prediction"],
        confidence=ml_res["confidence"],
        fake_probability=ml_res["fake_probability"],
        real_probability=ml_res["real_probability"],
        bias_score=ml_res["bias_score"],
        emotion_score=ml_res["emotion_score"],
        trust_score=ml_res["trust_score"],
        propaganda_score=ml_res["propaganda_score"],
        clickbait_score=ml_res["clickbait_score"],
        nlp_features=ml_res["nlp_features"],
        llm_analysis=llm_res,
        fact_checks=fact_res
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)

    return {
        "id": db_scan.id,
        "prediction": ml_res["prediction"],
        "confidence": ml_res["confidence"],
        "fake_probability": ml_res["fake_probability"],
        "real_probability": ml_res["real_probability"],
        "bias_score": ml_res["bias_score"],
        "emotion_score": ml_res["emotion_score"],
        "trust_score": ml_res["trust_score"],
        "propaganda_score": ml_res["propaganda_score"],
        "clickbait_score": ml_res["clickbait_score"],
        "original_input": text,
        "cleaned_text": ml_res["cleaned_text"],
        "nlp_features": ml_res["nlp_features"],
        "llm_analysis": llm_res,
        "fact_checks": fact_res,
        "highlighted_sentences": ml_res["highlighted_sentences"],
        "created_at": db_scan.created_at
    }

@router.get("/export/{scan_id}")
def export_report(scan_id: int, format: str = "pdf", db: Session = Depends(get_db)):
    scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")

    data = {
        "id": scan.id,
        "prediction": scan.prediction,
        "confidence": scan.confidence,
        "fake_probability": scan.fake_probability,
        "real_probability": scan.real_probability,
        "bias_score": scan.bias_score,
        "emotion_score": scan.emotion_score,
        "trust_score": scan.trust_score,
        "propaganda_score": scan.propaganda_score,
        "clickbait_score": scan.clickbait_score,
        "original_input": scan.original_input,
        "llm_analysis": scan.llm_analysis
    }

    if format.lower() == "json":
        json_content = export_service.export_json(data)
        return Response(content=json_content, media_type="application/json", headers={"Content-Disposition": f"attachment; filename=fake_news_report_{scan_id}.json"})
    elif format.lower() == "csv":
        csv_content = export_service.export_csv(data)
        return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=fake_news_report_{scan_id}.csv"})
    elif format.lower() == "pdf":
        pdf_bytes = export_service.export_pdf(data)
        return Response(content=bytes(pdf_bytes), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=fake_news_report_{scan_id}.pdf"})
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Supported: pdf, csv, json")
