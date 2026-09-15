import React, { useState } from 'react';

export function TrendChart({ data = [], height = 180, title = '7-Day Landslide Risk Trend' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-44 text-slate-500 text-sm">
        No trend data available
      </div>
    );
  }

  // SVG coordinate calculations
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Max score is 100, min is 0
  const points = data.map((item, index) => {
    const x = paddingX + (index / (data.length - 1)) * graphWidth;
    const y = height - paddingY - (item.score / 100) * graphHeight;
    return { ...item, x, y };
  });

  // SVG path generation
  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Fill area under path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Color dynamic determination based on latest score
  const latestScore = data[data.length - 1]?.score || 0;
  const strokeColor =
    latestScore >= 80 ? '#ef4444' : latestScore >= 65 ? '#f97316' : latestScore >= 40 ? '#f59e0b' : '#10b981';

  return (
    <div className="w-full bg-command-950/60 border border-slate-800/90 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {title}
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Latest: <span className="font-bold text-white">{latestScore}/100</span>
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Guideline: 80 Critical */}
          <line
            x1={paddingX}
            y1={height - paddingY - (80 / 100) * graphHeight}
            x2={width - paddingX}
            y2={height - paddingY - (80 / 100) * graphHeight}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <text
            x={paddingX + 4}
            y={height - paddingY - (80 / 100) * graphHeight - 4}
            fill="#ef4444"
            fontSize="9"
            fontFamily="monospace"
            opacity="0.8"
          >
            Critical (80+)
          </text>

          {/* Reference Guideline: 40 Moderate */}
          <line
            x1={paddingX}
            y1={height - paddingY - (40 / 100) * graphHeight}
            x2={width - paddingX}
            y2={height - paddingY - (40 / 100) * graphHeight}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth="0.8"
            opacity="0.35"
          />
          <text
            x={paddingX + 4}
            y={height - paddingY - (40 / 100) * graphHeight - 4}
            fill="#f59e0b"
            fontSize="9"
            fontFamily="monospace"
            opacity="0.7"
          >
            Moderate (40)
          </text>

          {/* Area Fill */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.day === pt.day ? 5.5 : 3.5}
                fill="#0f172a"
                stroke={strokeColor}
                strokeWidth="2"
                className="transition-all duration-200"
              />
              {/* Day label */}
              <text
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
                fontFamily="sans-serif"
              >
                {pt.day.replace('Day ', 'D')}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute top-2 right-2 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded text-xs shadow-lg pointer-events-none backdrop-blur-sm"
          >
            <span className="text-slate-400">{hoveredPoint.day}: </span>
            <span className="font-mono font-bold text-white">{hoveredPoint.score}</span>
            <span className="text-slate-400">/100</span>
          </div>
        )}
      </div>
    </div>
  );
}
