import { useState, useEffect, useRef } from 'react';
import {
  AreaChart as RAreaChart,
  Area,
  BarChart as RBarChart,
  Bar,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ── Data ──
const METRICS = [
  { label: 'Revenue', value: 124500, prefix: '$', suffix: '', format: true, color: '#0ea5e9', change: '+12.5%', up: true, sparkData: [40, 45, 42, 55, 50, 62, 58, 72, 68, 80, 75, 88] },
  { label: 'Usuarios Activos', value: 8247, prefix: '', suffix: '', format: true, color: '#06b6d4', change: '+8.2%', up: true, sparkData: [30, 35, 33, 40, 38, 45, 50, 48, 55, 58, 60, 65] },
  { label: 'Crecimiento', value: 24, prefix: '+', suffix: '%', format: false, color: '#10b981', change: '+3.1%', up: true, sparkData: [12, 15, 14, 18, 16, 20, 19, 22, 21, 23, 22, 24] },
  { label: 'Tasa de Conversion', value: 3.2, prefix: '', suffix: '%', format: false, color: '#8b5cf6', change: '-0.3%', up: false, sparkData: [3.8, 3.5, 3.6, 3.4, 3.5, 3.3, 3.4, 3.2, 3.3, 3.1, 3.2, 3.2] },
];

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CHART_DATA = [12, 19, 15, 28, 24, 35, 31, 42, 38, 52, 48, 58, 55, 62, 68, 72, 65, 78, 82, 88, 85, 92, 96, 100];
const CHART_DATA_PREV = [8, 12, 10, 20, 18, 25, 22, 32, 28, 40, 35, 45, 42, 50, 55, 58, 52, 62, 65, 70, 68, 75, 78, 82];

const AREA_DATA = CHART_DATA.map((v, i) => {
  const year = i < 12 ? '23' : '24';
  return { month: `${MONTHS_SHORT[i % 12]} '${year}`, current: v, previous: CHART_DATA_PREV[i] };
});

const BAR_DATA = [
  { label: 'SaaS Platforms', value: 85, amount: '$42.5k', color: '#0ea5e9' },
  { label: 'Mobile Apps', value: 65, amount: '$32.5k', color: '#06b6d4' },
  { label: 'Cloud Infra', value: 72, amount: '$36k', color: '#8b5cf6' },
  { label: 'DevOps', value: 48, amount: '$24k', color: '#10b981' },
  { label: 'Consulting', value: 58, amount: '$29k', color: '#f59e0b' },
  { label: 'Enterprise', value: 42, amount: '$21k', color: '#ec4899' },
];

const DONUT_DATA = [
  { label: 'Enterprise', value: 35, color: '#0ea5e9', count: '142 clientes' },
  { label: 'Growth', value: 28, color: '#8b5cf6', count: '89 clientes' },
  { label: 'Starter', value: 22, color: '#10b981', count: '201 clientes' },
  { label: 'Free Trial', value: 15, color: '#f59e0b', count: '67 clientes' },
];

const ACTIVITY = [
  { user: 'MC', name: 'Maria C.', action: 'Nuevo contrato firmado', detail: 'TechCorp SA — $45,000', time: 'Hace 2m', color: '#0ea5e9' },
  { user: 'JP', name: 'Juan P.', action: 'Deploy a produccion', detail: 'v2.4.1 — CloudNest API', time: 'Hace 8m', color: '#10b981' },
  { user: 'AL', name: 'Ana L.', action: 'Sprint review completado', detail: 'Sprint 14 — 23 story points', time: 'Hace 15m', color: '#8b5cf6' },
  { user: 'RG', name: 'Roberto G.', action: 'Nuevo cliente onboarded', detail: 'FinApp Pro — Plan Growth', time: 'Hace 32m', color: '#06b6d4' },
  { user: 'SK', name: 'Sofia K.', action: 'Reporte mensual generado', detail: 'Revenue Report — Enero 2024', time: 'Hace 1h', color: '#f59e0b' },
];

const TRANSACTIONS = [
  { id: '#INV-001', client: 'TechCorp SA', amount: '$45,000', status: 'Completado', statusColor: '#10b981', date: '15 Ene', method: 'Transferencia' },
  { id: '#INV-002', client: 'DataFlow Inc', amount: '$28,500', status: 'Pendiente', statusColor: '#f59e0b', date: '14 Ene', method: 'Stripe' },
  { id: '#INV-003', client: 'CloudNest', amount: '$62,000', status: 'Completado', statusColor: '#10b981', date: '12 Ene', method: 'Transferencia' },
  { id: '#INV-004', client: 'FinApp Pro', amount: '$35,200', status: 'En proceso', statusColor: '#0ea5e9', date: '10 Ene', method: 'PayPal' },
  { id: '#INV-005', client: 'NovaTech', amount: '$18,900', status: 'Completado', statusColor: '#10b981', date: '8 Ene', method: 'Stripe' },
];

const SIDEBAR_ICONS = [
  'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
  'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
];

const PANEL_LABELS = ['Overview', 'Analytics', 'Clientes', 'Facturacion', 'Config'];

// ── Helpers ──
function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toString();
}

