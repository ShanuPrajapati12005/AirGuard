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

export const LiveSensorMonitor: React.FC = () => {
  const { sensor, connectSensor, airData } = useAirGuard();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              AirGuard Sensor (Simulated Hardware)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime IoT telemetry stream via ESP32 + Plantower PMS5003 laser sensor
          </p>
        </div>

        {/* Connect / Toggle sensor button */}
        <div className="flex items-center gap-2">
          <button
            onClick={connectSensor}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              sensor.isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
            }`}
          >
            {sensor.isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Disconnected</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hardware Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {/* PM2.5 */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>PM2.5 INDOOR</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {sensor.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-600">Laser Scattering</span>
        </div>

        {/* PM10 */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>PM10</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {sensor.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">Coarse Aerosols</span>
        </div>

        {/* Temperature */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>TEMPERATURE</span>
            <Thermometer className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {sensor.temperature}°C
          </div>
          <span className="text-[10px] font-semibold text-slate-500">DHT22 Ambient</span>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>HUMIDITY</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {sensor.humidity}%
          </div>
          <span className="text-[10px] font-semibold text-slate-500">Relative RH</span>
        </div>
      </div>

      {/* Live Stream Chart */}
      <div className="mt-2 bg-slate-900 rounded-xl p-4 border border-slate-800 text-white">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Real-time Particulate Stream</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Last data received: {sensor.lastUpdatedSecondsAgo}s ago</span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensor.history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[20, 160]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px' }}
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Indoor PM2.5"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={{ r: 2 }}
                name="Indoor PM10"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indoor vs Outdoor Comparison Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
          <div className="text-xs font-bold text-amber-800 mb-1 flex items-center justify-between">
            <span>INDOOR READING</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/80 font-extrabold">MODERATE</span>
          </div>
          <div className="text-lg font-black text-amber-950">
            PM2.5: {sensor.pm25} µg/m³
          </div>
          <p className="text-[11px] text-amber-700 mt-0.5">HEPA purifier active in bedroom</p>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60">
          <div className="text-xs font-bold text-rose-800 mb-1 flex items-center justify-between">
            <span>OUTDOOR READING</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-200/80 font-extrabold">HIGH</span>
          </div>
          <div className="text-lg font-black text-rose-950">
            PM2.5: {airData.pm25} µg/m³
          </div>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Current outdoor air is {Math.round((airData.pm25 / Math.max(sensor.pm25, 1)) * 100 - 100)}% dirtier than indoors
          </p>
        </div>
      </div>
    </div>
  );
};
