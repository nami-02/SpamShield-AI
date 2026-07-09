from analyzer.feature_extractor import extract_features
from analyzer.risk_calculator import calculate_risk
from analyzer.virustotal import check_virustotal
from models.ml_model import predict


def analyze_url(url):
    # Feature Extraction
    features = extract_features(url)

    # Rule-Based Analysis
    status, risk, reasons = calculate_risk(features)

    # AI Prediction
    ai_result = predict(features)

    # VirusTotal Analysis
    vt_result = check_virustotal(url)

    if len(reasons) == 0:
        reasons.append("No suspicious indicators detected.")

    return {
        "status": status,
        "risk": risk,
        "reasons": reasons,
        "ai_prediction": (
            "Phishing"
            if ai_result["prediction"] == 1
            else "Safe"
        ),
        "confidence": ai_result["confidence"],
        "virus_total": vt_result
    }