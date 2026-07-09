from datetime import datetime
from urllib.parse import urlparse
import re


SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "update",
    "secure",
    "bank",
    "paypal",
    "account",
    "signin",
    "password",
    "confirm",
]

SHORTENERS = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
]


def calculate_trust_score(result, domain_info, url):

    score = 100
    reasons = []

    # ----------------------------
    # HTTPS
    # ----------------------------
    if domain_info.get("https"):
        reasons.append("HTTPS enabled.")
    else:
        score -= 15
        reasons.append("Website is not using HTTPS.")

    # ----------------------------
    # VirusTotal
    # ----------------------------
    vt = result.get("virus_total", {})
    malicious = vt.get("malicious", 0)

    if malicious > 0:
        deduction = min(malicious * 5, 40)
        score -= deduction
        reasons.append(f"Detected by {malicious} VirusTotal engines.")
    else:
        reasons.append("No VirusTotal detections.")

    # ----------------------------
    # Domain Age
    # ----------------------------
    creation = domain_info.get("creation_date")

    if creation:
        try:
            created = datetime.strptime(
                creation.split()[0],
                "%Y-%m-%d"
            )

            age = (datetime.now() - created).days

            if age < 30:
                score -= 25
                reasons.append("Very new domain.")

            elif age < 180:
                score -= 15
                reasons.append("Recently registered domain.")

            else:
                reasons.append("Old trusted domain.")

        except:
            pass

    # ----------------------------
    # URL Length
    # ----------------------------
    if len(url) > 75:
        score -= 10
        reasons.append("Very long URL.")

    # ----------------------------
    # IP Address
    # ----------------------------
    hostname = urlparse(url).hostname or ""

    if re.match(r"^\d+\.\d+\.\d+\.\d+$", hostname):
        score -= 20
        reasons.append("Uses an IP address instead of a domain.")

    # ----------------------------
    # Suspicious Keywords
    # ----------------------------
    lower = url.lower()

    for word in SUSPICIOUS_KEYWORDS:
        if word in lower:
            score -= 5
            reasons.append(f"Contains keyword '{word}'.")

    # ----------------------------
    # URL Shortener
    # ----------------------------
    for short in SHORTENERS:
        if short in lower:
            score -= 20
            reasons.append("Shortened URL detected.")
            break

    # ----------------------------
    # Subdomains
    # ----------------------------
    parts = hostname.split(".")

    if len(parts) > 3:
        score -= 10
        reasons.append("Too many subdomains.")

    # ----------------------------
    # AI Prediction
    # ----------------------------
    if result["status"] == "Malicious":
        score -= 25
        reasons.append("AI classified this URL as malicious.")

    elif result["status"] == "Suspicious":
        score -= 15
        reasons.append("AI classified this URL as suspicious.")

    score = max(0, min(score, 100))

    if score >= 80:
        level = "Low Risk"

    elif score >= 50:
        level = "Medium Risk"

    else:
        level = "High Risk"

    return {
        "trust_score": score,
        "risk_level": level,
        "trust_reasons": reasons
    }