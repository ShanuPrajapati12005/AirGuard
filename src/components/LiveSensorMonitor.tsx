import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Radio, Wifi, WifiOff, Thermometer, Droplets, BatteryCharging, RefreshCw, Cpu } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const LiveSensorMonitor: React.FC = () => {
  const { sensor, connectSensor, airData } = useAirGuard();

  return (
    <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200/60 shadow-none">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight">
              AirGuard Sensor <span className="font-medium text-zinc-400 text-sm ml-1">(Hardware)</span>
            </h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium tracking-tight">
            Realtime IoT telemetry stream via ESP32
          </p>
        </div>

        {/* Connect / Toggle sensor button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={connectSensor}
            className={cn(
              "h-8 px-3 rounded-md text-[11px] font-medium transition-all shadow-none",
              sensor.isOnline
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-transparent"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border-transparent"
            )}
            variant="outline"
          >
            {sensor.isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-zinc-900 mr-1.5" />
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        {/* PM2.5 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">
            <span>PM2.5 INDOOR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tracking-tight">
            {sensor.pm25} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span>
          </div>
        </div>

        {/* PM10 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">
            <span>PM10</span>
          </div>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tracking-tight">
            {sensor.pm10} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">
            <span>TEMP</span>
          </div>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tracking-tight">
            {sensor.temperature}°C
          </div>
        </div>

        {/* Humidity */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">
            <span>HUMIDITY</span>
          </div>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tracking-tight">
            {sensor.humidity}%
          </div>
        </div>
      </div>

      {/* Live Stream Chart */}
      <div className="mt-2 bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-medium text-[11px] text-zinc-100 tracking-tight">Real-time Particulate Stream</span>
          </div>
          <div className="text-[9px] text-zinc-400 flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-sm border border-zinc-700/50 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{sensor.lastUpdatedSecondsAgo}s ago</span>
          </div>
        </div>

        <div className="h-48 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensor.history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="timestamp" stroke="#52525b" fontSize={10} tickLine={false} tickMargin={8} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} tickMargin={8} domain={[20, 160]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.5rem', fontSize: '11px', boxShadow: 'none' }}
                itemStyle={{ fontWeight: '500' }}
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#d4d4d8"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }}
                name="Indoor PM2.5"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#52525b"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#a1a1aa' }}
                name="Indoor PM10"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indoor vs Outdoor Comparison Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-zinc-100">
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 shadow-none">
          <div className="text-[10px] font-medium text-zinc-500 mb-1.5 flex items-center justify-between tracking-tight">
            <span>INDOOR READING</span>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 rounded-sm bg-zinc-100 font-semibold border-zinc-200/60 text-zinc-600 tracking-widest shadow-none">MODERATE</Badge>
          </div>
          <div className="text-xl font-semibold text-zinc-900 tracking-tight">
            PM2.5: {sensor.pm25} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium tracking-tight">HEPA purifier active in bedroom</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-zinc-200/60 shadow-none">
          <div className="text-[10px] font-medium text-zinc-500 mb-1.5 flex items-center justify-between tracking-tight">
            <span>OUTDOOR READING</span>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 rounded-sm bg-zinc-100 font-semibold border-zinc-200/60 text-zinc-600 tracking-widest shadow-none">HIGH</Badge>
          </div>
          <div className="text-xl font-semibold text-zinc-900 tracking-tight">
            PM2.5: {airData.pm25} <span className="text-[10px] font-normal text-zinc-400">µg/m³</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium tracking-tight">
            Outdoor air is {Math.round((airData.pm25 / Math.max(sensor.pm25, 1)) * 100 - 100)}% dirtier
          </p>
        </div>
      </div>
    </div>
  );
};
