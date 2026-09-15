import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sliders,
  RefreshCw,
  Droplets,
  Wind,
  Mountain,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { TrendChart } from '../components/common/TrendChart';

export function RiskAnalysisPage() {
  const { locations, selectedLocationId, setSelectedLocationId, calculateSimulatedRisk } = useDisaster();

  const currentLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  // Simulation form state initialized with currently selected location values
  const [slope, setSlope] = useState(currentLocation.slope);
  const [rainfall, setRainfall] = useState(currentLocation.rainfall_24h);
  const [elevation, setElevation] = useState(currentLocation.elevation);
  const [moisture, setMoisture] = useState(currentLocation.soil_moisture);
  const [geology, setGeology] = useState(currentLocation.geology);

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(() =>
    calculateSimulatedRisk({
      slope: currentLocation.slope,
      rainfall: currentLocation.rainfall_24h,
      elevation: currentLocation.elevation,
      moisture: currentLocation.soil_moisture,
      geology: currentLocation.geology,
    })
  );

  // Whenever user selects another sector from the location dropdown, auto-populate the inputs
  const handleLocationChange = (e) => {
    const locId = e.target.value;
    setSelectedLocationId(locId);
    const loc = locations.find(l => l.id === locId);
    if (loc) {
      setSlope(loc.slope);
      setRainfall(loc.rainfall_24h);
      setElevation(loc.elevation);
      setMoisture(loc.soil_moisture);
      setGeology(loc.geology);

      // Recalculate
      const newResult = calculateSimulatedRisk({
        slope: loc.slope,
        rainfall: loc.rainfall_24h,
        elevation: loc.elevation,
        moisture: loc.soil_moisture,
        geology: loc.geology,
      });
      setResult(newResult);
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const calculated = calculateSimulatedRisk({
        slope: Number(slope),
        rainfall: Number(rainfall),
        elevation: Number(elevation),
        moisture: Number(moisture),
        geology,
      });
      setResult(calculated);
      setIsAnalyzing(false);
    }, 450);
  };

  // Quick preset simulation triggers
  const applyPreset = (type) => {
    if (type === 'heavy_rain') {
      setRainfall(190);
      setMoisture(89);
      setSlope(45);
    } else if (type === 'dry_spell') {
      setRainfall(8);
      setMoisture(22);
      setSlope(25);
    } else if (type === 'critical_saturation') {
      setRainfall(220);
      setMoisture(95);
      setSlope(52);
    }
  };

  // Score colors
  const getScoreColor = (score) => {
    if (score >= 80) return { stroke: '#ef4444', text: 'text-rose-400', glow: 'shadow-rose-900/40' };
    if (score >= 65) return { stroke: '#f97316', text: 'text-orange-400', glow: 'shadow-orange-900/40' };
    if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', glow: 'shadow-amber-900/40' };
    return { stroke: '#10b981', text: 'text-emerald-400', glow: 'shadow-emerald-900/40' };
  };

  const scoreTheme = getScoreColor(result.score);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Activity className="text-rose-400" size={24} />
            Predictive Landslide Risk Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate environmental stress parameters to evaluate slope shear failure probability.
          </p>
        </div>

        {/* Location selector dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sector:</label>
          <select
            value={selectedLocationId}
            onChange={handleLocationChange}
            className="bg-command-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-rose-500 shadow-inner"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.id} - {loc.name} ({loc.risk_level})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Environmental Parameter Controls (Input fields & sliders) */}
        <div className="lg:col-span-6 bg-command-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="text-cyan-400" size={18} />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Environmental Parameters
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                Interactive Telemetry Inputs
              </span>
            </div>

            {/* Quick Presets */}
            <div className="mb-5">
              <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                Quick Simulation Scenarios:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => applyPreset('critical_saturation')}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs hover:bg-rose-900/80 transition-colors"
                >
                  ⚡ Extreme Monsoon (95% Sat.)
                </button>
                <button
                  onClick={() => applyPreset('heavy_rain')}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs hover:bg-amber-900/80 transition-colors"
                >
                  🌧 Heavy Downpour
                </button>
                <button
                  onClick={() => applyPreset('dry_spell')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs hover:bg-emerald-900/80 transition-colors"
                >
                  ☀️ Dry Pre-Monsoon
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Slope Angle */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Wind size={14} className="text-cyan-400" /> Slope Incline (°)
                  </span>
                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {slope}°
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="75"
                  step="1"
                  value={slope}
                  onChange={(e) => setSlope(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>5° (Flat Foothill)</span>
                  <span>35° (Critical Threshold)</span>
                  <span>75° (Cliff Face)</span>
                </div>
              </div>

              {/* 24h Cumulative Rainfall */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Droplets size={14} className="text-cyan-400" /> 24-Hour Rainfall (mm)
                  </span>
                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {rainfall} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="280"
                  step="1"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0 mm (Dry)</span>
                  <span>100 mm (Warning)</span>
                  <span>280 mm (Cloudburst)</span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Droplets size={14} className="text-amber-400" /> Soil Saturation / Moisture (%)
                  </span>
                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {moisture}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>10% (Arid)</span>
                  <span>65% (Damp)</span>
                  <span>100% (Liquid Limit)</span>
                </div>
              </div>

              {/* Elevation */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Mountain size={14} className="text-cyan-400" /> Elevation (meters above MSL)
                  </span>
                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {elevation} m
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3500"
                  step="25"
                  value={elevation}
                  onChange={(e) => setElevation(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>400 m</span>
                  <span>2000 m</span>
                  <span>3500 m</span>
                </div>
              </div>

              {/* Geological Soil Formation Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers size={14} className="text-cyan-400" /> Geological Bedrock Formation
                </label>
                <select
                  value={geology}
                  onChange={(e) => setGeology(e.target.value)}
                  className="w-full bg-command-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="Fractured Limestone & Shales">Fractured Limestone & Shales (High Fragility)</option>
                  <option value="Weathered Sandstone & Silt">Weathered Sandstone & Silt (Moderate Fragility)</option>
                  <option value="Metamorphic Schist">Metamorphic Schist (Foliated, Cleavage Slip)</option>
                  <option value="Compacted Quartzite">Compacted Quartzite (High Hardness)</option>
                  <option value="Alluvial Gravel & Clay">Alluvial Gravel & Clay (Low Incline Stability)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action: Run Analysis Button */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/50 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
              <span>{isAnalyzing ? 'Executing Inference Model...' : 'Calculate Landslide Vulnerability Score'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Results & Gauge & Explanation & Trend */}
        <div className="lg:col-span-6 space-y-6">
          {/* Result Card */}
          <div className="bg-command-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-400" size={18} />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Simulation Outcome
                </h3>
              </div>
              <RiskBadge level={result.category} size="md" pulse={result.category === 'Critical'} />
            </div>

            {/* Score Display (Gauge + Summary) */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-3">
              {/* Circular Gauge Representation */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={scoreTheme.stroke}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className={`text-3xl font-extrabold font-mono ${scoreTheme.text}`}>
                    {result.score}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Risk Index
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-command-950 border border-slate-800 text-xs font-semibold">
                  <span className="text-slate-400">Classification:</span>
                  <span className={`font-bold ${scoreTheme.text}`}>{result.category} Threat</span>
                </div>
                <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                  {result.category === 'Critical'
                    ? 'Pore water pressure exceeds critical shear resistance. High risk of debris flow within 6 to 12 hours.'
                    : result.category === 'High'
                    ? 'Substantial hillside saturation and slope tension. Pre-evacuation recommended for vulnerable hamlets.'
                    : result.category === 'Moderate'
                    ? 'Elevated moisture. Slope stability acceptable but continuous precipitation monitoring needed.'
                    : 'Geological stability nominal. Slope angles and drainage safely within safety envelope.'}
                </p>
              </div>
            </div>

            {/* Factor Breakdown Panel */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Contributing Stress Factors</span>
                <span className="font-mono text-[10px] text-slate-500">Weight Share %</span>
              </h4>

              <div className="space-y-3">
                {result.factors.map((f, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-300">{f.name}</span>
                      <span className="font-mono font-bold text-slate-200">{f.contribution}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${f.contribution}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Trend Chart Component */}
          <TrendChart
            data={result.trend}
            title={`${currentLocation.name} - Simulated Risk Trajectory`}
          />
        </div>
      </div>
    </div>
  );
}
