import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export function RiskBadge({ level = 'Low', size = 'md', showIcon = true, pulse = false }) {
  const normalized = (level || 'Low').toLowerCase();

  const config = {
    low: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      icon: ShieldCheck,
      label: 'Low Risk'
    },
    moderate: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      icon: Info,
      label: 'Moderate'
    },
    high: {
      bg: 'bg-orange-500/15',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      glow: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]',
      icon: AlertTriangle,
      label: 'High Risk'
    },
    critical: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_16px_rgba(239,68,68,0.4)]',
      icon: AlertCircle,
      label: 'Critical'
    }
  };

  const style = config[normalized] || config.low;
  const IconComponent = style.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style.bg} ${style.text} ${style.border} ${style.glow} ${sizeClasses[size] || sizeClasses.md} transition-all duration-200`}
    >
      {showIcon && (
        <span className={pulse && normalized === 'critical' ? 'animate-pulse' : ''}>
          <IconComponent size={iconSizes[size] || 14} />
        </span>
      )}
      <span>{style.label}</span>
    </span>
  );
}
