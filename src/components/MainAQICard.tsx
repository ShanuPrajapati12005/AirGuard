import React from 'react';
import { useAirGuard } from '../context/AirGuardContext';
import { cn } from '@/lib/utils';
import { Wind, Thermometer, Droplets, ShieldCheck } from 'lucide-react';

interface MainAQICardProps {
  extended?: boolean;
}

export const MainAQICard: React.FC<MainAQICardProps> = ({ extended = false }) => {
  const { airData, isRefreshing } = useAirGuard();

  // AQI Gauge angle calculation (0 to 500 mapped to -90deg to +90deg)
  const aqiClamped = Math.min(Math.max(airData.aqi, 0), 500);
  const percentage = (aqiClamped / 500) * 100;
  const strokeDashoffset = 283 - (283 * percentage) / 100;
  
  return (
    <div className="flex flex-col h-full bg-transparent justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="min-w-0 pr-2">
            <h3 className="font-display text-base font-medium text-[var(--ink)] tracking-tight truncate">
              Ambient Air Quality
            </h3>
            <span className="text-[11px] font-normal text-[var(--mut)] flex items-center gap-1.5 truncate">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                airData.provider === 'waqi' ? "bg-emerald-500 animate-pulse" : "bg-[var(--ac)]"
              )} />
              <span className="truncate" title={airData.stationName || 'Indian NAQI (CPCB Calibrated)'}>
                {airData.stationName ? airData.stationName : 'CPCB NAQI Standard (Live)'}
              </span>
            </span>
          </div>
          <div
            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border shadow-2xs shrink-0"
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

        {/* Extended Microclimate strip when in dedicated Live Air Quality view */}
        {extended && (
          <div className="my-3.5 space-y-2.5">
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-[10px] bg-[var(--bg)] border border-[var(--line)]">
              <div className="flex items-center gap-2 min-w-0">
                <Wind className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-[var(--mut)] uppercase font-medium">Wind Vector</div>
                  <div className="text-xs font-semibold text-[var(--ink)] truncate">{airData.windSpeed} km/h {airData.windDirection}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Thermometer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-[var(--mut)] uppercase font-medium">Temperature</div>
                  <div className="text-xs font-semibold text-[var(--ink)] truncate">{airData.temperature}°C</div>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-[var(--mut)] uppercase font-medium">Humidity</div>
                  <div className="text-xs font-semibold text-[var(--ink)] truncate">{airData.humidity}%</div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-[10px] bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[var(--mut)] min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">Filtered Indoor PM2.5: <strong className="text-[var(--ink)] font-semibold">{airData.indoorPm25} µg/m³</strong></span>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                {airData.indoorCategory || 'Clean'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pollutant Sub-metrics */}
      <div>
        <div className={cn(
          "grid gap-3 pt-4 border-t border-[var(--line)]",
          extended ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-4"
        )}>
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

          {extended && (
            <>
              <div className="flex flex-col">
                <div className="text-[11px] text-[var(--mut)]">SO₂</div>
                <div className="font-display text-base font-medium text-[var(--ink)] mt-0.5">
                  {airData.so2 || Math.round(airData.aqi * 0.08)} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">µg/m³</span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-[11px] text-[var(--mut)]">CO</div>
                <div className="font-display text-base font-medium text-[var(--ink)] mt-0.5">
                  {airData.co || +(airData.aqi * 0.005).toFixed(1)} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">mg/m³</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-3 flex items-center justify-between text-[10px] text-[var(--mut)]">
          <span className="flex items-center gap-1">
            <span>Continuous station feed</span>
            {airData.provider === 'waqi' && (
              <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                CPCB / WAQI
              </span>
            )}
          </span>
          <span className="font-mono">{airData.updatedAt ? `Updated ${airData.updatedAt}` : 'Live Telemetry'}</span>
        </div>
      </div>
    </div>
  );
};
