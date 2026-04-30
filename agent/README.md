# Monitoring AI Agent

AI-powered monitoring and alerting system that analyzes alerts, detects patterns, and predicts potential issues.

## Features

- **Alert Analysis**: AI-powered analysis of system alerts using Google's Gemini
- **Pattern Detection**: Automatically identifies recurring issues and patterns
- **Predictive Monitoring**: Forecasts potential problems based on historical data
- **REST API**: FastAPI-based RESTful API for integration
- **In-Memory Storage**: Simple storage for alerts, patterns, and predictions

## Installation

### From Source

```bash
git clone https://github.com/Saurabh-Bhargav/loggin-AI-agent.git
cd monitoringAoo/agent
pip install -r requirements.txt
```

### From Wheel

```bash
pip install monitoring_ai_agent-0.1.0-py3-none-any.whl
```

## Building the Wheel

```bash
pip install build
python -m build
```

The wheel will be created in the `dist/` directory.

## Usage

### Running the Server

```bash
# From source
python -m monitoring_agent.main

# Or using uvicorn directly
uvicorn monitoring_agent.app:app --host 0.0.0.0 --port 8000
```

### API Endpoints

- `GET /health` - Health check
- `POST /analyze` - Analyze an alert
- `GET /alerts` - Get recent alerts
- `GET /patterns` - Get detected patterns
- `GET /predictions` - Get predictions

### Example Alert Analysis

```bash
curl -X POST "http://localhost:8000/analyze" \
     -H "Content-Type: application/json" \
     -d '{"alert": "High CPU usage detected on server-01"}'
```

## Configuration

Set the following environment variables:

- `GEMINI_API_KEY` - Your Google Gemini API key

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black src/
flake8 src/
```

### Type Checking

```bash
mypy src/
```

## Docker

Build and run with Docker:

```bash
docker build -t monitoring-agent .
docker run -p 8000:8000 -e GEMINI_API_KEY=AIzaSyB7HG5A2fXKzaUbPMi397zp2DF7UGU9ziw monitoring-agent
```

## License

MIT License