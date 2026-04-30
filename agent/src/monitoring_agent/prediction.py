"""Prediction module for forecasting potential issues."""

import requests
from datetime import datetime, timedelta
from typing import List, Optional
from .models import Prediction, Pattern, Alert
from .analyzer import analyzer
from .storage import storage
from .storage import storage


class Predictor:
    """AI-powered predictor for potential issues."""

    def generate_predictions(self) -> List[Prediction]:
        """Generate predictions based on patterns and recent alerts."""
        predictions = []

        # Get recent alerts (last 24 hours)
        recent_alerts = [
            alert for alert in storage.alerts.values()
            if alert.timestamp > datetime.now() - timedelta(hours=24)
        ]

        # Get patterns
        patterns = storage.get_patterns()

        # Predict based on resource patterns
        resource_patterns = [p for p in patterns if "resource" in p.description.lower()]
        if resource_patterns and len(recent_alerts) > 5:
            predictions.append(Prediction(
                id="",
                description="Potential resource exhaustion in next 12-24 hours",
                probability=0.7,
                timeframe="next 24 hours",
                suggested_actions=[
                    "Monitor resource usage closely",
                    "Consider scaling up resources",
                    "Review application performance metrics"
                ],
                based_on_patterns=[p.id for p in resource_patterns],
                timestamp=datetime.now()
            ))

        # Predict based on connectivity patterns
        connectivity_patterns = [p for p in patterns if "connectivity" in p.description.lower()]
        if connectivity_patterns:
            predictions.append(Prediction(
                id="",
                description="Possible network connectivity issues",
                probability=0.6,
                timeframe="next 6-12 hours",
                suggested_actions=[
                    "Check network configuration",
                    "Monitor network latency",
                    "Review firewall rules"
                ],
                based_on_patterns=[p.id for p in connectivity_patterns],
                timestamp=datetime.now()
            ))

        # AI-based prediction using recent alerts
        if len(recent_alerts) >= 3:
            ai_prediction = self._ai_based_prediction(recent_alerts)
            if ai_prediction:
                predictions.append(ai_prediction)

        return predictions

    def _ai_based_prediction(self, alerts: List[Alert]) -> Optional[Prediction]:
        """Use AI to generate predictions from alert patterns."""
        alert_texts = [f"{alert.timestamp}: {alert.alert}" for alert in alerts[-10:]]

        prompt = f"""
Based on these recent alerts, predict what might happen next:

{chr(10).join(alert_texts)}

Provide a prediction in JSON format:
{{
    "description": "What might happen",
    "probability": 0.75,
    "timeframe": "next X hours/days",
    "actions": ["action1", "action2"]
}}

If no clear pattern, return empty object {{}}.
"""

        try:
            # Use analyzer's API call method
            response = requests.post(
                analyzer.api_url,
                params={"key": analyzer.api_key},
                json={
                    "contents": [
                        {"parts": [{"text": prompt}]}
                    ]
                },
                timeout=15
            )
            response.raise_for_status()

            result = response.json()
            text = result["candidates"][0]["content"]["parts"][0]["text"]

            import json
            pred_data = json.loads(text.strip())

            if pred_data and "description" in pred_data:
                return Prediction(
                    id="",
                    description=pred_data["description"],
                    probability=float(pred_data.get("probability", 0.5)),
                    timeframe=pred_data.get("timeframe", "unknown"),
                    suggested_actions=pred_data.get("actions", []),
                    based_on_patterns=[],
                    timestamp=datetime.now()
                )

        except Exception:
            pass

        return None


# Global predictor instance
predictor = Predictor()