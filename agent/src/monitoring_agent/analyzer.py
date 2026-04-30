"""AI analyzer module using Gemini API."""

import os
import requests
from datetime import datetime
from typing import Optional
from .models import AlertAnalysis


class AIAnalyzer:
    """AI analyzer using Google's Gemini API."""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not set. AI analysis will return mock responses.")
            self.api_key = None  # Allow operation with mock responses

        self.api_url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

    def analyze_alert(self, alert_text: str) -> AlertAnalysis:
        """Analyze a single alert using AI."""
        if not self.api_key:
            # Return mock analysis for testing
            return AlertAnalysis(
                root_cause="Mock: Unable to determine root cause without API key",
                impact="Mock: Unknown impact - requires AI analysis",
                suggested_fix="Mock: Set GEMINI_API_KEY environment variable for real analysis",
                confidence=0.0,
                timestamp=datetime.now()
            )

        prompt = f"""
You are an expert SRE assistant analyzing system alerts.

Alert to analyze:
{alert_text}

Provide a structured analysis in the following JSON format:
{{
    "root_cause": "Brief description of the likely root cause",
    "impact": "Description of the impact on the system/users",
    "suggested_fix": "Step-by-step remediation actions",
    "confidence": 0.85
}}

Be specific, actionable, and consider common infrastructure issues.
Confidence should be between 0.0 and 1.0 based on how certain you are.
"""

        try:
            response = requests.post(
                self.api_url,
                params={"key": self.api_key},
                json={
                    "contents": [
                        {"parts": [{"text": prompt}]}
                    ]
                },
                timeout=15
            )
            response.raise_for_status()

            # Parse the response
            result = response.json()
            text = result["candidates"][0]["content"]["parts"][0]["text"]

            # Extract JSON from response (assuming AI returns valid JSON)
            import json
            analysis_data = json.loads(text.strip())

            return AlertAnalysis(
                root_cause=analysis_data["root_cause"],
                impact=analysis_data["impact"],
                suggested_fix=analysis_data["suggested_fix"],
                confidence=float(analysis_data["confidence"]),
                timestamp=datetime.now()
            )

        except Exception as e:
            # Fallback analysis
            return AlertAnalysis(
                root_cause="Unable to determine root cause due to analysis error",
                impact="Unknown impact - requires manual investigation",
                suggested_fix="Check system logs and metrics for more details",
                confidence=0.1,
                timestamp=datetime.now()
            )

    def detect_patterns(self, alerts: list) -> list:
        """Detect patterns in multiple alerts."""
        if len(alerts) < 2:
            return []

        # Simple pattern detection - group by similar keywords
        patterns = {}
        for alert in alerts[-50:]:  # Last 50 alerts
            text = alert.alert.lower()
            key_words = []
            if "cpu" in text or "memory" in text:
                key_words.append("resource")
            if "timeout" in text or "connection" in text:
                key_words.append("connectivity")
            if "error" in text or "exception" in text:
                key_words.append("error")

            key = "_".join(sorted(key_words)) or "general"
            if key not in patterns:
                patterns[key] = []
            patterns[key].append(alert.id)

        detected = []
        for pattern_type, alert_ids in patterns.items():
            if len(alert_ids) >= 3:  # At least 3 alerts for a pattern
                detected.append({
                    "type": pattern_type,
                    "alerts": alert_ids,
                    "frequency": len(alert_ids)
                })

        return detected


# Global analyzer instance
analyzer = AIAnalyzer()