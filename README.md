# Monitoring AI Agent

A comprehensive AI-powered monitoring and alerting system that analyzes alerts, detects patterns, and predicts potential issues using Google's Gemini AI.

## Architecture

The system consists of three main components:

- **Backend (Agent)**: FastAPI-based REST API with AI analysis capabilities
- **Frontend (UI)**: React/TypeScript dashboard with real-time monitoring
- **Deployment**: Kubernetes manifests for production deployment

## Features

### Backend Features
- **Alert Analysis**: AI-powered analysis using Google Gemini
- **Pattern Detection**: Automatic identification of recurring issues
- **Predictive Monitoring**: AI-based forecasting of potential problems
- **RESTful API**: Complete API for alert management and insights
- **In-Memory Storage**: Fast storage for alerts and patterns

### Frontend Features
- **Real-time Dashboard**: Live system monitoring and metrics
- **Alert Management**: Comprehensive alert viewing and analysis
- **AI Predictions**: Display of predicted issues with confidence levels
- **Interactive Console**: Terminal-like interface for system interaction
- **Professional UI**: Dark theme with animations and modern design

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Docker (optional)

### Backend Setup

```bash
cd agent
pip install -r requirements.txt
python src/monitoring_agent/main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd ui
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the agent directory:

```bash
GEMINI_API_KEY=AIzaSyB7HG5A2fXKzaUbPMi397zp2DF7UGU9ziw
```

## API Endpoints

### Health Check
```http
GET /health
```

### Alert Analysis
```http
POST /analyze
Content-Type: application/json

{
  "alert": "High CPU usage detected",
  "source": "monitoring-system",
  "severity": "warning"
}
```

### Get Alerts
```http
GET /alerts?limit=50&offset=0
```

### Get Predictions
```http
GET /predictions
```

### Get Patterns
```http
GET /patterns
```

## Development

### Backend Development

```bash
cd agent
pip install -r requirements.txt
# For development
pip install -e .
```

### Frontend Development

```bash
cd ui
npm install
npm run dev
```

### Building

#### Python Wheel
```bash
cd agent
python -m build
```

#### Frontend Build
```bash
cd ui
npm run build
```

## Docker Deployment

### Backend
```bash
cd agent
docker build -t monitoring-agent .
docker run -p 8000:8000 -e GEMINI_API_KEY=AIzaSyB7HG5A2fXKzaUbPMi397zp2DF7UGU9ziw monitoring-agent
```

### Frontend
```bash
cd ui
npm run build
# Serve the dist/ directory with any static server
```

## Kubernetes Deployment

Apply the manifests in the `k8s/` directory:

```bash
kubectl apply -f k8s/
```

## Testing

### Backend Tests
```bash
cd agent
pytest
```

### Frontend Tests
```bash
cd ui
npm run test  # (if configured)
```

## Configuration

### Backend Configuration
- `GEMINI_API_KEY`: Required for AI analysis
- Storage is currently in-memory (can be extended to database)

### Frontend Configuration
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

## Architecture Details

### Backend Structure
```
agent/
├── src/monitoring_agent/
│   ├── __init__.py
│   ├── app.py          # FastAPI application
│   ├── models.py       # Pydantic models
│   ├── storage.py      # Data storage
│   ├── analyzer.py     # AI analysis
│   ├── prediction.py   # Prediction logic
│   └── main.py         # Entry point
├── pyproject.toml      # Packaging
├── requirements.txt    # Dependencies
└── Dockerfile
```

### Frontend Structure
```
ui/
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   └── App.tsx         # Main app
├── package.json
└── vite.config.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License

## Roadmap

- [ ] Database integration (PostgreSQL)
- [ ] Real-time WebSocket updates
- [ ] Advanced ML models for prediction
- [ ] Integration with Prometheus/Grafana
- [ ] Alert escalation and notification system
- [ ] Multi-tenant support
- [ ] REST API authentication