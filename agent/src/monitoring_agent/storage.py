"""Storage module for alerts, patterns, and predictions."""

from typing import List, Dict, Optional
from datetime import datetime, timedelta
import uuid
from .models import Alert, Pattern, Prediction


class InMemoryStorage:
    """Simple in-memory storage for MVP."""

    def __init__(self):
        self.alerts: Dict[str, Alert] = {}
        self.patterns: Dict[str, Pattern] = {}
        self.predictions: Dict[str, Prediction] = {}

    def add_alert(self, alert: Alert) -> str:
        """Add an alert and return its ID."""
        alert_id = str(uuid.uuid4())
        alert.id = alert_id
        self.alerts[alert_id] = alert
        return alert_id

    def get_alerts(self, limit: int = 100, offset: int = 0) -> List[Alert]:
        """Get alerts with pagination."""
        alerts = list(self.alerts.values())
        alerts.sort(key=lambda x: x.timestamp, reverse=True)
        return alerts[offset:offset + limit]

    def get_alert(self, alert_id: str) -> Optional[Alert]:
        """Get a specific alert by ID."""
        return self.alerts.get(alert_id)

    def add_pattern(self, pattern: Pattern) -> str:
        """Add a pattern and return its ID."""
        pattern_id = str(uuid.uuid4())
        pattern.id = pattern_id
        self.patterns[pattern_id] = pattern
        return pattern_id

    def get_patterns(self) -> List[Pattern]:
        """Get all patterns."""
        return list(self.patterns.values())

    def add_prediction(self, prediction: Prediction) -> str:
        """Add a prediction and return its ID."""
        prediction_id = str(uuid.uuid4())
        prediction.id = prediction_id
        self.predictions[prediction_id] = prediction
        return prediction_id

    def get_predictions(self, limit: int = 50) -> List[Prediction]:
        """Get recent predictions."""
        predictions = list(self.predictions.values())
        predictions.sort(key=lambda x: x.timestamp, reverse=True)
        return predictions[:limit]

    def cleanup_old_data(self, days: int = 30):
        """Remove data older than specified days."""
        cutoff = datetime.now() - timedelta(days=days)
        self.alerts = {k: v for k, v in self.alerts.items() if v.timestamp > cutoff}
        self.patterns = {k: v for k, v in self.patterns.items() if v.last_seen > cutoff}
        self.predictions = {k: v for k, v in self.predictions.items() if v.timestamp > cutoff}


# Global storage instance
storage = InMemoryStorage()