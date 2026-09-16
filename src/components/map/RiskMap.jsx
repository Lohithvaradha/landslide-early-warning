import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDisaster } from '../../context/DisasterContext';
import { RiskBadge } from '../common/RiskBadge';
import { Activity, Wind, Droplets, Mountain, ArrowRight } from 'lucide-react';

// Custom DivIcon generator for risk zones
function createRiskMarkerIcon(level, id) {
  const colors = {
    critical: { bg: '#ef4444', ring: 'rgba(239, 68, 68, 0.4)', pulse: true },
    high: { bg: '#f97316', ring: 'rgba(249, 115, 22, 0.35)', pulse: false },
    moderate: { bg: '#f59e0b', ring: 'rgba(245, 158, 11, 0.3)', pulse: false },
    low: { bg: '#10b981', ring: 'rgba(16, 185, 129, 0.25)', pulse: false },
  };

  const c = colors[level.toLowerCase()] || colors.low;

  return L.divIcon({
    className: 'custom-risk-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 9999px; background: ${c.ring}; ${c.pulse ? 'animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}"></div>
        <div style="position: relative; width: 26px; height: 26px; border-radius: 9999px; background: #0c1322; border: 2.5px solid ${c.bg}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
          <span style="font-size: 10px; font-weight: 800; color: ${c.bg}; font-family: monospace;">${id.replace('SEC-', '')}</span>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

// Custom DivIcon for citizen incident reports
function createReportMarkerIcon(severity) {
  const isCrit = severity === 'Critical';
  const color = isCrit ? '#f43f5e' : '#eab308';

  return L.divIcon({
    className: 'custom-report-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="position: relative; width: 22px; height: 22px; border-radius: 6px; background: #1e1b4b; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
          <div style="transform: rotate(-45deg); font-size: 11px; font-weight: bold; color: ${color};">!</div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

// Custom DivIcon for searched locations
function createSearchMarkerIcon() {
  return L.divIcon({
    className: 'custom-search-marker',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(6, 182, 212, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background: #0c1322; border: 2.5px solid #06b6d4; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.6);">
          <div style="width: 10px; height: 10px; border-radius: 9999px; background: #06b6d4;"></div>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

// Camera controller component supporting smooth flyTo on search
function MapCameraController({ center, zoom, targetLocation }) {
  const map = useMap();
  useEffect(() => {
    if (targetLocation && targetLocation.coordinates) {
      map.flyTo(targetLocation.coordinates, 13, { duration: 1.5 });
    } else if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, targetLocation, map]);
  return null;
}

export function RiskMap({
  filter = 'All',
  activeLayers = { sensors: true, reports: true },
  mini = false,
  onSelectSector,
  searchedLocation = null,
  height = '100%',
}) {
  const { locations, reports, setSelectedLocationId, setActiveTab } = useDisaster();

  // Filter locations based on severity filter
  const filteredLocations = locations.filter((loc) => {
    if (filter === 'All') return true;
    return loc.risk_level.toLowerCase() === filter.toLowerCase();
  });

  const centerCoords = [30.325, 78.050];
  const zoomLevel = mini ? 11 : 12;

  const handleInspectSector = (id) => {
    setSelectedLocationId(id);
    if (onSelectSector) {
      onSelectSector(id);
    } else {
      setActiveTab('analysis');
    }
  };

  const getCircleColor = (level) => {
    switch (level.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'moderate': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-command-950"
      style={{ height }}
    >
      <MapContainer
        center={centerCoords}
        zoom={zoomLevel}
        scrollWheelZoom={!mini}
        dragging={!mini}
        touchZoom={!mini}
        doubleClickZoom={!mini}
        className="w-full h-full z-10"
        attributionControl={false}
      >
        <MapCameraController
          center={centerCoords}
          zoom={zoomLevel}
          targetLocation={searchedLocation}
        />

        {/* High performance CartoDB Dark Matter tile layer for dark operational theme */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           attribution='&copy; OpenStreetMap contributors'
          maxZoom={19}
        />

        {/* Risk Zone Circles and Sector Markers */}
        {filteredLocations.map((loc) => {
          const color = getCircleColor(loc.risk_level);
          const icon = createRiskMarkerIcon(loc.risk_level, loc.id);

          return (
            <React.Fragment key={loc.id}>
              {/* Influence radius circle */}
              <Circle
                center={loc.coordinates}
                radius={loc.risk_level === 'Critical' ? 1400 : loc.risk_level === 'High' ? 1000 : 700}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: loc.risk_level === 'Critical' ? 0.22 : 0.12,
                  weight: 1.5,
                  dashArray: loc.risk_level === 'Moderate' ? '4, 4' : undefined,
                }}
              />

              {/* Marker pin */}
              <Marker position={loc.coordinates} icon={icon}>
                <Popup className="disaster-custom-popup">
                  <div className="p-1 min-w-[230px]">
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-700/60">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 block">{loc.id}</span>
                        <h4 className="font-bold text-sm text-white leading-tight">{loc.name}</h4>
                      </div>
                      <RiskBadge level={loc.risk_level} size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-slate-300">
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                          <Wind size={10} className="text-cyan-400" /> Slope
                        </span>
                        <span className="font-mono font-bold">{loc.slope}°</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                          <Droplets size={10} className="text-cyan-400" /> 24h Rain
                        </span>
                        <span className="font-mono font-bold">{loc.rainfall_24h} mm</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                          <Mountain size={10} className="text-cyan-400" /> Elevation
                        </span>
                        <span className="font-mono font-bold">{loc.elevation} m</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Soil Sat.</span>
                        <span className="font-mono font-bold text-amber-400">{loc.soil_moisture}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInspectSector(loc.id)}
                      className="w-full py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <Activity size={13} />
                      <span>Inspect in Risk Engine</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Citizen Reports Layer */}
        {activeLayers.reports && reports.map((rep) => {
          if (!rep.coordinates) return null;
          const reportIcon = createReportMarkerIcon(rep.severity);

          return (
            <Marker key={rep.id} position={rep.coordinates} icon={reportIcon}>
              <Popup>
                <div className="p-1 min-w-[210px]">
                  <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-700">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                      Citizen Incident
                    </span>
                    <span className="text-[10px] text-slate-400">{rep.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white mb-1">{rep.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mb-2">
                    {rep.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Status:</span>
                    <span className="font-bold text-amber-300">{rep.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Searched Location Marker */}
        {searchedLocation && searchedLocation.coordinates && (
          <Marker position={searchedLocation.coordinates} icon={createSearchMarkerIcon()}>
            <Popup className="disaster-custom-popup">
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-700">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    TARGET LOCATION
                  </span>
                  <RiskBadge level={searchedLocation.risk_level || 'Moderate'} size="sm" />
                </div>
                <h4 className="font-bold text-sm text-white mb-0.5">{searchedLocation.name}</h4>
                <p className="text-[11px] text-slate-400 mb-2">{searchedLocation.region}</p>
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-xs space-y-1 mb-2 font-mono">
                  <div className="text-slate-300">
                    <span className="text-slate-500">Coordinates: </span>
                    {searchedLocation.coordinates[0].toFixed(4)}°N, {searchedLocation.coordinates[1].toFixed(4)}°E
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500">Elevation: </span>
                    {searchedLocation.elevation || 1250} m
                  </div>
                  <div className="text-cyan-400 font-bold">
                    <span className="text-slate-500">Est. Risk Score: </span>
                    {searchedLocation.risk_score || 55}/100
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Mini map banner overlay */}
      {mini && (
        <div className="absolute top-2 left-2 z-20 bg-command-900/90 border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-200 backdrop-blur-sm shadow flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Live Tactical GIS Overview</span>
        </div>
      )}
    </div>
  );
}
