"""Main FastAPI application for the monitoring agent."""

import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import AlertRequest, Alert, AlertAnalysis, HealthResponse, Prediction
from .storage import storage
from .analyzer import analyzer
from .prediction import predictor

app = FastAPI(
    title="Monitoring AI Agent",
    description="AI-powered monitoring and alerting system",
    version="0.1.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        version="0.1.0",
        uptime="running"
    )

@app.post("/analyze")
def analyze_alert(req: AlertRequest):
    """Analyze a single alert using AI."""
    try:
        # Create alert object
        alert = Alert(
            id="",
            alert=req.alert,
            timestamp=req.timestamp or datetime.now(),
            source=req.source,
            severity=req.severity
        )

        # Store the alert
        alert_id = storage.add_alert(alert)

        # Analyze with AI
        analysis = analyzer.analyze_alert(req.alert)

        # Update alert with analysis
        alert.analysis = analysis
        storage.alerts[alert_id] = alert

        return {
            "alert_id": alert_id,
            "analysis": analysis.dict(),
            "timestamp": analysis.timestamp
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/alerts")
def get_alerts(limit: int = 50, offset: int = 0):
    """Get recent alerts."""
    alerts = storage.get_alerts(limit=limit, offset=offset)
    return {
        "alerts": [alert.dict() for alert in alerts],
        "total": len(storage.alerts),
        "limit": limit,
        "offset": offset
    }

@app.get("/alerts/{alert_id}")
def get_alert(alert_id: str):
    """Get a specific alert by ID."""
    alert = storage.get_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert.dict()

@app.get("/patterns")
def get_patterns():
    """Get detected patterns."""
    patterns = storage.get_patterns()
    return {"patterns": [p.dict() for p in patterns]}

@app.get("/predictions")
def get_predictions():
    """Get current predictions."""
    predictions = predictor.generate_predictions()
    # Store new predictions
    for pred in predictions:
        if not pred.id:  # New prediction
            storage.add_prediction(pred)

    stored_predictions = storage.get_predictions()
    return {"predictions": [p.dict() for p in stored_predictions]}

@app.post("/patterns/detect")
def detect_patterns():
    """Manually trigger pattern detection."""
    alerts = list(storage.alerts.values())
    patterns = analyzer.detect_patterns(alerts)

    # Store detected patterns
    for pattern_data in patterns:
        pattern = Pattern(
            id="",
            description=f"Pattern: {pattern_data['type']}",
            alerts=pattern_data['alerts'],
            frequency=pattern_data['frequency'],
            last_seen=datetime.now(),
            predicted_impact=f"Recurring {pattern_data['type']} issues"
        )
        storage.add_pattern(pattern)

    return {"detected_patterns": len(patterns)}

@app.delete("/data/cleanup")
def cleanup_old_data(days: int = 30):
    """Clean up old data."""
    storage.cleanup_old_data(days=days)
    return {"message": f"Cleaned up data older than {days} days"}