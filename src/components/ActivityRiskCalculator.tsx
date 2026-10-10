import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { calculateExposureScore } from '../utils/aqiCalculator';
import { Card } from '@/components/ui/card';
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
    <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200/60 shadow-none">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight">Activity Risk Calculator</h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium tracking-tight">
            How risky is your activity under current ambient conditions?
          </p>
        </div>
        <Badge variant="outline" className="text-[9px] font-medium uppercase tracking-widest text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-sm border-zinc-200/60 shadow-none">
          Demo Model
        </Badge>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
        {/* Activity selection */}
        <div>
          <label className="text-[11px] font-medium text-zinc-500 mb-2 block tracking-tight">
            Physical Activity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {activities.map((act) => (
              <button
                key={act}
                onClick={() => setSelectedActivity(act)}
                className={cn(
                  "py-2 px-2.5 rounded-lg text-[11px] font-medium transition-all border cursor-pointer shadow-none tracking-tight",
                  selectedActivity === act
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200/60 hover:bg-zinc-100"
                )}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Duration selection */}
        <div>
          <label className="text-[11px] font-medium text-zinc-500 mb-2 block tracking-tight">
            Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={cn(
                  "py-2 px-2 rounded-lg text-[11px] font-medium transition-all border cursor-pointer shadow-none tracking-tight",
                  selectedDuration === dur
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200/60 hover:bg-zinc-100"
                )}
              >
                {dur >= 60 ? `${dur / 60}h` : `${dur}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exposure Score Result Bar */}
      <div className="bg-zinc-50/50 rounded-xl p-4 border border-zinc-200/60 mt-2 shadow-none">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest block">
              Estimated Exposure
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold text-zinc-900 tracking-tight">{result.score}%</span>
              <Badge
                variant="outline"
                className="text-[9px] font-semibold uppercase px-2 py-0.5 border shadow-none"
                style={{ backgroundColor: `${result.color}10`, color: result.color, borderColor: `${result.color}40` }}
              >
                {result.level} RISK
              </Badge>
            </div>
          </div>
          <div className="text-right text-[11px] text-zinc-500 font-medium bg-white p-2 rounded-lg border border-zinc-200/60 shadow-none tracking-tight">
            <div className="mb-0.5">Current AQI: <strong className="text-zinc-800">{airData.aqi}</strong></div>
            <div>Sensitivity: <strong className="text-zinc-800 capitalize">{userProfile.sensitivityLevel}</strong></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-200/60 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${result.score}%`, backgroundColor: result.color }}
          />
        </div>

        {/* Simulation Context Advice */}
        <p className="text-[11px] font-medium text-zinc-500 mt-4 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-zinc-100 tracking-tight">
          {selectedActivity === 'Running' || selectedActivity === 'Outdoor Sports' ? (
            <>
              Running or playing sports for {selectedDuration} minutes in current conditions results in
              <strong className="text-rose-600 font-semibold"> significantly higher particulate ventilation</strong> than a relaxed 20-minute walk.
            </>
          ) : (
            <>
              {selectedActivity} for {selectedDuration} minutes has an estimated exposure factor of {result.score}%.
              Consider wearing a well-fitted N95 mask if outdoors near traffic corridors.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
