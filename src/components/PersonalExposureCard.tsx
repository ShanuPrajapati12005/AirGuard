import React from 'react';
import { ShieldAlert, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Button } from '@/components/ui/button';

interface PersonalExposureCardProps {
  onViewDetailed: () => void;
}

export const PersonalExposureCard: React.FC<PersonalExposureCardProps> = ({ onViewDetailed }) => {
  const { airData, userProfile } = useAirGuard();

  // Dynamic calculation based on AQI and profile
  const exposureScore = Math.min(Math.round((airData.aqi / 300) * 65 + (userProfile.age > 60 || userProfile.healthConditions.includes('Mild Asthma') ? 12 : 5)), 98);
  const isHigh = exposureScore > 65;

  // Circular progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * exposureScore) / 100;

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="font-display text-base font-medium text-[var(--ink)] tracking-tight">Personal Exposure</h3>
          <span className="text-[11px] font-normal text-[var(--mut)]">Inhalation Intake Score</span>
        </div>
        <div className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border shadow-2xs ${
          isHigh
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            : 'bg-[var(--ac2)]/10 border-[var(--ac2)]/30 text-[var(--ac2)]'
        }`}>
          {isHigh ? 'High Risk' : 'Moderate'}
        </div>
      </div>

      {/* Main Score + Circular Dial */}
      <div className="py-2 flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium text-[var(--mut)] uppercase tracking-wider mb-0.5">Exposure Score</div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-6xl sm:text-7xl font-normal text-[var(--ink)] tracking-tight">{exposureScore}</span>
            <span className="font-display text-xl font-normal text-[var(--mut)]">/ 100</span>
          </div>
          <p className="text-xs text-[var(--mut)] mt-1.5 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--mut)] shrink-0" />
            <span>Exposure is <strong className="text-[var(--ink)] font-medium">18% elevated</strong> vs baseline.</span>
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
              stroke="var(--line)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={isHigh ? '#e11d48' : 'var(--ac2)'}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <ShieldAlert className={`w-5 h-5 ${isHigh ? 'text-rose-600' : 'text-[var(--ac2)]'}`} />
          </div>
        </div>
      </div>

      {/* Exposure breakdown metrics */}
      <div className="grid grid-cols-4 gap-2.5 pt-5 mt-auto border-t border-[var(--line)] text-left">
        <div className="flex flex-col">
          <span className="text-[11px] text-[var(--mut)]">Time</span>
          <span className="font-display text-base font-medium text-[var(--ink)] mt-0.5">2h<span className="font-sans text-[10px] font-normal text-[var(--mut)] ml-0.5">45m</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-rose-600">High</span>
          <span className="font-display text-base font-medium text-rose-700 mt-0.5">48<span className="font-sans text-[10px] font-normal text-rose-500 ml-0.5">m</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[var(--ac2)]">Mod</span>
          <span className="font-display text-base font-medium text-[var(--ac2)] mt-0.5">1h<span className="font-sans text-[10px] font-normal text-[var(--mut)] ml-0.5">17m</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[var(--ok)]">Low</span>
          <span className="font-display text-base font-medium text-[var(--ok)] mt-0.5">40<span className="font-sans text-[10px] font-normal text-[var(--mut)] ml-0.5">m</span></span>
        </div>
      </div>

      {/* Action link */}
      <div className="pt-2 flex justify-end">
        <Button
          variant="link"
          size="sm"
          onClick={onViewDetailed}
          className="text-[11px] font-medium text-[var(--ac)] hover:underline px-0 h-auto"
        >
          Detailed analysis <ArrowUpRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
