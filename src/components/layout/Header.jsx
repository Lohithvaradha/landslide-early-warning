import React, { useState, useEffect } from 'react';
import {
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

export function Header({ collapsed, setCollapsed, onMobileMenuToggle }) {
  const { notifications, setNotifications, alerts } = useDisaster();
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState(new Date());

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalAlert = alerts.find(a => a.severity === 'Critical');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="h-16 bg-command-900/95 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      {/* Left side: Hamburger & collapse button & active alert ticker */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Emergency Ticker */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 max-w-lg min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider shrink-0">
            INCIDENT TICKER:
          </span>
          <span className="text-xs text-rose-200 truncate">
            {criticalAlert ? `${criticalAlert.location} - ${criticalAlert.title}` : 'Nominal surveillance active across monitored regions.'}
          </span>
        </div>
      </div>

      {/* Right side: Clock, Notifications, and Operator Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Live digital clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-command-950 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock size={14} className="text-cyan-400" />
          <span>{formattedTime} IST</span>
          <span className="text-[10px] text-slate-500">UTC+5:30</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-command-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 bg-command-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white uppercase tracking-wider">
                    Operational Dispatch Stream
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-bold">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 size={12} /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs transition-colors hover:bg-command-800/50 ${
                      n.read ? 'text-slate-400' : 'text-slate-100 bg-command-950/40 font-medium'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 leading-relaxed">{n.text}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Operator Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner font-mono font-bold text-xs">
            OP-1
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-none">DEOC Officer</span>
            <span className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              Level 4 Access
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
