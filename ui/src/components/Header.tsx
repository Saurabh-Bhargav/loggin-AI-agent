import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  status?: {
    network: string;
    architecture: string;
  };
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, status }) => {
  return (
    <header className="flex justify-between items-end mb-12">
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-mono tracking-[0.2em] uppercase mb-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Live System Intelligence
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-slate-400 max-w-md">{subtitle}</p>
      </div>

      {status && (
        <div className="flex gap-4 mb-2">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Network Status</p>
            <p className="text-sm font-mono text-emerald-400">{status.network}</p>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Architecture</p>
            <p className="text-sm font-mono text-white">{status.architecture}</p>
          </div>
        </div>
      )}
    </header>
  );
};