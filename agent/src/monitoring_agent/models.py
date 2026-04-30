"""Data models for the monitoring agent."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class AlertRequest(BaseModel):
    alert: str
    timestamp: Optional[datetime] = None
    source: Optional[str] = None
    severity: Optional[str] = None


class AlertAnalysis(BaseModel):
    root_cause: str
    impact: str
    suggested_fix: str
    confidence: float
    timestamp: datetime


class Alert(BaseModel):
    id: str
    alert: str
    timestamp: datetime
    source: Optional[str] = None
    severity: Optional[str] = None
    analysis: Optional[AlertAnalysis] = None


class Pattern(BaseModel):
    id: str
    description: str
    alerts: List[str]  # Alert IDs
    frequency: int
    last_seen: datetime
    predicted_impact: str


class Prediction(BaseModel):
    id: str
    description: str
    probability: float
    timeframe: str  # e.g., "next 24 hours"
    suggested_actions: List[str]
    based_on_patterns: List[str]  # Pattern IDs
    timestamp: datetime


class HealthResponse(BaseModel):
    status: str
    version: str
    uptime: Optional[str] = None