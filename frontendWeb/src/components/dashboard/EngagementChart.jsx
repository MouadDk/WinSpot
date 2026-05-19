import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

/**
 * EngagementChart — Recharts-powered data visualization for the Restaurant Dashboard.
 * Displays scan volumes or offer engagement over time.
 *
 * Props:
 *   data      — Array of { label, scans, revenue } data points
 *   title     — Chart section title
 *   accentColor — Hex color for the chart (defaults to brand cyan)
 */

// Fallback demo data when no real data is available
const DEMO_DATA = [
  { label: 'Mon', scans: 4, revenue: 120 },
  { label: 'Tue', scans: 7, revenue: 210 },
  { label: 'Wed', scans: 5, revenue: 150 },
  { label: 'Thu', scans: 12, revenue: 360 },
  { label: 'Fri', scans: 18, revenue: 540 },
  { label: 'Sat', scans: 24, revenue: 720 },
  { label: 'Sun', scans: 15, revenue: 450 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-3 text-sm">
      <p className="font-bold text-slate-800 dark:text-white mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-slate-600 dark:text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: entry.color }} />
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function EngagementChart({
  data = DEMO_DATA,
  title = 'Weekly Engagement',
}) {
  const [chartType, setChartType] = useState('area');

  const chartColors = {
    primary: '#0ea5e9',    // cyan-500 (brand restaurant accent)
    secondary: '#8b5cf6',  // violet-500
    grid: 'rgba(148,163,184,0.1)',
  };

  return (
    <div className="rounded-3xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-500" />
          {title}
        </h3>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              chartType === 'area'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            aria-label="Show area chart"
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
            Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            aria-label="Show bar chart"
          >
            <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
            Bar
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full" role="img" aria-label={`${title} chart showing scan and revenue data`}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.secondary} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.secondary} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="scans"
                name="Scans"
                stroke={chartColors.primary}
                strokeWidth={2.5}
                fill="url(#gradientScans)"
                dot={{ r: 4, fill: chartColors.primary, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue (MAD)"
                stroke={chartColors.secondary}
                strokeWidth={2}
                fill="url(#gradientRevenue)"
                dot={false}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="scans"
                name="Scans"
                fill={chartColors.primary}
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="revenue"
                name="Revenue (MAD)"
                fill={chartColors.secondary}
                radius={[6, 6, 0, 0]}
                barSize={20}
                opacity={0.6}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: chartColors.primary }} />
          QR Scans
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: chartColors.secondary }} />
          Revenue (MAD)
        </span>
      </div>
    </div>
  );
}
