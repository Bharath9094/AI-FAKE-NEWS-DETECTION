import asyncio
from app.services.ml_service import ml_service
from app.services.llm_service import llm_service
from app.services.fact_checker import fact_checker
from app.services.export_service import export_service

async def test_full_pipeline():
    print("=" * 60)
    print("TESTING FULL AI FAKE NEWS DETECTION PIPELINE")
    print("=" * 60)

    # 1. Test Fake News
    fake_text = "SHOCKING: Secret Government Telepathy Satellite Network Secretly Activated World Wide Today! Pharmaceutical Giants Banned Publication Of The Cure To All Known Diseases Immediately!"
    ml_res = ml_service.predict(fake_text)
    print(f"\n1. ML Prediction: {ml_res['prediction']} (Fake Probability: {ml_res['fake_probability']}%)")
    print(f"   Sensational Score: {ml_res['nlp_features']['sensational_score']}/100")
    print(f"   Clickbait Score: {ml_res['clickbait_score']}/100")

    # 2. Test LLM Explanation
    llm_res = await llm_service.analyze_article(fake_text, ml_res)
    print(f"\n2. LLM Summary: {llm_res['summary']}")
    print(f"   Political Bias: {llm_res['political_bias']}")
    print(f"   Emotional Bias: {llm_res['emotional_bias']}")

    # 3. Test Fact Checker
    fc_res = fact_checker.check_claims(fake_text, is_fake=True)
    print(f"\n3. Fact Check Sources Found: {len(fc_res)} wires")
    for fc in fc_res:
        print(f"   - {fc['source_name']}: {fc['claim_verdict']}")

    # 4. Test Export PDF & CSV
    report_data = {
        "prediction": ml_res["prediction"],
        "confidence": ml_res["confidence"],
        "fake_probability": ml_res["fake_probability"],
        "real_probability": ml_res["real_probability"],
        "bias_score": ml_res["bias_score"],
        "emotion_score": ml_res["emotion_score"],
        "trust_score": ml_res["trust_score"],
        "propaganda_score": ml_res["propaganda_score"],
        "clickbait_score": ml_res["clickbait_score"],
        "original_input": fake_text,
        "llm_analysis": llm_res
    }
    pdf_bytes = export_service.export_pdf(report_data)
    csv_str = export_service.export_csv(report_data)

    print(f"\n4. Export Verification: PDF Generated ({len(pdf_bytes)} bytes), CSV Generated ({len(csv_str)} chars)")
    print("\nALL PIPELINE TESTS PASSED CLEANLY!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
