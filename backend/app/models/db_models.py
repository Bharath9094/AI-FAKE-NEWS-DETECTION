import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user") # user, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scans = relationship("ScanHistory", back_populates="user", cascade="all, delete-orphan")


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=True)
    input_type = Column(String, default="text") # text, url, file, ocr, voice
    original_input = Column(Text, nullable=False)
    cleaned_text = Column(Text, nullable=True)
    
    # Classification Result
    prediction = Column(String, nullable=False) # REAL, FAKE
    confidence = Column(Float, nullable=False)
    fake_probability = Column(Float, nullable=False)
    real_probability = Column(Float, nullable=False)

    # Scores
    bias_score = Column(Float, default=0.0)
    emotion_score = Column(Float, default=0.0)
    trust_score = Column(Float, default=0.0)
    propaganda_score = Column(Float, default=0.0)
    clickbait_score = Column(Float, default=0.0)

    # JSON Breakdown
    nlp_features = Column(JSON, nullable=True)
    llm_analysis = Column(JSON, nullable=True)
    fact_checks = Column(JSON, nullable=True)

    is_bookmarked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="scans")


class FlaggedArticle(Base):
    __tablename__ = "flagged_articles"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scan_history.id"), nullable=True)
    reporter_email = Column(String, nullable=True)
    reason = Column(Text, nullable=False)
    status = Column(String, default="pending") # pending, reviewed, resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=True)
    rating = Column(Integer, default=5)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, default="INFO")
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
