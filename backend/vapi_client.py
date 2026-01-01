import os
import requests


class VapiError(RuntimeError):
    pass


def place_call(phone: str, message: str) -> None:
    
    api_key = os.getenv("VAPI_API_KEY", "")
    base_url = os.getenv("VAPI_BASE_URL", "https://api.vapi.ai").rstrip("/")
    assistant_id = os.getenv("VAPI_ASSISTANT_ID", "")
    phone_number_id = os.getenv("VAPI_PHONE_NUMBER_ID", "")

    if not api_key or not assistant_id or not phone_number_id:
        raise VapiError(
            "Missing Vapi env vars. Set VAPI_API_KEY, VAPI_ASSISTANT_ID, VAPI_PHONE_NUMBER_ID "
            "(and optionally VAPI_BASE_URL)."
        )

    url = f"{base_url}/call" 

    payload = {
        "assistantId": assistant_id,
        "phoneNumberId": phone_number_id,
        "customer": {"number": phone},
        "assistantOverrides": {
            "variableValues": {
                "reminder_message": message
            }
        },
    } 

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=15)
    except requests.RequestException as e:
        raise VapiError(f"Vapi request failed: {e}") from e

    if resp.status_code >= 300:
        raise VapiError(f"Vapi returned {resp.status_code}: {resp.text}")
