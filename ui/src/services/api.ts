import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Alert {
  id: string;
  alert: string;
  timestamp: string;
  source?: string;
  severity?: string;
  analysis?: {
    root_cause: string;
    impact: string;
    suggested_fix: string;
    confidence: number;
    timestamp: string;
  };
}

export interface Prediction {
  id: string;
  description: string;
  probability: number;
  timeframe: string;
  suggested_actions: string[];
  based_on_patterns: string[];
  timestamp: string;
}

export interface Pattern {
  id: string;
  description: string;
  alerts: string[];
  frequency: number;
  last_seen: string;
  predicted_impact: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  uptime?: string;
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async getHealth(): Promise<HealthResponse> {
    const response = await this.api.get('/health');
    return response.data;
  }

  async analyzeAlert(alert: string, source?: string, severity?: string): Promise<{alert_id: string; analysis: any; timestamp: string}> {
    const response = await this.api.post('/analyze', {
      alert,
      source,
      severity,
      timestamp: new Date().toISOString()
    });
    return response.data;
  }

  async getAlerts(limit: number = 50, offset: number = 0): Promise<{alerts: Alert[]; total: number; limit: number; offset: number}> {
    const response = await this.api.get('/alerts', { params: { limit, offset } });
    return response.data;
  }

  async getAlert(alertId: string): Promise<Alert> {
    const response = await this.api.get(`/alerts/${alertId}`);
    return response.data;
  }

  async getPatterns(): Promise<{patterns: Pattern[]}> {
    const response = await this.api.get('/patterns');
    return response.data;
  }

  async getPredictions(): Promise<{predictions: Prediction[]}> {
    const response = await this.api.get('/predictions');
    return response.data;
  }

  async detectPatterns(): Promise<{detected_patterns: number}> {
    const response = await this.api.post('/patterns/detect');
    return response.data;
  }
}

export const apiService = new ApiService();