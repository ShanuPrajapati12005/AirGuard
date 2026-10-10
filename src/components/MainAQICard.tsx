import React from 'react';
import { ArrowUpRight, ShieldCheck, AlertTriangle, Wind, Info } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';

export const MainAQICard: React.FC = () => {
  const { airData, isRefreshing } = useAirGuard();

  // AQI Gauge angle calculation (0 to 500 mapped to -90deg to +90deg)
  const aqiClamped = Math.min(Math.max(airData.aqi, 0), 500);
  const percentage = (aqiClamped / 500) * 100;
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            CURRENT AIR QUALITY
          </span>
          <h3 className="text-sm font-semibold text-slate-700">Ambient Atmospheric Index</h3>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider transition-colors"
          style={{
            backgroundColor: `${airData.categoryColor}15`,
            borderColor: `${airData.categoryColor}40`,
            color: airData.categoryColor,
          }}
        >
          {airData.categoryLabel}
        </span>
      </div>

      {/* Main Metric & Gauge */}
      <div className="py-5 flex items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AQI</div>
          <div className={`text-6xl font-extrabold tracking-tight transition-transform duration-300 ${isRefreshing ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`} style={{ color: airData.categoryColor }}>
            {airData.aqi}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: airData.categoryColor }} />
            {airData.category === 'good' && 'Air is clean & healthy'}
            {airData.category === 'satisfactory' && 'Acceptable for most individuals'}
            {airData.category === 'moderate' && 'Discomfort for sensitive groups'}
            {airData.category === 'poor' && 'Avoid prolonged outdoor exertion'}
            {airData.category === 'verypoor' && 'Hazardous particulate concentration'}
            {airData.category === 'severe' && 'Emergency level air hazard'}
          </p>
        </div>

        {/* Circular Gauge Graphic */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="9"
            />
            {/* Value ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={airData.categoryColor}
              strokeWidth="9"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Scale</span>
            <span className="text-xs font-extrabold text-slate-700">0–500</span>
          </div>
        </div>
      </div>

      {/* Pollutant Sub-metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[11px] font-bold text-slate-400">PM2.5</div>
          <div className="text-base font-bold text-slate-800">{airData.pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
          <div className="text-[10px] font-medium text-amber-600">Fine Dust</div>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[11px] font-bold text-slate-400">PM10</div>
          <div className="text-base font-bold text-slate-800">{airData.pm10} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
          <div className="text-[10px] font-medium text-slate-500">Coarse Dust</div>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[11px] font-bold text-slate-400">NO₂</div>
          <div className="text-base font-bold text-slate-800">{airData.no2} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
          <div className="text-[10px] font-medium text-slate-500">Vehicle Gas</div>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
          <div className="text-[11px] font-bold text-slate-400">O₃</div>
          <div className="text-base font-bold text-slate-800">{airData.o3} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></div>
          <div className="text-[10px] font-medium text-slate-500">Ozone</div>
        </div>
      </div>
    </div>
  );
};
