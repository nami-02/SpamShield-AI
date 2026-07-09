def calculate_risk(features):

    risk = 0
    reasons = []

    if not features["https"]:
        risk += 20
        reasons.append("Uses HTTP")

    if features["url_length"] > 75:
        risk += 15
        reasons.append("Very long URL")

    if features["entropy"] > 3.8:
        risk += 15
        reasons.append("Domain appears highly random")

    if features["domain_length"] > 30:
        risk += 10
        reasons.append("Unusually long domain name")

    if features["has_ip"]:
        risk += 25
        reasons.append("Uses IP Address")

    if features["keyword_count"] > 0:
        risk += features["keyword_count"] * 10
        reasons.append(
            f"Contains {features['keyword_count']} suspicious keywords"
        )

    if features["subdomains"] >= 3:
        risk += 10
        reasons.append("Too many subdomains")

    if features["hyphens"] >= 2:
        risk += 10
        reasons.append("Too many hyphens")

    if features["has_at"]:
        risk += 15
        reasons.append("Contains @ symbol")

    if features["is_shortener"]:
        risk += 20
        reasons.append("Uses URL shortener")

    risk = min(risk, 100)

    if risk >= 60:
        status = "Dangerous"
    elif risk >= 30:
        status = "Suspicious"
    else:
        status = "Safe"

    return status, risk, reasons