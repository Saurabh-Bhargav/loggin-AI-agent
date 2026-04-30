import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, Clock, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import type { Alert } from '../services/api';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    fetchAlerts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await apiService.getAlerts(100);
      setAlerts(response.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.alert.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (alert.source && alert.source.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'info': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-slate-300 hover:text-white transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Alert Stream</h3>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/5 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence>
              {filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-white/[0.03] border border-white/5 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.05] ${
                    selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-orange-400" />
                      <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity || 'unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <p className="text-white mb-2">{alert.alert}</p>

                  {alert.source && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <User size={12} />
                      {alert.source}
                    </div>
                  )}

                  {alert.analysis && (
                    <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                      <div className="flex items-center gap-1 text-xs text-blue-400 mb-1">
                        <Zap size={12} />
                        AI Analysis Available
                      </div>
                      <p className="text-xs text-slate-300 truncate">
                        {alert.analysis.root_cause}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Alert Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Alert Details</h3>

          <AnimatePresence mode="wait">
            {selectedAlert ? (
              <motion.div
                key={selectedAlert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={20} className="text-orange-400" />
                  <span className={`text-sm px-3 py-1 rounded border ${getSeverityColor(selectedAlert.severity)}`}>
                    {selectedAlert.severity || 'unknown'}
                  </span>
                </div>

                <h4 className="text-lg font-medium text-white mb-4">{selectedAlert.alert}</h4>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Timestamp</p>
                    <p className="text-white">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                  </div>

                  {selectedAlert.source && (
                    <div>
                      <p className="text-slate-500 mb-1">Source</p>
                      <p className="text-white">{selectedAlert.source}</p>
                    </div>
                  )}

                  {selectedAlert.analysis && (
                    <div className="mt-6 space-y-4">
                      <h5 className="text-white font-medium flex items-center gap-2">
                        <Zap size={16} className="text-blue-400" />
                        AI Analysis
                      </h5>

                      <div>
                        <p className="text-slate-500 mb-1">Root Cause</p>
                        <p className="text-white">{selectedAlert.analysis.root_cause}</p>
                      </div>

                      <div>
                        <p className="text-slate-500 mb-1">Impact</p>
                        <p className="text-white">{selectedAlert.analysis.impact}</p>
                      </div>

                      <div>
                        <p className="text-slate-500 mb-1">Suggested Fix</p>
                        <p className="text-white">{selectedAlert.analysis.suggested_fix}</p>
                      </div>

                      <div>
                        <p className="text-slate-500 mb-1">Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${selectedAlert.analysis.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-xs">
                            {(selectedAlert.analysis.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-6 text-center"
              >
                <AlertTriangle size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">Select an alert to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};