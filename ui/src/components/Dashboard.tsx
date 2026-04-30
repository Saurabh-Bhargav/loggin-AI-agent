import React, { useState, useEffect } from 'react';
import { Globe, Cpu, Database, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import type { Alert, Prediction } from '../services/api';

const MOCK_DATA = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  latency: Math.floor(Math.random() * 20) + 40,
  requests: Math.floor(Math.random() * 100) + 200,
}));

export const Dashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsResponse, predictionsResponse] = await Promise.all([
          apiService.getAlerts(10),
          apiService.getPredictions()
        ]);
        setAlerts(alertsResponse.alerts);
        setPredictions(predictionsResponse.predictions);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const recentAlerts = alerts.slice(0, 5);
  const criticalPredictions = predictions.filter(p => p.probability > 0.7).slice(0, 3);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Infrastructure Overview */}
      <section className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <Globe size={16} className="text-blue-400" /> Infrastructure Status
          </h3>
          <div className="space-y-4">
            {[
              { name: 'API Server', status: 'healthy', load: '45%' },
              { name: 'Database', status: 'healthy', load: '32%' },
              { name: 'Cache Layer', status: 'warning', load: '78%' }
            ].map((service) => (
              <div key={service.name} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{service.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      service.status === 'healthy' ? 'bg-emerald-400' :
                      service.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <p className="text-sm font-medium text-white">{service.load} Load</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className={`text-sm font-medium capitalize ${
                    service.status === 'healthy' ? 'text-emerald-400' :
                    service.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {service.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-400" /> Recent Alerts
          </h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-slate-500 text-sm">Loading alerts...</p>
            ) : recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-white/[0.02] border border-white/5 rounded-lg"
                >
                  <p className="text-xs text-slate-400 mb-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-white truncate">{alert.alert}</p>
                  {alert.severity && (
                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                      alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {alert.severity}
                    </span>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent alerts</p>
            )}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="col-span-12 lg:col-span-8 space-y-6">
        {/* Charts */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" /> Performance Metrics
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="latency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="requests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#latency)" />
                <Area type="monotone" dataKey="requests" stroke="#10b981" fillOpacity={1} fill="url(#requests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <Activity size={16} className="text-purple-400" /> AI Predictions
          </h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-500 text-sm">Loading predictions...</p>
            ) : criticalPredictions.length > 0 ? (
              criticalPredictions.map((prediction) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-white">{prediction.description}</h4>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      {(prediction.probability * 100).toFixed(0)}% probability
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{prediction.timeframe}</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.suggested_actions.slice(0, 2).map((action, index) => (
                      <span key={index} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded">
                        {action}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No critical predictions at this time</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};