import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Compass,
  AlertTriangle,
  Radio,
  Sliders,
  Maximize2,
  ExternalLink,
  Info
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { RiskMap } from '../components/map/RiskMap';
import { MapFilterControls } from '../components/map/MapFilterControls';
import { RiskBadge } from '../components/common/RiskBadge';

export function MapViewPage() {
  const { locations, reports, selectedLocationId, setSelectedLocationId, setActiveTab } = useDisaster();

  const [filter, setFilter] = useState('All');
  const [activeLayers, setActiveLayers] = useState({ sensors: true, reports: true });

  const toggleLayer = (layerName) => {
    setActiveLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Severity counts for filter buttons
  const counts = {
    all: locations.length,
    critical: locations.filter(l => l.risk_level === 'Critical').length,
    high: locations.filter(l => l.risk_level === 'High').length,
    moderate: locations.filter(l => l.risk_level === 'Moderate').length,
    low: locations.filter(l => l.risk_level === 'Low').length,
  };

  const selectedLoc = locations.find(l => l.id === selectedLocationId) || locations[0];

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-8.5rem)] min-h-[600px]">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="text-rose-400" size={24} />
            Tactical GIS Geospatial Matrix
          </h1>
          <p className="text-xs text-slate-400">
            OpenStreetMap & InSAR hazard zone overlays with live sensor clusters and crowdsourced ground incidents.
          </p>
        </div>

        {/* Quick Legend Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Critical
          </span>
          <span className="flex items-center gap-1 text-orange-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> High
          </span>
          <span className="flex items-center gap-1 text-amber-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate
          </span>
        </div>
      </div>

      {/* Filter and Layer Bar */}
      <div className="shrink-0">
        <MapFilterControls
          currentFilter={filter}
          onFilterChange={setFilter}
          activeLayers={activeLayers}
          onToggleLayer={toggleLayer}
          counts={counts}
        />
      </div>

      {/* Main Interactive Map Canvas (Expanded height) */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-command-950 flex flex-col lg:flex-row">
        {/* Map Container */}
        <div className="flex-1 h-full min-h-[380px]">
          <RiskMap
            filter={filter}
            activeLayers={activeLayers}
            mini={false}
            height="100%"
            onSelectSector={(id) => setSelectedLocationId(id)}
          />
        </div>

        {/* Right HUD Sidebar for Selected Sector Details */}
        <div className="w-full lg:w-80 bg-command-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shrink-0">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-[11px] font-mono font-bold text-cyan-400">SECTOR HUD</span>
              <RiskBadge level={selectedLoc.risk_level} size="sm" />
            </div>

            <h3 className="font-extrabold text-base text-white">{selectedLoc.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedLoc.region}</p>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center justify-between p-2 rounded-lg bg-command-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Coordinates:</span>
                <span className="font-mono font-bold text-slate-200">
                  {selectedLoc.coordinates[0].toFixed(4)}°N, {selectedLoc.coordinates[1].toFixed(4)}°E
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-command-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Risk Score:</span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  {selectedLoc.risk_score} / 100
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-command-950 border border-slate-800 text-xs">
                <span className="text-slate-400">24h Rainfall:</span>
                <span className="font-mono font-bold text-cyan-300">
                  {selectedLoc.rainfall_24h} mm
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-command-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Slope Gradient:</span>
                <span className="font-mono font-bold text-amber-300">{selectedLoc.slope}°</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-command-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Soil Saturation:</span>
                <span className="font-mono font-bold text-rose-300">{selectedLoc.soil_moisture}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-command-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Population at Risk:</span>
                <span className="font-mono font-bold text-white">
                  {selectedLoc.population_at_risk.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Geological Lithology:</span>
              <span className="font-mono text-[11px] text-slate-400">{selectedLoc.geology}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
            <button
              onClick={() => setActiveTab('analysis')}
              className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-950/40"
            >
              <Radio size={14} />
              <span>Simulate Risk for {selectedLoc.id}</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <span>Submit Citizen Observation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
