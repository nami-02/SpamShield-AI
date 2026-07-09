from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from analyzer.url_analyzer import analyze_url
from analyzer.message_analyzer import analyze_message

from services.whois_service import get_domain_info
from services.trust_score import calculate_trust_score
from services.explanation_engine import generate_explanation
from fastapi.responses import FileResponse
from services.pdf_generator import generate_pdf

from services.history_service import (
    save_scan,
    get_history,
    delete_scan,
)

from database.db import initialize_database

app = FastAPI()

# Initialize Database
initialize_database()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Request Models
# -----------------------------

class URLRequest(BaseModel):
    url: str


class MessageRequest(BaseModel):
    message: str


# -----------------------------
# Home Route
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "SpamShield AI Backend Running"
    }


# -----------------------------
# Message Analysis
# -----------------------------

@app.post("/analyze-message")
def analyze_msg(data: MessageRequest):

    result = analyze_message(data.message)

    confidence = max(0, 100 - result["risk"])

    return {
        "status": result["status"],
        "risk": result["risk"],
        "confidence": confidence,
        "reasons": result["reasons"]
    }


# -----------------------------
# URL Analysis
# -----------------------------

@app.post("/analyze-url")
def analyze(data: URLRequest):

    # AI Analysis
    result = analyze_url(data.url)

    # WHOIS
    domain_info = get_domain_info(data.url)

    # Trust Score
    trust = calculate_trust_score(
        result,
        domain_info,
        data.url
    )

    # AI Explanation
    explanation = generate_explanation(
        result,
        domain_info,
        trust
    )

    # Save Scan History
    save_scan(
        data.url,
        result,
        trust
    )

    return {
        "url": data.url,
        "status": result["status"],
        "risk": result["risk"],
        "confidence": result["confidence"],
        "ai_prediction": result["ai_prediction"],
        "virus_total": result["virus_total"],
        "reasons": result["reasons"],
        "domain_info": domain_info,
        "trust": trust,
        "explanation": explanation
    }


# -----------------------------
# Scan History
# -----------------------------

@app.get("/history")
def history():
    return get_history()


# -----------------------------
# Delete Scan
# -----------------------------

@app.delete("/history/{scan_id}")
def delete_history(scan_id: int):
    delete_scan(scan_id)

    return {
        "message": "Scan deleted successfully"
    }

@app.post("/generate-report")
def generate_report(data: URLRequest):

    result = analyze_url(data.url)

    domain_info = get_domain_info(data.url)

    trust = calculate_trust_score(
        result,
        domain_info,
        data.url
    )

    explanation = generate_explanation(
        result,
        domain_info,
        trust
    )

    report = {
        "url": data.url,
        "status": result["status"],
        "ai_prediction": result["ai_prediction"],
        "trust": trust,
        "explanation": explanation
    }

    pdf = generate_pdf(report)

    return FileResponse(
        pdf,
        media_type="application/pdf",
        filename="SpamShield_Report.pdf"
    )