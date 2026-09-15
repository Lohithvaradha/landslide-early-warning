import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Truck,
  Users,
  Home,
  PhoneCall,
  AlertTriangle,
  Radio,
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';

export function AuthorityDashboardPage() {
  const {
    locations,
    reports,
    updateReportStatus,
    authorityResources,
    setSelectedLocationId,
    setActiveTab
  } = useDisaster();

  const [dispatchNotice, setDispatchNotice] = useState('');
  const [selectedReportToView, setSelectedReportToView] = useState(null);

  // Pending citizen reports needing immediate authority review
  const pendingReports = reports.filter(r => r.status === 'Pending Review');
  const criticalSectors = locations.filter(l => l.risk_level === 'Critical' || l.risk_level === 'High');

  const handleVerify = (reportId) => {
    updateReportStatus(reportId, 'Verified');
    setDispatchNotice(`Report ${reportId} confirmed & marked VERIFIED. Spatial hazard pin updated on tactical map.`);
    setTimeout(() => setDispatchNotice(''), 4000);
  };

  const handleDismiss = (reportId) => {
    updateReportStatus(reportId, 'Dismissed');
    setDispatchNotice(`Report ${reportId} marked Dismissed after officer review.`);
    setTimeout(() => setDispatchNotice(''), 4000);
  };

  const handleDispatchTeam = (sectorName) => {
    setDispatchNotice(`Disaster Response Team (NDRF Unit 3) dispatched to ${sectorName}!`);
    setTimeout(() => setDispatchNotice(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-rose-500" size={24} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              District Emergency Operations Center (DEOC) Command
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Authorized portal for Incident Commanders, NDRF liaison officers, and municipal engineers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300">
            LEVEL-4 INCIDENT TRIAGE
          </span>
        </div>
      </div>

      {dispatchNotice && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950 to-command-900 border border-cyan-700 text-cyan-200 text-xs sm:text-sm flex items-center gap-3 shadow-lg">
          <Radio size={18} className="text-cyan-400 shrink-0 animate-pulse" />
          <span className="font-semibold">{dispatchNotice}</span>
        </div>
      )}

      {/* Resource & Affected Area Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Evacuation Orders"
          value={authorityResources.active_evacuations}
          badgeText="Sectors 4 & 15"
          subtitle="Mandatory relocation zones"
          icon={AlertTriangle}
          trend="Immediate effect"
          trendType="up"
          accent="rose"
        />
        <StatCard
          title="Rapid Response Teams"
          value={authorityResources.deployed_teams}
          badgeText="Active On-Field"
          subtitle="Equipped with heavy winches"
          icon={Truck}
          trend="+2 standby units"
          trendType="neutral"
          accent="cyan"
        />
        <StatCard
          title="Emergency Shelters Active"
          value={authorityResources.emergency_shelters}
          badgeText={authorityResources.shelter_capacity_used}
          subtitle="Occupancy rate"
          icon={Home}
          trend="Cap. available"
          trendType="down"
          accent="emerald"
        />
        <StatCard
          title="Transit Closures"
          value={authorityResources.closed_transit_routes}
          badgeText="Traffic Blocked"
          subtitle="High-risk valley mountain roads"
          icon={Users}
          trend="Highway NH-58 link"
          trendType="neutral"
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Citizen Reports Triage Queue */}
        <div className="lg:col-span-6 bg-command-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Pending Citizen Verification Queue ({pendingReports.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                Action Required
              </span>
            </div>

            {pendingReports.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs bg-command-950/60 rounded-xl border border-slate-800">
                No unreviewed reports in the queue. All submissions have been processed.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-xl bg-command-950 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-cyan-400">{report.id}</span>
                          <RiskBadge level={report.severity} size="sm" />
                          <span className="text-[10px] text-slate-500">{report.timestamp}</span>
                        </div>
                        <h4 className="font-bold text-xs text-white line-clamp-1">{report.title}</h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {report.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                      <span className="text-slate-400 truncate max-w-[160px]">
                        📍 {report.location}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setSelectedReportToView(report)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleVerify(report.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow"
                        >
                          <CheckCircle2 size={12} /> Verify
                        </button>
                        <button
                          onClick={() => handleDismiss(report.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-rose-200 text-[11px]"
                        >
                          <XCircle size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Verified reports instantly promote sector risk weighting by +15% and alert field officers.
          </div>
        </div>

        {/* Emergency Priority Dispatch Table */}
        <div className="lg:col-span-6 bg-command-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-rose-400" size={18} />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Emergency Sector Priority Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                Triage Rank
              </span>
            </div>

            <div className="space-y-3">
              {criticalSectors.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-3.5 rounded-xl bg-command-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-800 text-rose-400 font-mono font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-xs text-white">{sec.name}</span>
                      <RiskBadge level={sec.risk_level} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap gap-2 font-mono">
                      <span>Score: <b className="text-rose-400">{sec.risk_score}</b></span>
                      <span>• Sat: <b className="text-amber-300">{sec.soil_moisture}%</b></span>
                      <span>• At Risk: <b className="text-slate-200">{sec.population_at_risk}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedLocationId(sec.id);
                        setActiveTab('analysis');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      Telemetry
                    </button>
                    <button
                      onClick={() => handleDispatchTeam(sec.name)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-950/40"
                    >
                      <Truck size={12} /> Dispatch QRT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Emergency Hotlines Footer */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Command Center Direct Interconnects:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {authorityResources.emergency_contacts.slice(0, 2).map((c, i) => (
                <div key={i} className="p-2 rounded-lg bg-command-950 border border-slate-800 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <div className="font-semibold text-slate-300 text-[11px] truncate">{c.agency}</div>
                    <div className="font-mono text-[10px] text-cyan-400">{c.phone}</div>
                  </div>
                  <PhoneCall size={14} className="text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Report Details */}
      <Modal
        isOpen={!!selectedReportToView}
        onClose={() => setSelectedReportToView(null)}
        title={`Authority Review: ${selectedReportToView?.id}`}
      >
        {selectedReportToView && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <RiskBadge level={selectedReportToView.severity} size="md" />
              <span className="font-mono text-slate-400">{selectedReportToView.timestamp}</span>
            </div>

            {selectedReportToView.image_preview && (
              <div className="rounded-xl overflow-hidden border border-slate-700 max-h-56">
                <img
                  src={selectedReportToView.image_preview}
                  alt="Incident photograph"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-3 bg-command-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-white font-bold">{selectedReportToView.title}</div>
              <div className="text-slate-400">📍 {selectedReportToView.location}</div>
              <div className="text-slate-300 mt-2">{selectedReportToView.description}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleVerify(selectedReportToView.id);
                  setSelectedReportToView(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Confirm & Verify Incident
              </button>
              <button
                onClick={() => {
                  handleDismiss(selectedReportToView.id);
                  setSelectedReportToView(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
