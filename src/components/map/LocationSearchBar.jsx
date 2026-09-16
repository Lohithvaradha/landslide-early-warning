import React, { useState, useRef } from 'react';
import { Search, MapPin, X, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { DEMO_SEARCH_FALLBACKS } from '../../data/mockData';

export function LocationSearchBar({ onLocationSelect, onClear, activeSearchedLocation }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const cacheRef = useRef({});

  // Fast demo suggestion chips
  const demoPresets = ['Gangtok', 'Kohima', 'Joshimath', 'Tawang', 'Shillong'];

  const executeSearch = async (searchQuery) => {
    const trimmed = (searchQuery || query).trim();
    if (!trimmed) return;

    setErrorMessage('');
    const normalized = trimmed.toLowerCase();

    // 1. Check in-memory query cache to avoid repeated requests
    if (cacheRef.current[normalized]) {
      onLocationSelect(cacheRef.current[normalized]);
      return;
    }

    // 2. Check local fallback demo list first (instant match, zero network latency)
    const localMatch = DEMO_SEARCH_FALLBACKS.find((loc) => {
      if (loc.name.toLowerCase().includes(normalized)) return true;
      if (loc.region.toLowerCase().includes(normalized)) return true;
      if (loc.keywords && loc.keywords.some((k) => k.includes(normalized) || normalized.includes(k))) return true;
      return false;
    });

    if (localMatch) {
      cacheRef.current[normalized] = localMatch;
      onLocationSelect(localMatch);
      return;
    }

    // 3. Fallback to OpenStreetMap Nominatim Geocoding API (Single submit-only query)
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding server responded with ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);

        // Construct unified location object matching existing HUD data contracts
        const constructedLocation = {
          id: `SRCH-${Date.now().toString().slice(-4)}`,
          name: place.display_name.split(',')[0],
          region: place.display_name,
          type: place.type ? place.type.toUpperCase() : 'SEARCHED REGION',
          coordinates: [lat, lon],
          elevation: Math.round(1100 + Math.random() * 900),
          slope: Math.round(25 + Math.random() * 25),
          rainfall_24h: Math.round(45 + Math.random() * 80),
          soil_moisture: Math.round(50 + Math.random() * 35),
          geology: 'Regional Mountain Stratum',
          risk_score: Math.round(50 + Math.random() * 30),
          risk_level: 'Moderate',
          population_at_risk: Math.round(5000 + Math.random() * 25000),
          last_updated: 'Just now (Geocoded)',
          isExternalSearch: true,
        };

        // Classify risk tier based on score
        if (constructedLocation.risk_score >= 80) constructedLocation.risk_level = 'Critical';
        else if (constructedLocation.risk_score >= 65) constructedLocation.risk_level = 'High';
        else if (constructedLocation.risk_score >= 40) constructedLocation.risk_level = 'Moderate';
        else constructedLocation.risk_level = 'Low';

        cacheRef.current[normalized] = constructedLocation;
        onLocationSelect(constructedLocation);
      } else {
        setErrorMessage(
          `Location "${trimmed}" not found. Try searching a major hill station, district, or landmark (e.g., Gangtok, Kohima, Joshimath).`
        );
      }
    } catch (err) {
      setErrorMessage(
        'Geocoding network rate-limit or offline. You can select one of the instant demo presets below.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const handleSelectPreset = (presetName) => {
    setQuery(presetName);
    executeSearch(presetName);
  };

  const handleClear = () => {
    setQuery('');
    setErrorMessage('');
    if (onClear) onClear();
  };

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search village, city, district, or mountain landmark..."
            className="w-full bg-command-900 border border-slate-700 text-white rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-cyan-500 placeholder:text-slate-500 shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40 shrink-0"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
          <span>{isLoading ? 'Locating...' : 'Search'}</span>
        </button>

        {activeSearchedLocation && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition-colors shrink-0"
            title="Clear search and reset camera"
          >
            Clear Pin
          </button>
        )}
      </form>

      {/* Error notification banner */}
      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-2 shadow animate-fade-in">
          <AlertCircle size={14} className="text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Fast Demo Presets */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles size={11} className="text-cyan-400" /> Demo Targets:
        </span>
        {demoPresets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700/80 transition-colors font-mono text-[10px]"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
