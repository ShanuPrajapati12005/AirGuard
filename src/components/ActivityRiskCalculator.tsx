import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { calculateExposureScore } from '../utils/aqiCalculator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const ActivityRiskCalculator: React.FC = () => {
  const { airData, userProfile } = useAirGuard();

  const activities = ['Walking', 'Running', 'Cycling', 'Outdoor Sports', 'Commuting', 'Sitting'];
  const durations = [15, 30, 60, 120];

  const [selectedActivity, setSelectedActivity] = useState<string>('Running');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);

  const result = calculateExposureScore(airData.aqi, selectedDuration, selectedActivity, userProfile);

  return (
    <div className="card card-3d p-3.5 sm:p-5 border border-[var(--line)] shadow-[var(--sh-3d)] h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="font-display text-sm font-medium text-[var(--ink)] tracking-tight">
              Activity Risk Simulator
            </h3>
          </div>
          <p className="text-[11px] text-[var(--mut)] mt-1 font-normal">
            Compute inhalation risk factors based on exercise cadence and duration
          </p>
        </div>
        <Badge variant="accent" className="text-[10px] uppercase font-semibold">
          Model v1.2
        </Badge>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-3 sm:my-4">
        {/* Activity selection */}
        <div>
          <label className="text-[11px] font-medium text-[var(--mut)] mb-1.5 block">
            Physical Exertion Tier
          </label>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5">
            {activities.map((act) => (
              <button
                key={act}
                onClick={() => setSelectedActivity(act)}
                className={cn(
                  "py-1.5 px-1.5 sm:px-2 rounded-[8px] text-[10px] sm:text-[11px] font-medium transition-all border cursor-pointer truncate",
                  selectedActivity === act
                    ? "bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs"
                    : "bg-[var(--bg)] text-[var(--mut)] border-[var(--line)] hover:text-[var(--ink)] hover:border-[var(--mut)]"
                )}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Duration selection */}
        <div>
          <label className="text-[11px] font-medium text-[var(--mut)] mb-1.5 block">
            Exposure Duration
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={cn(
                  "py-1.5 px-1.5 sm:px-2 rounded-[8px] text-[10px] sm:text-[11px] font-medium transition-all border cursor-pointer",
                  selectedDuration === dur
                    ? "bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs font-semibold"
                    : "bg-[var(--bg)] text-[var(--mut)] border-[var(--line)] hover:text-[var(--ink)] hover:border-[var(--mut)]"
                )}
              >
                {dur >= 60 ? `${dur / 60}h` : `${dur}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exposure Score Result Bar */}
      <div className="card p-3.5 sm:p-4 bg-[var(--bg)] border border-[var(--line)]">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 mb-3">
          <div>
            <span className="text-[10px] text-[var(--mut)] uppercase tracking-wider block">
              Calculated Inhalation Load
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-display text-2xl sm:text-3xl font-normal text-[var(--ink)]">{result.score}%</span>
              <span
                className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: `${result.color}15`, color: result.color, borderColor: `${result.color}35` }}
              >
                {result.level} RISK
              </span>
            </div>
          </div>
          <div className="text-left xs:text-right text-[10px] sm:text-[11px] text-[var(--mut)] bg-[var(--card)] p-2 rounded-[8px] border border-[var(--line)] self-stretch xs:self-auto">
            <div>Current AQI: <strong className="text-[var(--ink)]">{airData.aqi}</strong></div>
            <div>Sensitivity: <strong className="text-[var(--ink)] capitalize">{userProfile.sensitivityLevel}</strong></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--line)] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${result.score}%`, backgroundColor: result.color }}
          />
        </div>

        {/* Simulation Context Advice */}
        <p className="text-xs text-[var(--mut)] mt-3 leading-relaxed bg-[var(--card)] p-2.5 rounded-[8px] border border-[var(--line)]">
          {selectedActivity === 'Running' || selectedActivity === 'Outdoor Sports' ? (
            <>
              High minute-ventilation exercise for {selectedDuration} minutes exposes pulmonary alveoli to
              <strong className="text-rose-600 font-medium"> significantly higher particulate inhalation</strong> compared to low-intensity transit.
            </>
          ) : (
            <>
              {selectedActivity} for {selectedDuration} minutes reflects an estimated exposure index of {result.score}%.
              Equip an N95 respirator if traversing congested transit arteries.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
