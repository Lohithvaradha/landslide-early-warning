import React from 'react';
import { Filter, Layers, Eye } from 'lucide-react';

export function MapFilterControls({
  currentFilter,
  onFilterChange,
  activeLayers,
  onToggleLayer,
  counts = {}
}) {
  const filterOptions = [
    { id: 'All', label: 'All Sectors', count: counts.all || 0 },
    { id: 'Critical', label: 'Critical', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10', count: counts.critical || 0 },
    { id: 'High', label: 'High Risk', color: 'text-orange-400 border-orange-500/40 bg-orange-500/10', count: counts.high || 0 },
    { id: 'Moderate', label: 'Moderate', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10', count: counts.moderate || 0 },
    { id: 'Low', label: 'Low Risk', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', count: counts.low || 0 },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-command-900/90 border border-slate-800 rounded-xl p-3 shadow-lg backdrop-blur-md">
      {/* Severity filter buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
          <Filter size={14} /> Severity:
        </span>
        {filterOptions.map((opt) => {
          const isActive = currentFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onFilterChange(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-white shadow-md font-bold'
                  : opt.color || 'bg-command-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{opt.label}</span>
              {opt.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-slate-800 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Layer Toggles */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <Layers size={14} /> Overlays:
        </span>
        <button
          onClick={() => onToggleLayer('sensors')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1 ${
            activeLayers.sensors
              ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800'
              : 'bg-command-950 text-slate-500 border-slate-800'
          }`}
        >
          <Eye size={12} /> Sensors
        </button>
        <button
          onClick={() => onToggleLayer('reports')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1 ${
            activeLayers.reports
              ? 'bg-amber-950/80 text-amber-400 border-amber-800'
              : 'bg-command-950 text-slate-500 border-slate-800'
          }`}
        >
          <Eye size={12} /> Citizen Pins
        </button>
      </div>
    </div>
  );
}
