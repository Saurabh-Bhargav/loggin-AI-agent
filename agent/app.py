from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os

app = FastAPI()

class AlertRequest(BaseModel):
    alert: str

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
def analyze(req: AlertRequest):
    try:
        prompt = f"""
You are an SRE assistant.

Analyze this alert:
{req.alert}

Provide:
1. Root cause
2. Impact
3. Suggested fix
"""

        response = requests.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
            params={"key": GEMINI_API_KEY},
            json={
                "contents": [
                    {"parts": [{"text": prompt}]}
                ]
            },
            timeout=10
        )

        response.raise_for_status()
        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))