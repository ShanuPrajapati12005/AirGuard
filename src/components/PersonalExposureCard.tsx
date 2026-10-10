import React from 'react';
import { ShieldAlert, ArrowUpRight, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';

interface PersonalExposureCardProps {
  onViewDetailed: () => void;
}

export const PersonalExposureCard: React.FC<PersonalExposureCardProps> = ({ onViewDetailed }) => {
  const { airData, userProfile } = useAirGuard();

  // Dynamic calculation based on AQI and profile
  const exposureScore = Math.min(Math.round((airData.aqi / 300) * 65 + (userProfile.age > 60 || userProfile.healthConditions.includes('Mild Asthma') ? 12 : 5)), 98);
  const isHigh = exposureScore > 50;

  // Pie / Circular progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * exposureScore) / 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            YOUR EXPOSURE TODAY
          </span>
          <h3 className="text-sm font-semibold text-slate-700">Personal Physiological Intake</h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
          exposureScore > 65 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {exposureScore > 65 ? 'HIGH EXPOSURE' : 'MODERATE EXPOSURE'}
        </span>
      </div>

      {/* Main Score + Circular Dial */}
      <div className="py-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-black text-slate-900 tracking-tight">{exposureScore}</span>
            <span className="text-xl font-bold text-slate-400">/ 100</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider mt-1 text-rose-600">
            {exposureScore > 65 ? 'HIGH EXPOSURE' : 'MODERATE EXPOSURE'}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span>Your exposure is <strong>18% higher</strong> than yesterday.</span>
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={exposureScore > 65 ? '#ef4444' : '#f59e0b'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <ShieldAlert className={`w-6 h-6 ${exposureScore > 65 ? 'text-rose-500' : 'text-amber-500'}`} />
          </div>
        </div>
      </div>

      {/* Exposure breakdown metrics */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
        <div className="bg-slate-50 rounded-xl p-2">
          <span className="text-[10px] font-semibold text-slate-400 block">Outdoor time</span>
          <span className="text-xs font-bold text-slate-800">2h 45m</span>
        </div>
        <div className="bg-rose-50/70 rounded-xl p-2 border border-rose-100">
          <span className="text-[10px] font-semibold text-rose-600 block">High exposure</span>
          <span className="text-xs font-bold text-rose-800">48 min</span>
        </div>
        <div className="bg-amber-50/70 rounded-xl p-2 border border-amber-100">
          <span className="text-[10px] font-semibold text-amber-600 block">Moderate</span>
          <span className="text-xs font-bold text-amber-800">1h 17m</span>
        </div>
        <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100">
          <span className="text-[10px] font-semibold text-emerald-600 block">Low</span>
          <span className="text-xs font-bold text-emerald-800">40 min</span>
        </div>
      </div>

      {/* Action link */}
      <div className="pt-3 flex justify-end">
        <button
          onClick={onViewDetailed}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 hover:underline cursor-pointer"
        >
          View detailed exposure <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
