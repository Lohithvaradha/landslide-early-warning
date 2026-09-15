import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'up' | 'down' | 'neutral'
  badgeText,
  accent = 'cyan', // 'cyan' | 'rose' | 'amber' | 'emerald'
}) {
  const accentStyles = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
    rose: {
      border: 'border-rose-500/30 hover:border-rose-500/60',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
  };

  const currentAccent = accentStyles[accent] || accentStyles.cyan;

  return (
    <div
      className={`group relative overflow-hidden bg-command-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 transition-all duration-300 ${currentAccent.border} ${currentAccent.glow}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {value}
            </span>
            {badgeText && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border ${currentAccent.iconBg} transition-transform group-hover:scale-105 shrink-0`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-800/80">
        <span className="text-slate-400 truncate">{subtitle}</span>

        {trend && (
          <div
            className={`flex items-center gap-1 font-semibold shrink-0 ${
              trendType === 'up'
                ? 'text-rose-400'
                : trendType === 'down'
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            {trendType === 'up' && <ArrowUpRight size={14} />}
            {trendType === 'down' && <ArrowDownRight size={14} />}
            {trendType === 'neutral' && <Minus size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
