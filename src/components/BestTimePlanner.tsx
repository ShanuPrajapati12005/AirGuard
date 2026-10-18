import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { Clock, Star, Sunrise } from 'lucide-react';
import { HOURLY_FORECASTS } from '../data/mockData';
import { useAirGuard } from '../context/AirGuardContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const BestTimePlanner: React.FC = () => {
  const { hourlyForecasts } = useAirGuard();
  const data = hourlyForecasts && hourlyForecasts.length > 0 ? hourlyForecasts : HOURLY_FORECASTS;

  return (
    <div className="card card-3d p-3.5 sm:p-5 border border-[var(--line)] shadow-[var(--sh-3d)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-display text-sm font-medium text-[var(--ink)] tracking-tight">
              Best Outdoor Window
            </h3>
          </div>
          <p className="text-[11px] text-[var(--mut)] mt-1 font-normal">
            Atmospheric boundary layer particulate dispersion cycle
          </p>
        </div>

        {/* Recommended Pill */}
        <Badge variant="accent" className="gap-1.5 px-2.5 sm:px-3 py-1 font-semibold text-[10px] sm:text-[11px]">
          <Star className="w-3 h-3 fill-[var(--ac)] text-[var(--ac)]" />
          <span>Recommended: 06:00 – 07:30 AM</span>
        </Badge>
      </div>

      {/* Hourly Quick Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2 my-4 sm:my-5">
        {data.slice(0, 8).map((f) => (
          <div
            key={f.time}
            className={cn(
              "card p-1.5 sm:p-2 text-center transition-all shadow-2xs",
              f.recommended
                ? "bg-[var(--ac)]/10 border-[var(--ac)]/30"
                : "bg-[var(--bg)] border-[var(--line)]"
            )}
          >
            <div className="text-[9px] sm:text-[10px] text-[var(--mut)] font-mono">{f.time}</div>
            <div
              className="font-display text-xs sm:text-sm font-medium my-0.5"
              style={{ color: f.color }}
            >
              {f.aqi}
            </div>
            <div
              className="text-[8px] sm:text-[9px] font-medium uppercase tracking-wider truncate"
              style={{ color: f.color }}
            >
              {f.level}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Area Chart */}
      <div className="h-44 sm:h-56 w-full pt-2 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ac)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--ac)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="var(--mut)" fontSize={10} tickLine={false} tickMargin={8} />
            <YAxis stroke="var(--mut)" fontSize={10} tickLine={false} tickMargin={8} domain={[0, 350]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="card bg-[var(--card)] text-[var(--ink)] p-2.5 shadow-md text-xs border border-[var(--line)]">
                      <div className="font-display font-medium border-b border-[var(--line)] pb-1 mb-1">{data.time} Forecast</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-[var(--ac2)]">AQI: {data.aqi}</span>
                        <span className="text-[var(--mut)]">({data.level})</span>
                      </div>
                      <div className="text-[var(--mut)] text-[10px] mt-0.5">PM2.5: {data.pm25} µg/m³</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Optimal window highlight */}
            <ReferenceArea x1="05 AM" x2="07 AM" fill="var(--ac)" fillOpacity={0.08} />
            <ReferenceLine y={200} stroke="#e11d48" strokeDasharray="3 3" label={{ value: 'Unhealthy', fill: '#e11d48', fontSize: 10, position: 'insideTopRight' }} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="var(--ac)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#aqiAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insight banner */}
      <div className="mt-4 p-3 card bg-[var(--bg)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--ink)]">
        <span className="flex items-center gap-2 font-normal">
          <Sunrise className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
          Optimal particulate ventilation window is between 06:00 AM and 07:30 AM before diurnal traffic build-up.
        </span>
        <span className="font-semibold text-[10px] bg-[var(--card)] border border-[var(--line)] px-2.5 py-1 rounded-full text-[var(--ac)] shrink-0 uppercase tracking-wider">
          -64% Exposure
        </span>
      </div>
    </div>
  );
};
