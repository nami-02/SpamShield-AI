import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from analyzer.url_analyzer import analyze_url
from analyzer.message_analyzer import analyze_message
from analyzer.screenshot_analyzer import analyze_screenshot

from services.whois_service import get_domain_info
from services.trust_score import calculate_trust_score
from services.explanation_engine import generate_explanation
from services.pdf_generator import generate_pdf

from services.history_service import (
    save_scan,
    save_message_scan,
    save_screenshot_scan,
    get_history,
    delete_scan,
)

from database.db import initialize_database


# ==========================================
# FastAPI Application
# ==========================================

app = FastAPI(
    title="SpamShield AI API",
    description=(
        "AI-powered spam, phishing, and malicious URL "
        "detection API."
    ),
    version="1.0.0",
)


# ==========================================
# Initialize Database
# ==========================================

initialize_database()


# ==========================================
# CORS Configuration
# ==========================================

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Request Models
# ==========================================

class URLRequest(BaseModel):
    url: str


class MessageRequest(BaseModel):
    message: str


class ScreenshotRequest(BaseModel):
    ocr_text: str = ""
    filename: str = ""
    image_width: int | None = None
    image_height: int | None = None
    file_size: int | None = None
    ocr_confidence: int | None = None


# ==========================================
# Home Route
# ==========================================

@app.get("/")
def home():
    return {
        "message": "SpamShield AI Backend Running"
    }


# ==========================================
# Message Analysis
# ==========================================

@app.post("/analyze-message")
def analyze_msg(data: MessageRequest):
    result = analyze_message(data.message)

    if result["status"] == "Safe":
        confidence = 100 - result["risk"]
    else:
        confidence = result["risk"]

    # Save message scan to history
    save_message_scan(
        data.message,
        result,
        confidence,
    )

    return {
        "status": result["status"],
        "risk": result["risk"],
        "confidence": f"{confidence}%",
        "reasons": result["reasons"],
    }


# ==========================================
# Screenshot Analysis
# ==========================================

@app.post("/analyze-screenshot")
def analyze_screenshot_scan(data: ScreenshotRequest):
    result = analyze_screenshot(
        data.ocr_text,
        filename=data.filename,
        image_width=data.image_width,
        image_height=data.image_height,
        file_size=data.file_size,
        ocr_confidence=data.ocr_confidence,
    )

    save_screenshot_scan(
        data.filename,
        data.ocr_text,
        result,
        result["confidence"],
    )

    return {
        "filename": data.filename,
        "status": result["status"],
        "risk": result["risk"],
        "confidence": result["confidence"],
        "reasons": result["reasons"],
        "ocr_text": result["ocr_text"],
    }


# ==========================================
# URL Analysis
# ==========================================

@app.post("/analyze-url")
def analyze(data: URLRequest):

    # AI / URL Analysis
    result = analyze_url(data.url)

    # WHOIS and Domain Information
    domain_info = get_domain_info(data.url)

    # Trust Score
    trust = calculate_trust_score(
        result,
        domain_info,
        data.url,
    )

    # Security Explanation
    explanation = generate_explanation(
        result,
        domain_info,
        trust,
    )

    # Save Scan History
    save_scan(
        data.url,
        result,
        trust,
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
        "explanation": explanation,
    }


# ==========================================
# Scan History
# ==========================================

@app.get("/history")
def history():
    return get_history()


# ==========================================
# Delete Scan History
# ==========================================

@app.delete("/history/{scan_id}")
def delete_history(scan_id: int):
    delete_scan(scan_id)

    return {
        "message": "Scan deleted successfully"
    }


# ==========================================
# Generate Security Report
# ==========================================

@app.post("/generate-report")
def generate_report(data: URLRequest):

    # Analyze URL again for report generation
    result = analyze_url(data.url)

    # WHOIS and Domain Information
    domain_info = get_domain_info(data.url)

    # Trust Score
    trust = calculate_trust_score(
        result,
        domain_info,
        data.url,
    )

    # Security Explanation
    explanation = generate_explanation(
        result,
        domain_info,
        trust,
    )

    # Report Data
    report = {
        "url": data.url,
        "status": result["status"],
        "ai_prediction": result["ai_prediction"],
        "trust": trust,
        "explanation": explanation,
    }

    # Generate PDF
    pdf_path = generate_pdf(report)

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="SpamShield_Report.pdf",
    )