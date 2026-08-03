from typing import Optional, List, Any
from pydantic import BaseModel
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str
    new_password: str

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Analysis & Predict Schemas ---
class AnalyzeTextRequest(BaseModel):
    text: str
    headline: Optional[str] = None
    language: Optional[str] = "en"
    input_type: Optional[str] = "text"

class AnalyzeURLRequest(BaseModel):
    url: str
    language: Optional[str] = "en"

class FactCheckItem(BaseModel):
    source_name: str
    source_url: str
    claim_verdict: str
    matching_info: str
    trust_score: float

class LLMExplanation(BaseModel):
    summary: str
    explanation: str
    reasons: List[str]
    manipulation_techniques: List[str]
    political_bias: str
    emotional_bias: str
    propaganda_detection: str
    clickbait_detection: str
    suspicious_words: List[str]
    confidence_reasoning: str
    risk_score: float
    suggestions: List[str]

class PredictionResponse(BaseModel):
    id: Optional[int] = None
    prediction: str # REAL or FAKE
    confidence: float # 0 - 100
    fake_probability: float # 0 - 100
    real_probability: float # 0 - 100
    
    # Feature scores
    bias_score: float
    emotion_score: float
    trust_score: float
    propaganda_score: float
    clickbait_score: float

    # Extracted data & Highlights
    original_input: str
    cleaned_text: str
    nlp_features: dict
    llm_analysis: LLMExplanation
    fact_checks: List[FactCheckItem]
    highlighted_sentences: List[dict]
    created_at: Optional[datetime] = None

# --- Admin & Analytics Schemas ---
class FlagArticleRequest(BaseModel):
    scan_id: int
    reason: str

class FeedbackRequest(BaseModel):
    rating: int
    comments: Optional[str] = None

class AdminStatsResponse(BaseModel):
    total_scans: int
    real_count: int
    fake_count: int
    fake_percentage: float
    total_users: int
    avg_confidence: float
    model_metrics: dict
