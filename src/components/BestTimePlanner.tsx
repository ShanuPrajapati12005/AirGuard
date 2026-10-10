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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const BestTimePlanner: React.FC = () => {
  const { hourlyForecasts } = useAirGuard();
  const data = hourlyForecasts && hourlyForecasts.length > 0 ? hourlyForecasts : HOURLY_FORECASTS;

  return (
    <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200/60 shadow-none">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight">Best Outdoor Window</h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium tracking-tight">
            Diurnal atmospheric boundary layer forecast & telemetry
          </p>
        </div>

        {/* Recommended Pill */}
        <Badge className="gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md text-[11px] font-medium shadow-none border-transparent">
          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
          <span>Recommended Window: 6:00 – 7:30 AM</span>
        </Badge>
      </div>

      {/* Hourly Quick Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 my-6">
        {data.slice(0, 8).map((f) => (
          <div
            key={f.time}
            className={cn(
              "p-2.5 rounded-lg text-center transition-all shadow-none border",
              f.recommended
                ? "bg-emerald-50/50 border-emerald-200"
                : "bg-zinc-50/50 border-zinc-200/60"
            )}
          >
            <div className="text-[10px] font-medium text-zinc-500 tracking-tight">{f.time}</div>
            <div
              className="text-sm font-semibold my-0.5 tracking-tight"
              style={{ color: f.color }}
            >
              {f.aqi}
            </div>
            <div
              className="text-[9px] font-medium uppercase tracking-widest truncate"
              style={{ color: f.color }}
            >
              {f.level}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Area Chart */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#a1a1aa" fontSize={10} tickLine={false} tickMargin={8} />
            <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} tickMargin={8} domain={[0, 350]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white text-zinc-800 p-2.5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[11px] border border-zinc-100">
                      <div className="font-semibold text-zinc-900 border-b border-zinc-50 pb-1 mb-1 tracking-tight">{data.time} Forecast</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-amber-600 tracking-tight">AQI: {data.aqi}</span>
                        <span className="text-zinc-500">({data.level})</span>
                      </div>
                      <div className="text-zinc-400 text-[10px] mt-1 font-medium tracking-tight">PM2.5: {data.pm25} µg/m³</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Optimal window highlight */}
            <ReferenceArea x1="05 AM" x2="07 AM" fill="#10b981" fillOpacity={0.08} />
            <ReferenceLine y={200} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Unhealthy', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#aqiAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insight banner */}
      <div className="mt-4 p-3 bg-zinc-50/50 border border-zinc-200/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-zinc-700 shadow-none">
        <span className="flex items-center gap-2.5 font-medium tracking-tight">
          <Sunrise className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          Optimal particulate dispersion is between 6:00 AM and 7:30 AM before surface traffic peak.
        </span>
        <span className="font-semibold text-[10px] bg-white border border-zinc-200/60 px-2 py-1 rounded text-zinc-600 shrink-0 tracking-widest uppercase">
          -64% Exposure
        </span>
      </div>
    </div>
  );
};
