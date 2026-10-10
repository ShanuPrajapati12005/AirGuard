import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Radio, Wifi, WifiOff, Cpu } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { validateSensorReading } from '../utils/telemetryValidator';
import { ShieldCheck } from 'lucide-react';

export const LiveSensorMonitor: React.FC = () => {
  const { sensor, connectSensor, airData } = useAirGuard();
  const anomalies = validateSensorReading(sensor);

  return (
    <div className="card card-3d p-5 border border-[var(--line)] shadow-[var(--sh-3d)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="font-display text-sm font-medium text-[var(--ink)] tracking-tight">
              Hardware Sensor Node
            </h3>
          </div>
          <p className="text-[11px] text-[var(--mut)] mt-1 font-normal">
            Realtime IoT telemetry stream via ESP32 interface
          </p>
        </div>

        {/* Connect / Toggle sensor button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={connectSensor}
            className={cn(
              "h-7 px-3 rounded-[8px] text-[11px] font-medium transition-all shadow-2xs",
              sensor.isOnline
                ? "bg-[var(--card)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--bg)]"
                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
            )}
            variant="outline"
          >
            {sensor.isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-[var(--ok)] mr-1.5" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-600 mr-1.5" />
                Disconnected
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Hardware Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-4">
        {/* PM2.5 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--mut)] font-medium uppercase tracking-wider">
            <span>PM2.5 INDOOR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse"></span>
          </div>
          <div className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5">
            {sensor.pm25} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">Âµg/mÂ³</span>
          </div>
        </div>

        {/* PM10 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--mut)] font-medium uppercase tracking-wider">
            <span>PM10</span>
          </div>
          <div className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5">
            {sensor.pm10} <span className="font-sans text-[10px] font-normal text-[var(--mut)]">Âµg/mÂ³</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--mut)] font-medium uppercase tracking-wider">
            <span>TEMP</span>
          </div>
          <div className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5">
            {sensor.temperature}Â°C
          </div>
        </div>

        {/* Humidity */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--mut)] font-medium uppercase tracking-wider">
            <span>HUMIDITY</span>
          </div>
          <div className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5">
            {sensor.humidity}%
          </div>
        </div>
      </div>

      {/* Live Stream Chart */}
      <div className="mt-2 card bg-[var(--ink)] rounded-[12px] p-4 text-[var(--onac)] border border-[var(--ink)] relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[var(--ac)]" />
            <span className="font-medium text-xs text-white/90">Real-time Telemetry Stream</span>
          </div>
          <div className="text-[10px] text-white/70 flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-ping"></span>
            <span>{sensor.lastUpdatedSecondsAgo}s ago</span>
          </div>
        </div>

        <div className="h-44 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensor.history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} tickMargin={8} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} tickMargin={8} domain={[20, 160]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a18', borderColor: '#2b2a27', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ fontWeight: '500' }}
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="var(--ac)"
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }}
                name="Indoor PM2.5"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={1.2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#aaa' }}
                name="Indoor PM10"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indoor vs Outdoor Comparison Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-[var(--line)]">
        <div className="card p-3 bg-[var(--bg)] border border-[var(--line)]">
          <div className="text-[10px] text-[var(--mut)] mb-1 flex items-center justify-between uppercase tracking-wider">
            <span>INDOOR TELEMETRY</span>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.2">MODERATE</Badge>
          </div>
          <div className="font-display text-lg font-medium text-[var(--ink)]">
            PM2.5: {sensor.pm25} <span className="font-sans text-[10px] text-[var(--mut)]">Âµg/mÂ³</span>
          </div>
          <p className="text-[11px] text-[var(--mut)] mt-0.5">HEPA purifier active in bedroom</p>
        </div>

        <div className="card p-3 bg-[var(--bg)] border border-[var(--line)]">
          <div className="text-[10px] text-[var(--mut)] mb-1 flex items-center justify-between uppercase tracking-wider">
            <span>OUTDOOR TELEMETRY</span>
            <Badge variant="destructive" className="text-[9px] px-1.5 py-0.2">HIGH</Badge>
          </div>
          <div className="font-display text-lg font-medium text-[var(--ink)]">
            PM2.5: {airData.pm25} <span className="font-sans text-[10px] text-[var(--mut)]">Âµg/mÂ³</span>
          </div>
          <p className="text-[11px] text-[var(--mut)] mt-0.5">
            Outdoor air is {Math.round((airData.pm25 / Math.max(sensor.pm25, 1)) * 100 - 100)}% dirtier
          </p>
        </div>
      </div>
    </div>
  );
};

