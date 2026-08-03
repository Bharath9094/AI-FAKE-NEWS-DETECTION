# VERITAS AI - AI Fake News Detection Platform

> A production-grade, full-stack AI Fake News Detection Platform built with modern web technologies, Scikit-Learn Machine Learning Voting Ensembles, and NVIDIA NIM Llama 3.3 LLM explanations.

![Platform Overview](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![Tech Stack](https://img.shields.io/badge/Frontend-Next.js%20%7C%20Tailwind%20%7C%20Framer%20Motion-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%20%7C%20SQLAlchemy-cyan)
![AI Model](https://img.shields.io/badge/AI-NVIDIA%20NIM%20Llama%203.3%20%7C%20TF--IDF%20Ensemble-purple)

---

## 🌟 Key Capabilities & Features

### 1. Multi-Modal Input Analysis
- **Text & Headline Input**: Direct submission of raw news text or headlines.
- **Web URL Scraper**: Automatic page scraping and text extraction using BeautifulSoup & HTTPX.
- **PDF, DOCX & TXT Reader**: Instant document parsing using PyPDF2 & python-docx.
- **Image OCR Screenshot Analysis**: Optical Character Recognition via Tesseract OCR / PIL.
- **Voice Speech Input**: Web Speech API integration for direct spoken transcriptions.

### 2. Multi-Stage AI Detection Engine
1. **NLP Text Preprocessing**: HTML stripping, emoji removal, lowercasing, punctuation normalization, stop-word filtering, and lemmatization.
2. **Feature Extraction**: TF-IDF N-gram vectorization combined with sensationalism, clickbait, and capitalization ratio extraction.
3. **Machine Learning Voting Ensemble**: Soft-voting classifier combining Logistic Regression, Random Forest, and Gradient Boosting.
4. **NVIDIA NIM LLM Reasoning**: Natural language breakdown generated via **Llama 3.3 70B Instruct** detailing political bias, emotional manipulation, propaganda risk, and actionable recommendations.
5. **Interactive Sentence Heatmap**: Highlighted sentence risk levels (High, Medium, Normal) identifying clickbait triggers.
6. **Multi-Source Fact Checking**: Automatic cross-referencing with trusted wire databases (Reuters, Associated Press, BBC, Wikipedia, WHO, UN).

### 3. Comprehensive Reports & Analytics
- **SVG Speedometer Gauge Meter**: Real-time visual verdict representation.
- **Interactive Recharts Visualizers**: Probability Pie Chart, Indicator Bar Graph, and Deception Footprint Radar Chart.
- **Export Engine**: One-click download of formal PDF verification dossiers, CSV data tables, or raw JSON payloads.
- **Admin & Analytics Hub**: Real-time system logs, dataset performance metrics, user management, and flagged article queues.

---

## 🏗 System Architecture & Directory Structure

```
c:\Users\Bharath AV\OneDrive\Documents\ALL Projects\AI FAKE NEWS DETECTION
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint
│   │   ├── config.py                # Pydantic environment configuration
│   │   ├── database.py              # SQLAlchemy DB engine & session setup
│   │   ├── models/                  # Database ORM models (User, ScanHistory, SystemLog)
│   │   ├── schemas/                 # Pydantic request/response validation schemas
│   │   ├── services/                # Core AI services (ML, LLM, OCR, URL, Doc, FactCheck, Export)
│   │   ├── utils/                   # Security, bcrypt password hashing, JWT auth helpers
│   │   └── routers/                 # API endpoint routers (/predict, /upload, /ocr, /url, /auth, /admin)
│   ├── ml/
│   │   ├── preprocess.py            # Text cleaning & NLP feature extractor
│   │   ├── train.py                 # Dataset preprocessing & ensemble model training script
│   │   └── saved_models/            # Serialized TF-IDF vectorizer & trained ensemble models
│   ├── requirements.txt             # Backend Python dependencies
│   └── Dockerfile                   # Backend Docker containerization
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router (Landing, Dashboard, History, Analytics, Admin, Profile)
│   │   ├── components/              # Modular UI (Navbar, Hero, GaugeMeter, Heatmap, Charts, OtpModal)
│   │   ├── lib/                     # API client & auth handlers
│   │   └── types/                   # TypeScript interfaces
│   ├── package.json                 # Next.js, React, Tailwind, Lucide, Recharts dependencies
│   ├── tailwind.config.js           # Glassmorphism dark color system
│   └── Dockerfile                   # Frontend Docker containerization
├── docker-compose.yml               # Multi-container orchestration (Postgres, Backend, Frontend)
└── README.md                        # Documentation
```

---

## ⚡ Quick Start & Installation

### Option 1: Running Locally

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
python ml/train.py   # Trains and serializes the ML models
uvicorn app.main:app --reload --port 8000
```
- API Swagger Documentation will be live at: `http://localhost:8000/docs`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Next.js Web App will be live at: `http://localhost:3000`

---

## 🔌 API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/predict` | Analyzes article text and returns ML & LLM verdict |
| `POST` | `/api/v1/url` | Scrapes webpage URL and executes authenticity verification |
| `POST` | `/api/v1/upload` | Reads PDF/DOCX/TXT files and evaluates authenticity |
| `POST` | `/api/v1/ocr` | Extracts text from uploaded images/screenshots and analyzes content |
| `GET`  | `/api/v1/export/{id}?format=pdf` | Generates downloadable PDF/CSV/JSON verification dossier |
| `POST` | `/api/v1/auth/register` | Registers new user account with hashed credentials |
| `POST` | `/api/v1/auth/login` | Authenticates user and returns JWT bearer token |
| `GET`  | `/api/v1/history` | Fetches user verification scan history & bookmarked items |
| `GET`  | `/api/v1/analytics` | Returns global authenticity statistics and topic trends |
| `GET`  | `/api/v1/admin/dashboard` | Admin portal metrics, model performance, and system audit logs |

---

## 🐳 Docker Containerization

To spin up the full production stack (PostgreSQL + FastAPI + Next.js) using Docker Compose:

```bash
docker-compose up --build -d
```

Access the services:
- **Frontend App**: `http://localhost:3000`
- **FastAPI API & Docs**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432`

---

## 🔑 Environment Variables (.env)

Create a `.env` file in `backend/`:
```env
SECRET_KEY=super-secret-jwt-key-2026-fake-news-detector
DATABASE_URL=sqlite:///./fake_news_app.db
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key_here
NVIDIA_MODEL_NAME=meta/llama-3.3-70b-instruct
```

---

## 🛡 License & Disclaimer

Built for research, educational, and professional investigative journalism purposes. Integrated with standard AI models and news agency APIs.
