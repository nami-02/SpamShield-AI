import whois
import tldextract
from urllib.parse import urlparse


def get_domain_info(url):
    try:
        # Add scheme if missing
        if not url.startswith(("http://", "https://")):
            url = "http://" + url

        parsed = urlparse(url)

        extracted = tldextract.extract(parsed.netloc)
        domain = f"{extracted.domain}.{extracted.suffix}"

        w = whois.whois(domain)

        creation_date = w.creation_date
        expiration_date = w.expiration_date

        # Sometimes WHOIS returns a list
        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if isinstance(expiration_date, list):
            expiration_date = expiration_date[0]

        return {
            "domain": domain,
            "registrar": w.registrar,
            "creation_date": str(creation_date) if creation_date else None,
            "expiration_date": str(expiration_date) if expiration_date else None,
            "country": w.country,
            "name_servers": w.name_servers,
            "https": parsed.scheme == "https"
        }

    except Exception as e:
        return {
            "error": str(e)
        }