// ── Custom Tooltips ──

function AreaTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  const current = payload?.find((p) => p.dataKey === 'current');
  const previous = payload?.find((p) => p.dataKey === 'previous');
  const change = current && previous && previous.value > 0
    ? Math.round(((current.value - previous.value) / previous.value) * 100)
    : 0;

  return (
    <div
      className="bg-[#1e293b] border border-sky-500/30 rounded-lg px-3 py-2 shadow-xl"
      style={{ opacity: active && payload?.length ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}
    >
      <p className="text-[10px] text-white/40 mb-1">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-sky-400">${current?.value}k</span>
        <span className={`text-[10px] font-medium ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
      <p className="text-[10px] text-white/25 mt-0.5">Anterior: ${previous?.value}k</p>
    </div>
  );
}

function BarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { label: string; amount: string; color: string }; value: number }> }) {
  const item = payload?.[0]?.payload;
  return (
    <div
      className="bg-[#1e293b] border rounded-lg px-3 py-2 shadow-xl"
      style={{
        borderColor: item ? `${item.color}40` : 'transparent',
        opacity: active && item ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
      }}
    >
      <p className="text-[10px] text-white/40 mb-0.5">{item?.label}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold" style={{ color: item?.color }}>{item?.amount}</span>
        <span className="text-[10px] text-white/40">{payload?.[0]?.value}%</span>
      </div>
    </div>
  );
}

function SparkTooltip({ active, payload, color }: { active?: boolean; payload?: Array<{ value: number }>; color: string }) {
  return (
    <div
      className="bg-[#1e293b] border rounded px-2 py-1 shadow-lg"
      style={{
        borderColor: `${color}50`,
        opacity: active && payload?.length ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
      }}
    >
      <span className="text-[10px] font-semibold" style={{ color }}>{payload?.[0]?.value ?? ''}</span>
    </div>
  );
}

// ── Layout Components ──

function Sidebar({ activePanel, onPanelChange }: { activePanel: number; onPanelChange: (i: number) => void }) {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  return (
    <div className="hidden md:flex flex-col items-center w-12 bg-[#0d1526] border-r border-white/5 py-3 gap-1 shrink-0">
      <div className="w-7 h-7 rounded-lg bg-linear-to-br from-sky-500 to-cyan-500 flex items-center justify-center mb-3">
        <span className="text-white font-bold text-[10px]">G2</span>
      </div>
      {SIDEBAR_ICONS.map((d, i) => (
        <div key={i} className="relative">
          <button
            onClick={() => onPanelChange(i)}
            onMouseEnter={() => setHoveredIcon(i)}
            onMouseLeave={() => setHoveredIcon(null)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              i === activePanel
                ? 'bg-sky-500/15 text-sky-400 shadow-lg shadow-sky-500/10'
                : 'text-white/25 hover:text-white/50 hover:bg-white/5'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={d} />
            </svg>
          </button>
          {hoveredIcon === i && i !== activePanel && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-[#1e293b] border border-white/10 shadow-xl z-50 whitespace-nowrap pointer-events-none">
              <span className="text-[10px] text-white/70 font-medium">{PANEL_LABELS[i]}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TopBar({ panelLabel }: { panelLabel: string }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0d1526]/50">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold text-white/80">{panelLabel}</h2>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 font-medium">Live</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all duration-300 ${
            searchFocused
              ? 'bg-white/8 border-sky-500/30 w-40 shadow-lg shadow-sky-500/5'
              : 'bg-white/5 border-white/5 w-28'
          }`}
          onMouseEnter={() => setSearchFocused(true)}
          onMouseLeave={() => setSearchFocused(false)}
        >
          <svg className={`w-3 h-3 transition-colors ${searchFocused ? 'text-sky-400' : 'text-white/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className={`text-[10px] transition-colors ${searchFocused ? 'text-white/40' : 'text-white/20'}`}>Buscar...</span>
        </div>
        <button className="relative w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        </button>
        <div className="w-6 h-6 rounded-full bg-linear-to-br from-sky-400 to-cyan-500 flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-sky-500/20 transition-all duration-200">
          <span className="text-[9px] font-bold text-white">AD</span>
        </div>
      </div>
    </div>
  );
}

// ── Chart Components (Recharts) ──

function MetricCard({ metric, animated }: { metric: typeof METRICS[0]; animated: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hovered, setHovered] = useState(false);
  const sparkData = metric.sparkData.map((v) => ({ v }));

  useEffect(() => {
    if (!animated) return;
    const duration = 2000;
    const start = performance.now();
    const target = metric.value;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2.5);
      setDisplayValue(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [animated, metric.value]);

  const formatted = metric.format
    ? formatNumber(Math.round(displayValue))
    : displayValue.toFixed(metric.value % 1 !== 0 ? 1 : 0);

  return (
    <div
      className="dash-card p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer"
      style={{
        borderColor: hovered ? `${metric.color}40` : undefined,
        boxShadow: hovered ? `0 0 20px ${metric.color}15, 0 0 40px ${metric.color}08` : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/35 uppercase tracking-wider font-medium">{metric.label}</p>
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded transition-colors duration-300 ${metric.up ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
          {metric.change}
        </span>
      </div>
      <p className="text-lg font-bold mt-1" style={{ color: metric.color }}>
        {metric.prefix}{formatted}{metric.suffix}
      </p>
      {/* Recharts sparkline */}
      <div className="mt-1" style={{ height: 32, opacity: hovered ? 1 : 0.6, transition: 'opacity 0.3s' }}>
        {animated && (
          <ResponsiveContainer width="100%" height={32}>
            <RAreaChart data={sparkData} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
              <Tooltip
                content={<SparkTooltip color={metric.color} />}
                cursor={{ stroke: `${metric.color}40`, strokeDasharray: '3 3' }}
              />
              <Area
                type="natural"
                dataKey="v"
                stroke={metric.color}
                fill="none"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: metric.color, stroke: '#111827', strokeWidth: 2 }}
                animationDuration={2000}
                animationEasing="ease-out"
              />
            </RAreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function RevenueChart({ animated }: { animated: boolean }) {
  const [activeRange, setActiveRange] = useState<'6m' | '12m' | '24m'>('24m');

  return (
    <div className="dash-card p-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-white/70">Revenue Growth</p>
          <p className="text-[10px] text-white/30">vs periodo anterior</p>
        </div>
        <div className="flex items-center gap-1">
          {(['6m', '12m', '24m'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`text-[9px] px-2 py-0.5 rounded transition-all duration-200 ${
                activeRange === r
                  ? 'bg-sky-500/20 text-sky-400 font-medium'
                  : 'text-white/30 hover:text-white/50 hover:bg-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 240 }}>
        {animated && (
          <ResponsiveContainer width="100%" height="100%">
            <RAreaChart data={AREA_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="areaGradMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="40%" stopColor="#0ea5e9" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="areaGradPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }}
                interval={4}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 9 }}
                tickFormatter={(v: number) => `${v}k`}
              />
              <Tooltip content={<AreaTooltip />} cursor={{ stroke: 'rgba(14,165,233,0.3)', strokeDasharray: '3 3' }} />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="rgba(255,255,255,0.12)"
                fill="url(#areaGradPrev)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3, fill: '#1e293b', stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1.5 }}
                animationDuration={2000}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#0ea5e9"
                fill="url(#areaGradMain)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#0ea5e9', stroke: '#111827', strokeWidth: 2 }}
                animationDuration={2000}
                animationEasing="ease-out"
              />
            </RAreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function DonutChart({ animated }: { animated: boolean }) {
  const total = DONUT_DATA.reduce((s, d) => s + d.value, 0);
  const [hoveredSeg, setHoveredSeg] = useState<number | null>(null);

  return (
    <div className="dash-card p-3">
      <p className="text-xs font-medium text-white/70 mb-3">Distribucion de Clientes</p>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0 w-28 h-28">
          {animated && (
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={48}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  onMouseEnter={(_, idx) => setHoveredSeg(idx)}
                  onMouseLeave={() => setHoveredSeg(null)}
                >
                  {DONUT_DATA.map((d, i) => (
                    <Cell
                      key={d.label}
                      fill={d.color}
                      opacity={hoveredSeg !== null && hoveredSeg !== i ? 0.4 : 1}
                      style={{ filter: hoveredSeg === i ? `drop-shadow(0 0 8px ${d.color}90)` : 'none', transition: 'opacity 0.4s ease, filter 0.4s ease' }}
                    />
                  ))}
                </Pie>
              </RPieChart>
            </ResponsiveContainer>
          )}
          {/* Center text overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Default (Total) */}
            <div
              className="absolute flex flex-col items-center justify-center"
              style={{ opacity: hoveredSeg === null ? 1 : 0, transition: 'opacity 0.3s ease' }}
            >
              <span className="text-sm font-bold text-white leading-none">{total}%</span>
              <span className="text-[8px] text-white/30 mt-0.5">Total</span>
            </div>
            {/* Hovered segment */}
            {DONUT_DATA.map((d, i) => (
              <div
                key={d.label}
                className="absolute flex flex-col items-center justify-center"
                style={{ opacity: hoveredSeg === i ? 1 : 0, transition: 'opacity 0.3s ease' }}
              >
                <span className="text-base font-bold leading-none" style={{ color: d.color }}>
                  {d.value}%
                </span>
                <span className="text-[8px] text-white/50 mt-0.5">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="space-y-1 flex-1 min-w-0">
          {DONUT_DATA.map((d, i) => (
            <div
              key={d.label}
              className="flex items-center justify-between gap-2 px-1.5 rounded transition-all duration-300 ease-out cursor-pointer"
              style={{
                height: 32,
                backgroundColor: hoveredSeg === i ? `${d.color}10` : 'transparent',
                borderLeft: hoveredSeg === i ? `2px solid ${d.color}` : '2px solid transparent',
              }}
              onMouseEnter={() => setHoveredSeg(i)}
              onMouseLeave={() => setHoveredSeg(null)}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <div className="min-w-0">
                  <span className="text-[10px] text-white/50 truncate block leading-tight">{d.label}</span>
                  <span
                    className="text-[9px] block leading-tight transition-opacity duration-200"
                    style={{ color: d.color, opacity: hoveredSeg === i ? 1 : 0 }}
                  >
                    {d.count}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-medium shrink-0 transition-colors duration-200" style={{ color: hoveredSeg === i ? d.color : 'rgba(255,255,255,0.7)' }}>
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceBarChart({ animated }: { animated: boolean }) {
  return (
    <div className="dash-card p-3">
      <p className="text-xs font-medium text-white/70 mb-3">Revenue por Servicio</p>
      <div style={{ height: BAR_DATA.length * 38 }}>
        {animated && (
          <ResponsiveContainer width="100%" height="100%">
            <RBarChart data={BAR_DATA} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barSize={12}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                width={85}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {BAR_DATA.map((d) => (
                  <Cell key={d.label} fill={d.color} />
                ))}
              </Bar>
            </RBarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ── Non-chart Components ──

function ActivityFeed() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  return (
    <div className="dash-card p-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-white/70">Actividad Reciente</p>
        <span className="text-[9px] text-sky-400 cursor-pointer hover:underline">Ver todo</span>
      </div>
      <div className="space-y-1">
        {ACTIVITY.map((a, i) => {
          const isHov = hoveredItem === i;
          const isExp = expandedItem === i;
          return (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-300 ease-out"
              style={{
                backgroundColor: isHov ? `${a.color}08` : 'transparent',
                transform: isHov ? 'translateX(3px)' : 'none',
                borderLeft: isHov ? `2px solid ${a.color}` : '2px solid transparent',
              }}
              onMouseEnter={() => setHoveredItem(i)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setExpandedItem(isExp ? null : i)}
            >
              <div
                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold transition-all duration-200"
                style={{ backgroundColor: `${a.color}${isHov ? '35' : '20'}`, color: a.color }}
              >
                {a.user}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] truncate transition-colors duration-200" style={{ color: isHov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>
                  <span className="font-medium" style={{ color: isHov ? 'white' : 'rgba(255,255,255,0.8)' }}>{a.name}</span> {a.action}
                </p>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isExp ? 20 : 0, opacity: isExp ? 1 : 0 }}>
                  <p className="text-[9px] mt-0.5" style={{ color: a.color }}>{a.detail}</p>
                </div>
                <p className="text-[9px] text-white/20">{a.time}</p>
              </div>
              <div className="flex items-center gap-1 mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionsTable({ animated }: { animated: boolean }) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="dash-card p-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-white/70">Ultimas Transacciones</p>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/5 cursor-pointer hover:bg-white/8 hover:border-sky-500/20 transition-all duration-200">
          <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-[9px] text-white/30">Filtrar</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 pb-1.5 mb-1.5 border-b border-white/5">
        {['ID', 'Cliente', 'Fecha', 'Monto', 'Estado'].map((h) => (
          <span key={h} className={`text-[9px] text-white/25 uppercase tracking-wider font-medium ${h === 'Monto' || h === 'Estado' ? 'text-right' : ''}`}>{h}</span>
        ))}
      </div>
      <div className="space-y-0.5">
        {TRANSACTIONS.map((t, i) => {
          const isHov = hoveredRow === i;
          const isSel = selectedRow === i;
          return (
            <div
              key={t.id}
              className="grid grid-cols-5 gap-2 py-1.5 rounded px-1.5 cursor-pointer transition-all duration-300 ease-out"
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? (isHov ? 'translateX(3px)' : 'none') : 'translateY(8px)',
                transition: `opacity 0.4s ease-out ${i * 0.1}s, transform 0.3s ease-out, background-color 0.2s`,
                backgroundColor: isSel ? `${t.statusColor}10` : isHov ? 'rgba(255,255,255,0.03)' : 'transparent',
                borderLeft: isSel ? `2px solid ${t.statusColor}` : '2px solid transparent',
              }}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => setSelectedRow(isSel ? null : i)}
            >
              <span className="text-[10px] text-white/40 font-mono">{t.id}</span>
              <span className="text-[10px] truncate transition-colors duration-200" style={{ color: isHov || isSel ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>{t.client}</span>
              <span className="text-[10px] text-white/30">{t.date}</span>
              <span className="text-[10px] font-medium text-right transition-colors duration-200" style={{ color: isHov || isSel ? 'white' : 'rgba(255,255,255,0.8)' }}>{t.amount}</span>
              <div className="flex justify-end">
                <span
                  className="text-[9px] font-medium px-1.5 py-0.5 rounded-full transition-colors duration-200"
                  style={{ color: t.statusColor, backgroundColor: `${t.statusColor}${isHov || isSel ? '25' : '15'}` }}
                >
                  {t.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressRings({ animated }: { animated: boolean }) {
  const rings = [
    { label: 'Sprint', value: 72, color: '#0ea5e9', detail: '18/25 tasks', status: 'En curso' },
    { label: 'QA', value: 89, color: '#10b981', detail: '16/18 tests', status: 'Casi listo' },
    { label: 'Deploy', value: 45, color: '#f59e0b', detail: '3/7 stages', status: 'Pendiente' },
  ];
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);

  return (
    <div className="dash-card p-3">
      <p className="text-xs font-medium text-white/70 mb-3">Progreso del Proyecto</p>
      <div className="space-y-2.5">
        {rings.map((ring, i) => {
          const isHov = hoveredRing === i;
          return (
            <div
              key={ring.label}
              className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-all duration-300 ease-out"
              style={{
                backgroundColor: isHov ? `${ring.color}08` : 'transparent',
                borderLeft: isHov ? `2px solid ${ring.color}` : '2px solid transparent',
              }}
              onMouseEnter={() => setHoveredRing(i)}
              onMouseLeave={() => setHoveredRing(null)}
            >
              <svg viewBox="0 0 48 48" className="w-11 h-11 shrink-0">
                <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r={r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={isHov ? 5.5 : 4}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={animated ? circumference * (1 - ring.value / 100) : circumference}
                  transform="rotate(-90 24 24)"
                  style={{
                    transition: 'stroke-dashoffset 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), stroke-width 0.3s ease',
                    filter: isHov ? `drop-shadow(0 0 4px ${ring.color}80)` : 'none',
                  }}
                />
                <text x="24" y="26" textAnchor="middle" fill={isHov ? ring.color : 'white'} fontSize="10" fontWeight="bold" style={{ transition: 'fill 0.3s' }}>
                  {ring.value}%
                </text>
              </svg>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium transition-colors duration-300" style={{ color: isHov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>{ring.label}</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full transition-colors duration-300" style={{ color: ring.color, backgroundColor: `${ring.color}15` }}>
                    {ring.status}
                  </span>
                </div>
                <p className="text-[9px] text-white/30 mt-0.5">{ring.detail}</p>
                <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: animated ? `${ring.value}%` : '0%',
                      backgroundColor: ring.color,
                      opacity: 0.6,
                      transition: 'width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [notifications, setNotifications] = useState<boolean[]>([true, true, false]);
  const [selectedTheme, setSelectedTheme] = useState(0);

  const notifItems = [
    { label: 'Alertas de revenue', desc: 'Recibe notificaciones cuando hay cambios significativos' },
    { label: 'Nuevos clientes', desc: 'Notificacion al registrar un nuevo cliente' },
    { label: 'Reportes semanales', desc: 'Resumen semanal por email' },
  ];

  const handleToggle = (idx: number) => {
    setNotifications((prev: boolean[]) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="space-y-2.5">
      <div className="dash-card p-4">
        <p className="text-xs font-medium text-white/70 mb-3">Perfil</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">AD</span>
          </div>
          <div>
            <p className="text-sm text-white/80 font-medium">Admin Dashboard</p>
            <p className="text-[11px] text-white/30">admin@gmi2consulting.com</p>
          </div>
          <button className="ml-auto text-[10px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-sky-500/30 transition-all duration-200">
            Editar
          </button>
        </div>
      </div>
      <div className="dash-card p-4">
        <p className="text-xs font-medium text-white/70 mb-3">Notificaciones</p>
        <div className="space-y-3">
          {notifItems.map((item, idx) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-white/60">{item.label}</p>
                <p className="text-[9px] text-white/25">{item.desc}</p>
              </div>
              <button
                onClick={() => handleToggle(idx)}
                className="w-9 h-5 rounded-full relative shrink-0 transition-colors duration-200 cursor-pointer"
                style={{ backgroundColor: notifications[idx] ? '#0ea5e9' : 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: notifications[idx] ? 18 : 2 }}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="dash-card p-4">
        <p className="text-xs font-medium text-white/70 mb-3">Tema</p>
        <div className="flex gap-2">
          {['Oscuro', 'Claro', 'Sistema'].map((t, i) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(i)}
              className={`px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all duration-200 ${
                i === selectedTheme
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'bg-white/5 text-white/30 border border-white/5 hover:border-white/10 hover:text-white/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="dash-card p-4">
        <p className="text-xs font-medium text-white/70 mb-3">Idioma</p>
        <div className="flex gap-2">
          {['Espanol', 'English', 'Portugues'].map((lang, i) => (
            <button
              key={lang}
              className={`px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all duration-200 ${
                i === 0
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'bg-white/5 text-white/30 border border-white/5 hover:border-white/10 hover:text-white/50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ──
export default function NexusDashboardApp() {
  const [animated, setAnimated] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimated(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex bg-[#111827] h-110 md:h-140 overflow-hidden">
      <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar panelLabel={PANEL_LABELS[activePanel]} />
        <div className="flex-1 p-2.5 md:p-3 space-y-2.5 overflow-y-auto">

          {/* Panel 0: Overview */}
          {activePanel === 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {METRICS.map((m) => (
                  <MetricCard key={m.label} metric={m} animated={animated} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="lg:col-span-2">
                  <RevenueChart animated={animated} />
                </div>
                <DonutChart animated={animated} />
              </div>
            </>
          )}

          {/* Panel 1: Analytics */}
          {activePanel === 1 && (
            <>
              <RevenueChart animated={animated} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <ServiceBarChart animated={animated} />
                <ProgressRings animated={animated} />
              </div>
            </>
          )}

          {/* Panel 2: Clientes */}
          {activePanel === 2 && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard metric={METRICS[1]} animated={animated} />
                <MetricCard metric={METRICS[3]} animated={animated} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <DonutChart animated={animated} />
                <ActivityFeed />
              </div>
            </>
          )}

          {/* Panel 3: Facturacion */}
          {activePanel === 3 && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard metric={METRICS[0]} animated={animated} />
                <MetricCard metric={METRICS[2]} animated={animated} />
              </div>
              <TransactionsTable animated={animated} />
            </>
          )}

          {/* Panel 4: Config */}
          {activePanel === 4 && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
