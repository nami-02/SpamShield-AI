def generate_explanation(result, domain_info, trust):
    explanation = []

    # HTTPS
    if domain_info.get("https"):
        explanation.append("The website uses HTTPS, which helps secure communication.")
    else:
        explanation.append("The website does not use HTTPS, which increases security risk.")

    # AI Prediction
    if result["status"] == "Safe":
        explanation.append("The AI model classified this URL as safe.")
    elif result["status"] == "Suspicious":
        explanation.append("The AI model found suspicious characteristics.")
    else:
        explanation.append("The AI model classified this URL as dangerous.")

    # VirusTotal
    vt = result.get("virus_total", {})
    malicious = vt.get("malicious", 0)

    if malicious == 0:
        explanation.append("VirusTotal did not report any malicious detections.")
    else:
        explanation.append(
            f"VirusTotal reported {malicious} security vendors flagging this URL."
        )

    # Domain Age
    if domain_info.get("creation_date"):
        explanation.append("WHOIS information is available for this domain.")
    else:
        explanation.append("Domain registration information could not be retrieved.")

    # Trust reasons
    explanation.extend(trust["trust_reasons"])

    return explanation