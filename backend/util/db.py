import re
from typing import Tuple


def sanitizeInput(payload: dict) -> dict:
    for k, v in payload.items():
        if type(v) == str:
            payload[k] = re.sub("'", "''", v)
    return payload

def verifyInput(payload: dict, keys: Tuple[str]) -> Tuple:
    for key in keys:
        try:
            payload[key]
        except KeyError as e:
            return (False, str(e))
    return (True, None)
    