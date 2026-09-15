import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Droplets,
  Users,
  Radio,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Wind,
  Layers
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskLegend } from '../components/common/RiskLegend';
import { RiskMap } from '../components/map/RiskMap';

export function DashboardPage() {
  const { locations, alerts, setSelectedLocationId, setActiveTab } = useDisaster();

  // Metrics
  const criticalCount = locations.filter(l => l.risk_level === 'Critical').length;
  const highCount = locations.filter(l => l.risk_level === 'High').length;
  const totalPopAtRisk = locations.reduce((sum, l) => sum + (l.risk_level === 'Critical' || l.risk_level === 'High' ? l.population_at_risk : 0), 0);
  const avgSoilMoisture = Math.round(locations.reduce((sum, l) => sum + l.soil_moisture, 0) / locations.length);

  // Sorted high-risk locations for table
  const sortedLocations = [...locations].sort((a, b) => b.risk_score - a.risk_score);

  const handleInspect = (locId) => {
    setSelectedLocationId(locId);
    setActiveTab('analysis');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Emergency Advisory Headline */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/80 via-command-900 to-command-900 border border-rose-800/40 p-5 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Severe Weather Alert Protocol
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Landslide Threat & Early Warning Surveillance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Continuous multi-sensor telemetry analyzing precipitation intensity, slope stability, and soil saturation thresholds across 6 operational sectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('map')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all shadow-md"
            >
              <Layers size={15} className="text-cyan-400" />
              Full Tactical Map
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-950/50"
            >
              <Radio size={15} />
              Simulate Risk Factors
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical Hazard Zones"
          value={criticalCount}
          badgeText="Immediate Action"
          subtitle="Sectors exceeding 80 risk score"
          icon={AlertTriangle}
          trend="+1 sector vs yesterday"
          trendType="up"
          accent="rose"
        />
        <StatCard
          title="Active Red Warnings"
          value={alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length}
          badgeText="Active Broadcast"
          subtitle="Issued to civil authorities"
          icon={ShieldAlert}
          trend="2 dispatched advisories"
          trendType="neutral"
          accent="amber"
        />
        <StatCard
          title="Avg Soil Saturation"
          value={`${avgSoilMoisture}%`}
          badgeText="Pore Index"
          subtitle="Regional moisture threshold"
          icon={Droplets}
          trend="+14% over 24h rainfall"
          trendType="up"
          accent="cyan"
        />
        <StatCard
          title="Vulnerable Population"
          value={totalPopAtRisk.toLocaleString()}
          badgeText="High/Crit Sectors"
          subtitle="Targeted for evacuation buffer"
          icon={Users}
          trend="Nominal evacuation ready"
          trendType="down"
          accent="emerald"
        />
      </div>

      {/* Middle Row: Tactical Mini-Map & Live Alerts Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive-looking Risk Map Placeholder / Preview */}
        <div className="lg:col-span-7 bg-command-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Geospatial Threat Matrix
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 group"
            >
              Expand Full Map <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Click any sector pin to preview local geological readings or inspect in the simulation engine.
          </p>

          <div className="w-full rounded-xl overflow-hidden border border-slate-800/80">
            <RiskMap mini={true} height="290px" />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
            <span>Tile Source: CartoDB Dark Matter / OSM</span>
            <span className="text-emerald-400">● 6 Active Telemetry Polygons</span>
          </div>
        </div>

        {/* Recent Urgent Alerts */}
        <div className="lg:col-span-5 bg-command-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Live Emergency Alerts
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                All Advisories <ExternalLink size={12} />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-command-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <RiskBadge level={alert.severity} size="sm" pulse={alert.severity === 'Critical'} />
                    <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/60 font-mono">
                    <span>{alert.location}</span>
                    <span className="text-rose-400 font-semibold">{alert.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('alerts')}
            className="w-full mt-3 py-2 px-3 bg-command-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <span>View All Operational Alerts ({alerts.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* High-Risk Locations Table */}
      <div className="bg-command-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              High-Risk Monitored Sectors
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by composite geological vulnerability index & real-time pore pressure
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
            {locations.length} Active Observation Points
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Sector ID</th>
                <th className="py-2.5 px-3">Location & Region</th>
                <th className="py-2.5 px-3">Threat Tier</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">24h Rainfall</th>
                <th className="py-2.5 px-3">Slope</th>
                <th className="py-2.5 px-3">Soil Moisture</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {sortedLocations.map((loc) => (
                <tr
                  key={loc.id}
                  className="hover:bg-command-800/40 transition-colors group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {loc.id}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-semibold text-white">{loc.name}</div>
                    <div className="text-[10px] text-slate-400">{loc.region}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <RiskBadge level={loc.risk_level} size="sm" />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono font-bold">
                    <span
                      className={
                        loc.risk_score >= 80
                          ? 'text-rose-400 font-extrabold'
                          : loc.risk_score >= 65
                          ? 'text-orange-400'
                          : loc.risk_score >= 40
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {loc.risk_score}
                    </span>
                    <span className="text-slate-600 text-[10px]">/100</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-300">
                    {loc.rainfall_24h} mm
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-300">
                    {loc.slope}°
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono">
                    <span className={loc.soil_moisture > 75 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {loc.soil_moisture}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleInspect(loc.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 ml-auto border border-slate-700 hover:border-rose-500"
                    >
                      <span>Analyze</span>
                      <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Legend Section */}
      <RiskLegend />
    </div>
  );
}
