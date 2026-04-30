"""Entry point for running the monitoring agent."""

import sys
import os

# Add the parent directory to the path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import uvicorn
from monitoring_agent.app import app

if __name__ == "__main__":
    uvicorn.run(
        "monitoring_agent.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )