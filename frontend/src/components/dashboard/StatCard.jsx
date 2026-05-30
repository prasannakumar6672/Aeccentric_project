import React from 'react';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

const DEFAULT_SPARK = [22, 28, 24, 36, 34, 44, 42, 52];

const Sparkline = ({ data = DEFAULT_SPARK, color }) => {
  const width = 120;
  const height = 30;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((item - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="kpi-sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

const StatCard = ({ title, value, change, icon, accent = '#2563eb', description, sparkData = DEFAULT_SPARK, status = 'Live' }) => {
  const isPositive = !change || change.startsWith('+');
  const TrendIcon = change ? (isPositive ? TrendingUp : TrendingDown) : Activity;

  return (
    <div className="kpi-card group">
      <div className="flex items-start justify-between gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ backgroundColor: `${accent}14`, color: accent, borderColor: `${accent}22` }}
        >
          {icon ? React.cloneElement(icon, { size: 21 }) : null}
        </div>

        {change && (
          <span className={`dash-chip text-[11px] font-bold ${isPositive ? 'chip-success' : 'chip-danger'}`}>
            <TrendIcon size={11} />
            {change}
          </span>
        )}
      </div>

      <div>
        <p className="kpi-label">{title}</p>
        <h3 className="kpi-number mt-2">{value}</h3>
        {description && <p className="kpi-secondary mt-2">{description}</p>}
      </div>

      <div className="flex items-end justify-between gap-3">
        <Sparkline data={sparkData} color={accent} />
        <span className="chip chip-info shrink-0">{status}</span>
      </div>
    </div>
  );
};

export default StatCard;
