import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import type { Prediction } from '../services/api';

export const Predictions: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPredictions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await apiService.getPredictions();
      setPredictions(response.predictions);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (probability >= 0.6) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (probability >= 0.4) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  const getTimeframeIcon = (timeframe: string) => {
    if (timeframe.includes('hour')) return Clock;
    if (timeframe.includes('day')) return AlertTriangle;
    return TrendingUp;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-blue-400" />
            <h3 className="text-lg font-medium text-white">Total Predictions</h3>
          </div>
          <p className="text-3xl font-bold text-white">{predictions.length}</p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={24} className="text-red-400" />
            <h3 className="text-lg font-medium text-white">High Risk</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {predictions.filter(p => p.probability > 0.7).length}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={24} className="text-green-400" />
            <h3 className="text-lg font-medium text-white">Resolved</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Active Predictions</h3>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/5 rounded mb-4"></div>
                <div className="h-2 bg-white/5 rounded"></div>
              </div>
            ))}
          </div>
        ) : predictions.length > 0 ? (
          <AnimatePresence>
            {predictions.map((prediction) => {
              const TimeframeIcon = getTimeframeIcon(prediction.timeframe);
              return (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/[0.03] border border-white/5 rounded-xl p-6 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TimeframeIcon size={20} className="text-blue-400" />
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">
                          {prediction.description}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded border ${getProbabilityColor(prediction.probability)}`}>
                            {(prediction.probability * 100).toFixed(0)}% probability
                          </span>
                          <span className="text-xs text-slate-500">
                            {prediction.timeframe}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Predicted</p>
                      <p className="text-xs text-white">
                        {new Date(prediction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Probability Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400">Confidence Level</span>
                      <span className="text-sm text-white">
                        {(prediction.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.probability * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-2 rounded-full ${
                          prediction.probability >= 0.8 ? 'bg-red-500' :
                          prediction.probability >= 0.6 ? 'bg-orange-500' :
                          prediction.probability >= 0.4 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Suggested Actions */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <Zap size={14} className="text-green-400" />
                      Recommended Actions
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {prediction.suggested_actions.map((action, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Based on Patterns */}
                  {prediction.based_on_patterns.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-400 mb-2">
                        Based on {prediction.based_on_patterns.length} pattern{prediction.based_on_patterns.length > 1 ? 's' : ''}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {prediction.based_on_patterns.slice(0, 3).map((patternId, index) => (
                          <span
                            key={index}
                            className="text-xs bg-slate-500/20 text-slate-400 px-2 py-1 rounded"
                          >
                            Pattern {patternId.slice(-4)}
                          </span>
                        ))}
                        {prediction.based_on_patterns.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{prediction.based_on_patterns.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-12 text-center">
            <TrendingUp size={48} className="text-slate-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">No Active Predictions</h4>
            <p className="text-slate-500">The system is currently stable with no predicted issues.</p>
          </div>
        )}
      </div>
    </div>
  );
};