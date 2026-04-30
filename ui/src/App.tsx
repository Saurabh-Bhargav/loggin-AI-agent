import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Alerts } from './components/Alerts';
import { Predictions } from './components/Predictions';
import { Console } from './components/Console';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'alerts':
        return <Alerts />;
      case 'insights':
        return <Dashboard />; // For now, reuse dashboard
      case 'predictions':
        return <Predictions />;
      case 'console':
        return <Console />;
      default:
        return <Dashboard />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'System Overview';
      case 'alerts':
        return 'Alert Management';
      case 'insights':
        return 'System Insights';
      case 'predictions':
        return 'AI Predictions';
      case 'console':
        return 'System Console';
      default:
        return 'SentinAI Console';
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Real-time monitoring and system intelligence';
      case 'alerts':
        return 'Monitor and analyze system alerts with AI assistance';
      case 'insights':
        return 'Deep analytics and performance insights';
      case 'predictions':
        return 'AI-powered predictions for potential issues';
      case 'console':
        return 'Direct system console and command interface';
      default:
        return 'Autonomous SRE Agent monitoring production workloads';
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 font-sans overflow-x-hidden">
      {/* Dynamic Background Blur */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="pl-24 pr-8 py-8 max-w-[1600px] mx-auto">
        <Header
          title={getTabTitle()}
          subtitle={getTabSubtitle()}
          status={{
            network: '99.9% Uptime',
            architecture: 'K3s / ARM64'
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;