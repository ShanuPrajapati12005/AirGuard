import React from 'react';
import { ArrowUpRight, ShieldCheck, AlertTriangle, Wind, Info } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const MainAQICard: React.FC = () => {
  const { airData, isRefreshing } = useAirGuard();

  // AQI Gauge angle calculation (0 to 500 mapped to -90deg to +90deg)
  const aqiClamped = Math.min(Math.max(airData.aqi, 0), 500);
  const percentage = (aqiClamped / 500) * 100;
  const strokeDashoffset = 283 - (283 * percentage) / 100;
  
  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Ambient Air Quality</h3>
          <span className="text-[11px] font-medium text-zinc-500">Live Station Data</span>
        </div>
        <div
          className="text-[11px] font-medium px-2 py-1 rounded-md"
          style={{
            backgroundColor: `${airData.categoryColor}10`,
            color: airData.categoryColor,
          }}
        >
          {airData.categoryLabel}
        </div>
      </div>

      {/* Main Metric & Gauge */}
      <div className="py-2 flex items-center justify-between gap-6">
        <div>
          <div className="text-[12px] font-medium text-zinc-400 tracking-tight mb-0.5">AQI Index</div>
          <div className={cn(
            "text-6xl sm:text-7xl font-bold tracking-tighter transition-opacity duration-300",
            isRefreshing ? 'opacity-40' : 'opacity-100'
          )} style={{ color: airData.categoryColor }}>
            {airData.aqi}
          </div>
          <p className="text-[12px] font-medium text-zinc-500 mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: airData.categoryColor }} />
            {airData.category === 'good' && 'Clean & healthy'}
            {airData.category === 'satisfactory' && 'Acceptable for most'}
            {airData.category === 'moderate' && 'Discomfort for sensitive groups'}
            {airData.category === 'poor' && 'Avoid prolonged exertion'}
            {airData.category === 'verypoor' && 'Hazardous particulate concentration'}
            {airData.category === 'severe' && 'Emergency level hazard'}
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
              stroke="#f4f4f5"
              strokeWidth="4"
            />
            {/* Value ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={airData.categoryColor}
              strokeWidth="4"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-medium text-zinc-400 tracking-tight">Scale</span>
            <span className="text-xs font-semibold text-zinc-800 tracking-tight">500</span>
          </div>
        </div>
      </div>

      {/* Pollutant Sub-metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-auto">
        <div className="flex flex-col">
          <div className="text-[11px] font-medium text-zinc-500 tracking-tight">PM2.5</div>
          <div className="text-lg font-semibold text-zinc-900 tracking-tight -mt-0.5">{airData.pm25} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span></div>
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] font-medium text-zinc-500 tracking-tight">PM10</div>
          <div className="text-lg font-semibold text-zinc-900 tracking-tight -mt-0.5">{airData.pm10} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span></div>
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] font-medium text-zinc-500 tracking-tight">NO₂</div>
          <div className="text-lg font-semibold text-zinc-900 tracking-tight -mt-0.5">{airData.no2} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span></div>
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] font-medium text-zinc-500 tracking-tight">O₃</div>
          <div className="text-lg font-semibold text-zinc-900 tracking-tight -mt-0.5">{airData.o3} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span></div>
        </div>
      </div>
    </div>
  );
};
