import re

# Suspicious words commonly seen in scam messages
SUSPICIOUS_KEYWORDS = [
    "urgent",
    "verify",
    "account",
    "blocked",
    "winner",
    "won",
    "prize",
    "reward",
    "gift",
    "otp",
    "bank",
    "upi",
    "payment",
    "click",
    "limited time",
    "free",
    "claim",
    "cashback",
    "refund",
    "security"
]

def analyze_message(message):

    risk = 0
    reasons = []

    text = message.lower()

    keyword_count = 0

    for word in SUSPICIOUS_KEYWORDS:
        if word in text:
            keyword_count += 1

    if keyword_count:
        risk += keyword_count * 5
        reasons.append(
            f"Contains {keyword_count} suspicious keywords"
        )

    # Detect URL
    if re.search(r"https?://|www\.", text):
        risk += 15
        reasons.append("Contains URL")

    # Detect UPI ID
    if re.search(r"[A-Za-z0-9.\-_]{2,}@[A-Za-z]{2,}", message):
        risk += 15
        reasons.append("Contains UPI ID")

    # Detect money amount
    if re.search(r"₹|\brs\b|\binr\b", text):
        risk += 10
        reasons.append("Mentions money")

    risk = min(risk, 100)

    if risk >= 60:
        status = "Dangerous"
    elif risk >= 30:
        status = "Suspicious"
    else:
        status = "Safe"

    if not reasons:
        reasons.append("No suspicious indicators detected")

    return {
        "status": status,
        "risk": risk,
        "reasons": reasons
    }