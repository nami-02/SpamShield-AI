import re


def analyze_message(message):
    message_lower = message.lower()

    risk = 0
    reasons = []

    # Strong credential / sensitive information indicators
    credential_keywords = [
        "password",
        "otp",
        "pin",
        "cvv",
        "credit card",
        "debit card",
        "bank details",
        "login details",
        "account credentials",
        "verify your identity",
    ]

    # Urgency and pressure indicators
    urgency_keywords = [
        "urgent",
        "immediately",
        "act now",
        "right now",
        "within 24 hours",
        "limited time",
        "final warning",
        "last warning",
        "take action",
    ]

    # Account threat indicators
    threat_keywords = [
        "account suspended",
        "account has been suspended",
        "account blocked",
        "account locked",
        "account closure",
        "account closed",
        "permanent account closure",
        "will be terminated",
        "will be disabled",
        "avoid suspension",
        "security alert",
        "unauthorized activity",
        "unusual activity",
    ]

    # Suspicious action requests
    action_keywords = [
        "click the link",
        "click here",
        "click below",
        "verify your account",
        "verify your password",
        "confirm your account",
        "update your account",
        "login now",
        "sign in now",
        "open the link",
        "follow the link",
    ]

    # Reward / scam indicators
    scam_keywords = [
        "you won",
        "winner",
        "claim your prize",
        "free gift",
        "lottery",
        "cash prize",
        "reward",
        "congratulations",
        "selected winner",
        "guaranteed income",
        "earn money fast",
    ]

    # Payment / financial indicators
    financial_keywords = [
        "bank account",
        "payment required",
        "send money",
        "transfer money",
        "pay immediately",
        "processing fee",
        "refund pending",
        "payment failed",
    ]

    # Credential indicators are high risk
    credential_matches = [
        keyword
        for keyword in credential_keywords
        if keyword in message_lower
    ]

    if credential_matches:
        risk += min(30, len(credential_matches) * 15)

        reasons.append(
            "Message requests or references sensitive account credentials."
        )

    # Urgency indicators
    urgency_matches = [
        keyword
        for keyword in urgency_keywords
        if keyword in message_lower
    ]

    if urgency_matches:
        risk += min(20, len(urgency_matches) * 10)

        reasons.append(
            "Message uses urgency or pressure to force immediate action."
        )

    # Account threats
    threat_matches = [
        keyword
        for keyword in threat_keywords
        if keyword in message_lower
    ]

    if threat_matches:
        risk += min(25, len(threat_matches) * 15)

        reasons.append(
            "Message threatens account suspension, closure, or another negative consequence."
        )

    # Suspicious action request
    action_matches = [
        keyword
        for keyword in action_keywords
        if keyword in message_lower
    ]

    if action_matches:
        risk += min(25, len(action_matches) * 15)

        reasons.append(
            "Message asks the user to click a link or verify account information."
        )

    # Scam / reward indicators
    scam_matches = [
        keyword
        for keyword in scam_keywords
        if keyword in message_lower
    ]

    if scam_matches:
        risk += min(25, len(scam_matches) * 10)

        reasons.append(
            "Message contains common reward or prize scam language."
        )

    # Financial indicators
    financial_matches = [
        keyword
        for keyword in financial_keywords
        if keyword in message_lower
    ]

    if financial_matches:
        risk += min(25, len(financial_matches) * 10)

        reasons.append(
            "Message contains suspicious payment or financial requests."
        )

    # URL detection
    url_pattern = r"(https?://\S+|www\.\S+)"

    if re.search(url_pattern, message, re.IGNORECASE):
        risk += 15

        reasons.append(
            "Message contains a URL that may redirect the user to an external website."
        )

    # Excessive uppercase detection
    uppercase_letters = [
        character
        for character in message
        if character.isalpha() and character.isupper()
    ]

    alphabetic_letters = [
        character
        for character in message
        if character.isalpha()
    ]

    if alphabetic_letters:
        uppercase_ratio = (
            len(uppercase_letters)
            / len(alphabetic_letters)
        )

        if uppercase_ratio > 0.4:
            risk += 10

            reasons.append(
                "Message uses excessive uppercase text, a common pressure tactic."
            )

    # Excessive exclamation marks
    if message.count("!") >= 3:
        risk += 5

        reasons.append(
            "Message uses excessive exclamation marks."
        )

    # Combined phishing pattern
    if (
        credential_matches
        and urgency_matches
        and threat_matches
    ):
        risk += 15

        reasons.append(
            "Multiple phishing indicators appear together: credential request, urgency, and account threat."
        )

    # Limit risk score
    risk = min(risk, 100)

    # Classification
    if risk >= 70:
        status = "Dangerous"

    elif risk >= 35:
        status = "Suspicious"

    else:
        status = "Safe"

    return {
        "status": status,
        "risk": risk,
        "reasons": reasons,
    }