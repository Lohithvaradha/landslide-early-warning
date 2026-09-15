import React from 'react';
import { Shield, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function RiskLegend({ compact = false }) {
  const levels = [
    {
      name: 'Low',
      score: '0 – 39',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      border: 'border-emerald-500/30',
      desc: 'Normal geological stability. Routine sensor checks.',
      icon: Shield
    },
    {
      name: 'Moderate',
      score: '40 – 64',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      border: 'border-amber-500/30',
      desc: 'Precipitation elevated. Increased monitoring advisories.',
      icon: Info
    },
    {
      name: 'High',
      score: '65 – 79',
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      border: 'border-orange-500/30',
      desc: 'Pore water pressure critical. Evacuation standby in effect.',
      icon: AlertTriangle
    },
    {
      name: 'Critical',
      score: '80 – 100',
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      border: 'border-rose-500/40',
      desc: 'Imminent slope failure detected. Immediate evacuation order.',
      icon: AlertCircle
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 py-2 px-3 bg-command-900/60 border border-slate-800 rounded-lg text-xs">
        <span className="text-slate-400 font-medium">Risk Legend:</span>
        {levels.map((lvl) => (
          <div key={lvl.name} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${lvl.color}`} />
            <span className={`font-semibold ${lvl.textColor}`}>{lvl.name}</span>
            <span className="text-slate-500 text-[11px]">({lvl.score})</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-command-900/80 border border-slate-800/80 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Geological Threat Scale & Action Matrix
        </h4>
        <span className="text-[11px] text-slate-500 font-mono">ISO-DISASTER 22320</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {levels.map((lvl) => {
          const Icon = lvl.icon;
          return (
            <div
              key={lvl.name}
              className={`p-3 rounded-lg border bg-command-950/60 ${lvl.border} flex flex-col justify-between transition-all hover:border-slate-600`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${lvl.color}`} />
                  <span className={`text-sm font-bold ${lvl.textColor}`}>{lvl.name}</span>
                </span>
                <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {lvl.score}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                {lvl.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
