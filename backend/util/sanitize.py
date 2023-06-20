import re


def sanitizeInput(payload: dict) -> dict:
    for k, v in payload.items():
        payload[k] = re.sub("'", "''", v)
    return payload