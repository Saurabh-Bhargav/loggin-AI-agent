import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: number;
  time: string;
  status: 'ok' | 'warn' | 'error' | 'ai' | 'sys';
  msg: string;
}

export const Console: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, time: '22:14:01', status: 'sys', msg: 'SentinAI Core Engine Initialized. Connecting to monitoring backend...' },
    { id: 2, time: '22:14:05', status: 'ok', msg: 'API connection established successfully.' },
    { id: 3, time: '22:14:08', status: 'ai', msg: 'AI analysis engine loaded and ready.' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const startSimulation = () => {
    setIsRunning(true);
    const sequence = [
      { status: 'ai', msg: 'Scanning recent alerts for patterns...' },
      { status: 'ok', msg: 'Pattern analysis complete. 3 recurring issues detected.' },
      { status: 'warn', msg: 'High CPU usage pattern identified in web-tier' },
      { status: 'ai', msg: 'Generating predictions for next 24 hours...' },
      { status: 'ok', msg: 'Predictions generated. 2 potential issues flagged.' },
      { status: 'ai', msg: 'Monitoring system health checks...' },
      { status: 'ok', msg: 'All systems operational.' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          ...sequence[i]
        }]);
        i++;
      } else {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-400';
      case 'warn': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'ai': return 'text-blue-400';
      case 'sys': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return '✓';
      case 'warn': return '⚠';
      case 'error': return '✗';
      case 'ai': return '🤖';
      case 'sys': return '⚙';
      default: return '•';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={isRunning ? stopSimulation : startSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isRunning
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
          }`}
        >
          {isRunning ? <Square size={16} /> : <Play size={16} />}
          {isRunning ? 'Stop Simulation' : 'Start Simulation'}
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
          {isRunning ? 'Running' : 'Idle'}
        </div>
      </div>

      {/* Console Output */}
      <div className="bg-black/50 border border-white/5 rounded-xl p-6 font-mono text-sm">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
          <Terminal size={16} className="text-slate-400" />
          <span className="text-slate-400">SentinAI Console</span>
        </div>

        <div className="space-y-1 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 py-1"
              >
                <span className="text-slate-500 text-xs w-12 flex-shrink-0">
                  {log.time}
                </span>
                <span className={`text-xs w-4 flex-shrink-0 ${getStatusColor(log.status)}`}>
                  {getStatusIcon(log.status)}
                </span>
                <span className="text-slate-300 flex-1">{log.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>

        {/* Input Prompt */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <span className="text-green-400">sentinai@console:~$ </span>
          <span className={`animate-pulse ${isRunning ? 'inline' : 'hidden'}`}>▊</span>
        </div>
      </div>
    </div>
  );
};