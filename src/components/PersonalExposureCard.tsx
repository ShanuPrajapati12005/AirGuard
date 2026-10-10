import React from 'react';
import { ShieldAlert, ArrowUpRight, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PersonalExposureCardProps {
  onViewDetailed: () => void;
}

export const PersonalExposureCard: React.FC<PersonalExposureCardProps> = ({ onViewDetailed }) => {
  const { airData, userProfile } = useAirGuard();

  // Dynamic calculation based on AQI and profile
  const exposureScore = Math.min(Math.round((airData.aqi / 300) * 65 + (userProfile.age > 60 || userProfile.healthConditions.includes('Mild Asthma') ? 12 : 5)), 98);
  const isHigh = exposureScore > 65;

  // Pie / Circular progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * exposureScore) / 100;

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Personal Exposure</h3>
          <span className="text-[11px] font-medium text-zinc-500">Intake & Risk Score</span>
        </div>
        <div className={`text-[11px] font-medium px-2 py-1 rounded-md ${
          isHigh ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {isHigh ? 'High Risk' : 'Moderate'}
        </div>
      </div>

      {/* Main Score + Circular Dial */}
      <div className="py-2 flex items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-medium text-zinc-400 tracking-tight mb-0.5">Exposure Score</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-6xl sm:text-7xl font-bold text-zinc-900 tracking-tighter">{exposureScore}</span>
            <span className="text-xl font-semibold text-zinc-300">/ 100</span>
          </div>
          <p className="text-[12px] font-medium text-zinc-500 mt-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Exposure is <strong className="text-zinc-700">18% higher</strong> than yesterday.</span>
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f4f4f5"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={isHigh ? '#f43f5e' : '#f59e0b'}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <ShieldAlert className={`w-6 h-6 ${isHigh ? 'text-rose-500' : 'text-amber-500'}`} />
          </div>
        </div>
      </div>

      {/* Exposure breakdown metrics */}
      <div className="grid grid-cols-4 gap-2.5 pt-6 mt-auto text-left">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-zinc-500 tracking-tight">Time</span>
          <span className="text-lg font-semibold text-zinc-900 tracking-tight -mt-0.5">2h<span className="text-[10px] font-normal text-zinc-400 ml-0.5">45m</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-rose-500 tracking-tight">High</span>
          <span className="text-lg font-semibold text-rose-600 tracking-tight -mt-0.5">48<span className="text-[10px] font-normal text-rose-400/80 ml-0.5">m</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-amber-500 tracking-tight">Mod</span>
          <span className="text-lg font-semibold text-amber-600 tracking-tight -mt-0.5">1h<span className="text-[10px] font-normal text-amber-400/80 ml-0.5">17m</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-emerald-500 tracking-tight">Low</span>
          <span className="text-lg font-semibold text-emerald-600 tracking-tight -mt-0.5">40<span className="text-[10px] font-normal text-emerald-400/80 ml-0.5">m</span></span>
        </div>
      </div>

      {/* Action link */}
      <div className="pt-2 flex justify-end">
        <Button
          variant="link"
          size="sm"
          onClick={onViewDetailed}
          className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 px-0 h-auto"
        >
          Detailed analysis <ArrowUpRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
