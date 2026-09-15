import React from 'react';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  FileSpreadsheet,
  AlertOctagon,
  ShieldAlert,
  Radio,
  ChevronRight
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

export function Sidebar({ collapsed, setCollapsed }) {
  const { activeTab, setActiveTab, alerts, reports } = useDisaster();

  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
  const pendingReportsCount = reports.filter(r => r.status === 'Pending Review').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'System overview & telemetry'
    },
    {
      id: 'analysis',
      label: 'Risk Analysis',
      icon: Activity,
      description: 'Environmental simulation'
    },
    {
      id: 'map',
      label: 'Map View',
      icon: MapPin,
      description: 'GIS risk zones & sensors'
    },
    {
      id: 'reports',
      label: 'Citizen Reports',
      icon: FileSpreadsheet,
      badge: pendingReportsCount > 0 ? pendingReportsCount : null,
      badgeColor: 'bg-amber-500 text-black',
      description: 'Crowdsourced incidents'
    },
    {
      id: 'alerts',
      label: 'Alerts & Advisories',
      icon: AlertOctagon,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      description: 'Public early warnings'
    },
    {
      id: 'authority',
      label: 'Authority Command',
      icon: ShieldAlert,
      tag: 'CONTROL',
      description: 'Triage & resource dispatch'
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-command-900 border-r border-slate-800 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-cyan-500 p-0.5 shrink-0 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <div className="w-full h-full bg-command-950 rounded-[10px] flex items-center justify-center">
              <Radio className="text-rose-400 animate-pulse" size={20} />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5">
                GEOSHIELD <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest truncate font-medium">
                Early Warning Matrix
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Operational Views
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600/20 via-command-800 to-command-800 text-white border-l-4 border-rose-500 shadow-md shadow-rose-950/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-command-800/60'
              }`}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <div className="flex-1 text-left flex items-center justify-between min-w-0">
                  <div className="truncate">
                    <div className="font-semibold text-xs tracking-wide">{item.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.description}</div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.tag && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isActive && !collapsed && (
                <ChevronRight size={14} className="text-rose-400 ml-1 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-command-950/60">
        {!collapsed ? (
          <div className="bg-command-900 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                TELEMETRY MESH
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">LIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              27 IoT rain/piezometer sensors transmitting nominal data.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
