import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

BASE_URL = "https://www.virustotal.com/api/v3"

HEADERS = {
    "x-apikey": API_KEY
}


def check_virustotal(url):

    if not API_KEY:
        return {
            "status": "API Key Missing"
        }

    # Step 1: Submit URL
    response = requests.post(
        f"{BASE_URL}/urls",
        headers=HEADERS,
        data={"url": url}
    )

    if response.status_code != 200:
        return {
            "status": "Submission Failed",
            "code": response.status_code
        }

    analysis_id = response.json()["data"]["id"]

    # Give VirusTotal a moment to process
    time.sleep(3)

    # Step 2: Retrieve analysis
    response = requests.get(
        f"{BASE_URL}/analyses/{analysis_id}",
        headers=HEADERS
    )

    if response.status_code != 200:
        return {
            "status": "Analysis Failed",
            "code": response.status_code
        }

    stats = response.json()["data"]["attributes"]["stats"]

    return {
        "status": "Success",
        "malicious": stats["malicious"],
        "suspicious": stats["suspicious"],
        "harmless": stats["harmless"],
        "undetected": stats["undetected"],
        "timeout": stats["timeout"]
    }