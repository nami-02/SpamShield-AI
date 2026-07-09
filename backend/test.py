from services.whois_service import get_domain_info

result = get_domain_info("https://google.com")

print(result)