from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.db_models import User
from ..schemas.schemas import UserRegister, UserLogin, Token, ForgotPasswordRequest, VerifyOTPRequest, UserProfile
from ..utils.security import get_password_hash, verify_password
from ..utils.auth import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    hashed_pw = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name or user_in.email.split('@')[0].capitalize(),
        hashed_password=hashed_pw,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role
        }
    }

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    # Simulated OTP dispatch
    return {"message": "OTP verification code sent to " + req.email, "otp_sent": True}

@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    if req.otp != "123456" and req.otp != "999999": # Accept demo OTPs
        raise HTTPException(status_code=400, detail="Invalid OTP code entered")
    
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        user.hashed_password = get_password_hash(req.new_password)
        db.commit()
        return {"message": "Password reset successfully. You can now login."}
    
    raise HTTPException(status_code=404, detail="User account not found")

@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
