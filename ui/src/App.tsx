import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Terminal, Cpu, Database, 
  Globe, AlertTriangle, CheckCircle2, ChevronRight, BarChart3 
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DATA = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  latency: Math.floor(Math.random() * 20) + 40,
  requests: Math.floor(Math.random() * 100) + 200,
}));

const SentinAIConsole = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [logs, setLogs] = useState([
    { id: 1, time: '22:14:01', status: 'sys', msg: 'SentinAI Core Engine Initialized. Connecting to K3s...' },
    { id: 2, time: '22:14:05', status: 'ok', msg: 'Prometheus MCP Server: Handshake Successful.' },
  ]);

  // Simulated AI Thinking Process
  useEffect(() => {
    const sequence = [
      { status: 'warn', msg: 'Traffic spike detected in namespace: default' },
      { status: 'ai', msg: 'Analyzing Pod: payment-api-v2-7x92j' },
      { status: 'ai', msg: 'Reasoning: Resource limit reached. Suggesting horizontal scaling.' },
      { status: 'ok', msg: 'Auto-remediation plan generated: HPA target adjusted.' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, { id: Date.now(), time: new Date().toLocaleTimeString(), ...sequence[i] }]);
        i++;
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background Blur */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Main Sidebar (Slim) */}
      <nav className="fixed left-0 top-0 h-full w-16 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Shield className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col gap-6">
          <Activity className="w-5 h-5 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors" />
          <BarChart3 className="w-5 h-5 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors" />
          <Terminal className="w-5 h-5 text-blue-400 cursor-pointer transition-colors" />
        </div>
      </nav>

      {/* Content Area */}
      <div className="pl-24 pr-8 py-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono tracking-[0.2em] uppercase mb-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Live System Intelligence
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">SentinAI Console</h1>
            <p className="mt-2 text-slate-400 max-w-md">Autonomous SRE Agent monitoring production workloads on K3s cluster.</p>
          </div>
          
          <div className="flex gap-4 mb-2">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Network Status</p>
              <p className="text-sm font-mono text-emerald-400">99.9% Uptime</p>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Architecture</p>
              <p className="text-sm font-mono text-white">K3s / ARM64</p>
            </div>
          </div>
        </header>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Node & Service Matrix */}
          <section className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                <Globe size={16} className="text-blue-400" /> Infrastructure Nodes
              </h3>
              <div className="space-y-4">
                {['master-node-01', 'worker-node-01'].map((node) => (
                  <div key={node} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Compute Instance</p>
                      <p className="text-sm font-medium text-white">{node}</p>
                    </div>
                    <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-4 text-slate-400">Resource Saturation</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span>CPU Cluster Usage</span>
                    <span className="text-blue-400 font-mono">42%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span>Memory Allocation</span>
                    <span className="text-purple-400 font-mono">68%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} className="h-full bg-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Real-time Visualization Center */}
          <section className="col-span-12 lg:col-span-6 space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 min-h-[400px] flex flex-col shadow-inner">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Latency Telemetry</h2>
                  <p className="text-xs text-slate-500 uppercase mt-1">Real-time p99 response times</p>
                </div>
                <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold">
                  LIVE STREAM
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_DATA}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222', color: '#fff' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Agent Logic Console */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-slate-400 uppercase">AI Reasoning Core</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                </div>
              </div>
              <div className="p-6 h-64 overflow-y-auto space-y-4 font-mono text-[13px] leading-relaxed">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 group"
                    >
                      <span className="text-slate-600 whitespace-nowrap">{log.time}</span>
                      <span className={`
                        ${log.status === 'ok' ? 'text-emerald-500' : ''}
                        ${log.status === 'warn' ? 'text-orange-400' : ''}
                        ${log.status === 'ai' ? 'text-blue-400 font-bold' : ''}
                        ${log.status === 'sys' ? 'text-slate-400' : ''}
                      `}>
                        [{log.status.toUpperCase()}]
                      </span>
                      <span className="text-slate-300">{log.msg}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Right Column: Alerts & Actions */}
          <section className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-orange-400 w-5 h-5" />
                <h3 className="text-sm font-semibold">Active Incidents</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-orange-400/5 border border-orange-400/10 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-orange-400 uppercase">Latency Warning</p>
                    <span className="text-[10px] text-orange-400/50 italic">12m ago</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight">Payment Service response {">"} 500ms in region US-EAST-1.</p>
                </div>
                
                <div className="p-4 bg-emerald-400/5 border border-emerald-400/10 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-emerald-400 uppercase">Fixed by AI</p>
                    <span className="text-[10px] text-emerald-400/50 italic">1h ago</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight">OOMKill detected in Redis cache. Memory limit increased by 256Mi.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-2 italic">Lead Architect</h4>
              <p className="text-xs text-slate-400 mb-4 font-mono">Designed by Saurabh Bhargav</p>
              <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                Download Architecture PDF <ChevronRight size={14} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SentinAIConsole;