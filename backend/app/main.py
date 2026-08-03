from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routers import (
    auth_router,
    predict_router,
    upload_router,
    ocr_router,
    url_router,
    history_router,
    analytics_router,
    admin_router
)

# Auto-create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-Grade AI Fake News Detection Platform API powered by ML Ensemble & NVIDIA NIM Llama 3.3 LLM"
)

# Configure CORS for Vercel and Local environments
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:.*|http://127\.0\.0\.1:.*",
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with API prefix and root shortcuts
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(predict_router.router, prefix=settings.API_V1_STR)
app.include_router(upload_router.router, prefix=settings.API_V1_STR)
app.include_router(ocr_router.router, prefix=settings.API_V1_STR)
app.include_router(url_router.router, prefix=settings.API_V1_STR)
app.include_router(history_router.router, prefix=settings.API_V1_STR)
app.include_router(analytics_router.router, prefix=settings.API_V1_STR)
app.include_router(admin_router.router, prefix=settings.API_V1_STR)

# Also expose direct root endpoints required by spec
app.include_router(predict_router.router)
app.include_router(upload_router.router)
app.include_router(ocr_router.router)
app.include_router(url_router.router)
app.include_router(auth_router.router)
app.include_router(history_router.router)
app.include_router(analytics_router.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
