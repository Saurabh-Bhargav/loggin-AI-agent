import React from 'react';
import { Shield, Activity, Terminal, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'predictions', icon: TrendingUp, label: 'Predictions' },
    { id: 'console', icon: Terminal, label: 'Console' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-16 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center py-8 gap-8 z-50">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
        <Shield className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-5 h-5 transition-colors ${
                isActive
                  ? 'text-blue-400'
                  : 'text-slate-500 hover:text-blue-400'
              }`}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};