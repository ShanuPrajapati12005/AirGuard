import React from 'react';
import { useAirGuard } from '../context/AirGuardContext';
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
          <h3 className="font-display text-base font-medium text-[var(--ink)] tracking-tight">Ambient Air Quality</h3>
          <span className="text-[11px] font-normal text-[var(--mut)]">Station Telemetry</span>
        </div>
        <div
          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border shadow-2xs"
          style={{
            backgroundColor: `${airData.categoryColor}15`,
            borderColor: `${airData.categoryColor}40`,
            color: airData.categoryColor,
          }}
        >
          {airData.categoryLabel}
        </div>
      </div>

      {/* Main Metric & Gauge */}
      <div className="py-2 flex items-center justify-between gap-3 sm:gap-6">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-[var(--mut)] uppercase tracking-wider mb-0.5">AQI Index</div>
          <div className={cn(
            "font-display text-5xl xs:text-6xl sm:text-7xl font-normal tracking-tight transition-opacity duration-300",
            isRefreshing ? 'opacity-40' : 'opacity-100'
          )} style={{ color: airData.categoryColor }}>
            {airData.aqi}
          </div>
          <p className="text-xs text-[var(--mut)] mt-1.5 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: airData.categoryColor }} />
            <span className="truncate">
              {airData.category === 'good' && 'Clean & healthy conditions'}
              {airData.category === 'satisfactory' && 'Acceptable for most individuals'}
              {airData.category === 'moderate' && 'Discomfort for sensitive profiles'}
              {airData.category === 'poor' && 'Avoid prolonged outdoor exertion'}
              {airData.category === 'verypoor' && 'Hazardous particulate concentration'}
              {airData.category === 'severe' && 'Emergency level atmospheric hazard'}
            </span>
          </p>
        </div>

        {/* Circular Gauge Graphic */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="var(--line)"
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
            <span className="text-[10px] text-[var(--mut)]">Scale</span>
            <span className="font-mono text-xs font-semibold text-[var(--ink)]">500</span>
          </div>
        </div>
      </div>

      {/* Pollutant Sub-metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-auto border-t border-[var(--line)]">
        <div className="flex flex-col">
          <div className="text-[11px] text-[var(--mut)]">PM2.5</div>
          <div className="font-display text-base font-medium text-[var(--ink)] mt-0.5">
            {airData.pm25} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">µg/m³</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] text-[var(--mut)]">PM10</div>
          <div className="font-display text-base font-medium text-[var(--ink)] mt-0.5">
            {airData.pm10} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">µg/m³</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] text-[var(--mut)]">NO₂</div>
          <div className="font-display text-base font-medium text-[var(--ink)] mt-0.5">
            {airData.no2} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">µg/m³</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] text-[var(--mut)]">O₃</div>
          <div className="font-display text-base font-medium text-[var(--ink)] mt-0.5">
            {airData.o3} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">µg/m³</span>
          </div>
        </div>
      </div>
    </div>
  );
};
