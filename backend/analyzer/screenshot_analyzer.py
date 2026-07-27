import re

from analyzer.message_analyzer import analyze_message


def _dedupe_reasons(reasons):
    seen = set()
    deduped = []

    for reason in reasons:
        if reason not in seen:
            seen.add(reason)
            deduped.append(reason)

    return deduped


def analyze_screenshot(
    ocr_text,
    filename="",
    image_width=None,
    image_height=None,
    file_size=None,
    ocr_confidence=None,
):
    normalized_text = (ocr_text or "").strip()
    normalized_filename = (filename or "").strip()

    combined_text = " ".join(
        part
        for part in [normalized_filename, normalized_text]
        if part
    )

    base_result = analyze_message(combined_text or normalized_text)

    risk = int(base_result["risk"])
    reasons = list(base_result["reasons"])

    searchable_text = combined_text.lower()

    credential_keywords = [
        "password",
        "enter your password",
        "login",
        "log in",
        "sign in",
        "verify your account",
        "verify your identity",
        "account credentials",
        "one-time code",
        "verification code",
        "security code",
        "otp",
        "two-factor",
        "2fa",
    ]

    urgency_keywords = [
        "urgent",
        "immediately",
        "right now",
        "act now",
        "within 24 hours",
        "final warning",
        "last warning",
        "security alert",
        "session expired",
    ]

    action_keywords = [
        "click here",
        "open the link",
        "scan the qr code",
        "confirm your account",
        "reset your password",
        "update your account",
        "sign in now",
        "review your account",
    ]

    threat_keywords = [
        "account suspended",
        "account locked",
        "account blocked",
        "unauthorized activity",
        "unusual activity",
        "payment failed",
        "billing issue",
        "security warning",
    ]

    impersonation_keywords = [
        "microsoft",
        "google",
        "apple",
        "paypal",
        "amazon",
        "bank",
        "facebook",
        "instagram",
        "linkedin",
    ]

    if any(keyword in searchable_text for keyword in credential_keywords):
        risk += 20

        reasons.append(
            "Screenshot contains credential, login, or verification prompts."
        )

    if any(keyword in searchable_text for keyword in urgency_keywords):
        risk += 15

        reasons.append(
            "Screenshot uses urgency language to pressure immediate action."
        )

    if any(keyword in searchable_text for keyword in action_keywords):
        risk += 15

        reasons.append(
            "Screenshot asks the user to click, scan, or complete a sensitive action."
        )

    if any(keyword in searchable_text for keyword in threat_keywords):
        risk += 15

        reasons.append(
            "Screenshot references a blocked, suspended, or otherwise threatened account."
        )

    if (
        any(keyword in searchable_text for keyword in impersonation_keywords)
        and (
            any(keyword in searchable_text for keyword in credential_keywords)
            or any(keyword in searchable_text for keyword in action_keywords)
            or any(keyword in searchable_text for keyword in urgency_keywords)
        )
    ):
        risk += 10

        reasons.append(
            "Screenshot appears to imitate a well-known service while requesting sensitive action."
        )

    if not normalized_text:
        reasons.append(
            "OCR extracted little or no readable text from the screenshot."
        )

    if image_width and image_height and image_width < 500 and image_height < 500:
        risk += 5

        reasons.append(
            "Screenshot is low resolution, which can hide phishing details."
        )

    if file_size and file_size > 8_000_000:
        risk += 5

        reasons.append(
            "Screenshot file is unusually large and should be reviewed carefully."
        )

    risk = min(risk, 100)
    reasons = _dedupe_reasons(reasons)

    if risk >= 70:
        status = "Dangerous"
    elif risk >= 35:
        status = "Suspicious"
    else:
        status = "Safe"

    if ocr_confidence is not None:
        confidence = max(0, min(100, int(ocr_confidence)))
    else:
        confidence = max(0, 100 - risk)

    return {
        "status": status,
        "risk": risk,
        "confidence": confidence,
        "reasons": reasons,
        "ocr_text": normalized_text,
    }