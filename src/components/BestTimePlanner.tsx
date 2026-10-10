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
import { Clock, Star, Sunrise, Sunset, Wind } from 'lucide-react';
import { HOURLY_FORECASTS } from '../data/mockData';

import { useAirGuard } from '../context/AirGuardContext';

export const BestTimePlanner: React.FC = () => {
  const { hourlyForecasts } = useAirGuard();
  const data = hourlyForecasts && hourlyForecasts.length > 0 ? hourlyForecasts : HOURLY_FORECASTS;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Best Outdoor Window Today</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Diurnal atmospheric boundary layer forecast & telemetry
          </p>
        </div>

        {/* Recommended Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Recommended Window: 6:00 – 7:30 AM</span>
        </div>
      </div>

      {/* Hourly Quick Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 my-4">
        {data.slice(0, 8).map((f) => (
          <div
            key={f.time}
            className={`p-2 rounded-xl text-center border transition-all ${
              f.recommended
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-600">{f.time}</div>
            <div
              className="text-xs font-black my-0.5"
              style={{ color: f.color }}
            >
              {f.aqi}
            </div>
            <div
              className="text-[9px] font-bold uppercase tracking-wide truncate"
              style={{ color: f.color }}
            >
              {f.level}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Area Chart */}
      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 350]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs border border-slate-800">
                      <div className="font-bold">{data.time} Forecast</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-amber-300">AQI: {data.aqi}</span>
                        <span className="text-slate-400">({data.level})</span>
                      </div>
                      <div className="text-slate-400 text-[10px] mt-0.5">PM2.5: {data.pm25} µg/m³</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Optimal window highlight */}
            <ReferenceArea x1="05 AM" x2="07 AM" fill="#10b981" fillOpacity={0.15} />
            <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Unhealthy Threshold', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#f97316"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#aqiAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insight banner */}
      <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between text-xs text-emerald-800">
        <span className="flex items-center gap-2 font-medium">
          <Sunrise className="w-4 h-4 text-emerald-600 shrink-0" />
          Optimal particulate dispersion is between 6:00 AM and 7:30 AM before surface traffic peak.
        </span>
        <span className="font-bold text-[11px] bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900 shrink-0">
          -64% Exposure
        </span>
      </div>
    </div>
  );
};
