import React from 'react';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  FileSpreadsheet,
  AlertOctagon,
  ShieldAlert,
  X
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

export function MobileNav({ isOpen, onClose }) {
  const { activeTab, setActiveTab, alerts, reports } = useDisaster();

  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
  const pendingReportsCount = reports.filter(r => r.status === 'Pending Review').length;

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'analysis', label: 'Analysis', icon: Activity },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet, badge: pendingReportsCount },
    { id: 'alerts', label: 'Alerts', icon: AlertOctagon, badge: activeAlertsCount },
    { id: 'authority', label: 'Command', icon: ShieldAlert },
  ];

  return (
    <>
      {/* Mobile Bottom Fixed Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-command-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg relative transition-colors ${
                isActive ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {tab.badge > 0 && (
                <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Full Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-command-900 border-r border-slate-800 p-5 flex flex-col z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-wide">
                  GEOSHIELD PORTAL
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-1.5 flex-1 overflow-y-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-rose-500/20 text-white border-l-4 border-rose-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-command-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={isActive ? 'text-rose-400' : 'text-slate-400'} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
