from urllib.parse import urlparse
import ipaddress
from analyzer.entropy import calculate_entropy


def extract_features(url):
    parsed = urlparse(url)
    host = parsed.netloc.split(":")[0].lower()

    features = {}

    # TLD Risk
    tld = host.split(".")[-1]
    risky_tlds = {
        "xyz",
        "top",
        "click",
        "work",
        "gq",
        "cf",
        "tk",
        "ml",
        "ga"
    }

    features["risky_tld"] = tld in risky_tlds

    # Entropy
    entropy = calculate_entropy(host)

    # Basic Features
    features["https"] = parsed.scheme == "https"
    features["url_length"] = len(url)
    features["domain_length"] = len(host)
    features["subdomains"] = host.count(".")
    features["hyphens"] = host.count("-")
    features["has_at"] = "@" in url

    # IP Address Check
    features["has_ip"] = False
    try:
        ipaddress.ip_address(host)
        features["has_ip"] = True
    except ValueError:
        pass

    # Suspicious Keywords
    suspicious = [
        "login",
        "verify",
        "bank",
        "gift",
        "free",
        "password",
        "secure",
        "reward",
        "wallet",
        "payment"
    ]

    url_lower = url.lower()
    features["keyword_count"] = 0

    for word in suspicious:
        if word in url_lower:
            features["keyword_count"] += 1

    # URL Shortener Detection
    shorteners = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "cutt.ly",
        "is.gd",
        "rb.gy"
    ]

    features["is_shortener"] = host in shorteners

    # Entropy
    features["entropy"] = entropy

    # Additional Features
    features["dots"] = url.count(".")
    features["digits"] = sum(c.isdigit() for c in url)
    features["slashes"] = url.count("/")
    features["question_marks"] = url.count("?")
    features["equals"] = url.count("=")
    features["ampersands"] = url.count("&")
    features["underscores"] = url.count("_")
    features["percent"] = url.count("%")

    return features