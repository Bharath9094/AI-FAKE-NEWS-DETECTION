import os
import re
import sys
import joblib
import numpy as np

# Add parent directory to sys.path to import ml.preprocess
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from ml.preprocess import clean_text, extract_nlp_features

SAVED_MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../ml/saved_models"))

class MLService:
    def __init__(self):
        self.vectorizer_path = os.path.join(SAVED_MODELS_DIR, "tfidf_vectorizer.pkl")
        self.model_path = os.path.join(SAVED_MODELS_DIR, "fake_news_model.pkl")
        self.metrics_path = os.path.join(SAVED_MODELS_DIR, "metrics.pkl")
        
        self.vectorizer = None
        self.model = None
        self.metrics = None
        self.load_models()

    def load_models(self):
        try:
            if os.path.exists(self.vectorizer_path) and os.path.exists(self.model_path):
                self.vectorizer = joblib.load(self.vectorizer_path)
                self.model = joblib.load(self.model_path)
                if os.path.exists(self.metrics_path):
                    self.metrics = joblib.load(self.metrics_path)
                print("ML Models successfully loaded from disk.")
            else:
                print("Serialized models not found. Running inline training fallback.")
        except Exception as e:
            print(f"Error loading saved ML models: {e}")

    def predict(self, text: str) -> dict:
        cleaned = clean_text(text)
        nlp_features = extract_nlp_features(text)
        
        if self.vectorizer and self.model:
            tfidf_vec = self.vectorizer.transform([cleaned])
            proba = self.model.predict_proba(tfidf_vec)[0] # [P(Real), P(Fake)]
            real_prob = round(float(proba[0]) * 100, 2)
            fake_prob = round(float(proba[1]) * 100, 2)
            
            # Incorporate heuristic sensationalism boost if highly flagged
            if nlp_features["sensational_score"] > 60:
                fake_prob = min(99.9, fake_prob + 15.0)
                real_prob = max(0.1, 100.0 - fake_prob)
            
            prediction = "FAKE" if fake_prob >= 50.0 else "REAL"
            confidence = fake_prob if prediction == "FAKE" else real_prob
        else:
            # Fallback heuristic calculation if model pickle is missing
            sens_score = nlp_features["sensational_score"]
            fake_prob = round(min(98.5, max(5.0, sens_score * 1.1)), 2)
            real_prob = round(100.0 - fake_prob, 2)
            prediction = "FAKE" if fake_prob >= 50.0 else "REAL"
            confidence = fake_prob if prediction == "FAKE" else real_prob

        # Calculate scores
        clickbait_score = round(min(100.0, (nlp_features["caps_ratio"] * 2.5) + (nlp_features["exclamations"] * 10) + (len(nlp_features["triggered_words"]) * 15)), 2)
        propaganda_score = round(min(100.0, (fake_prob * 0.7) + (clickbait_score * 0.3)), 2)
        emotion_score = round(min(100.0, (nlp_features["exclamations"] * 12) + (len(nlp_features["triggered_words"]) * 20)), 2)
        bias_score = round(min(100.0, (clickbait_score * 0.6) + (fake_prob * 0.4)), 2)
        trust_score = round(max(0.0, 100.0 - propaganda_score), 2)

        # Sentence-level suspicious highlights
        highlighted_sentences = self._highlight_suspicious_sentences(text, nlp_features["triggered_words"])

        return {
            "prediction": prediction,
            "confidence": confidence,
            "fake_probability": fake_prob,
            "real_probability": real_prob,
            "cleaned_text": cleaned,
            "nlp_features": nlp_features,
            "bias_score": bias_score,
            "emotion_score": emotion_score,
            "trust_score": trust_score,
            "propaganda_score": propaganda_score,
            "clickbait_score": clickbait_score,
            "highlighted_sentences": highlighted_sentences
        }

    def _highlight_suspicious_sentences(self, raw_text: str, trigger_words: list) -> list:
        sentences = re.split(r'(?<=[.!?])\s+', raw_text)
        results = []
        
        for idx, sentence in enumerate(sentences):
            sentence_clean = sentence.strip()
            if not sentence_clean:
                continue
            
            s_lower = sentence_clean.lower()
            matched_words = [w for w in trigger_words if w in s_lower]
            caps_in_s = sum(1 for w in sentence_clean.split() if w.isupper() and len(w) > 1)
            
            is_suspicious = len(matched_words) > 0 or caps_in_s >= 2 or '!' in sentence_clean
            risk_level = "HIGH" if len(matched_words) > 0 and '!' in sentence_clean else ("MEDIUM" if is_suspicious else "LOW")
            
            results.append({
                "id": idx + 1,
                "text": sentence_clean,
                "is_suspicious": is_suspicious,
                "risk_level": risk_level,
                "matched_triggers": matched_words
            })
            
        return results

ml_service = MLService()
