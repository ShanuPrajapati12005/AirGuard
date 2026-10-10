import React, { useState } from 'react';
import { Calculator, ShieldAlert, Sparkles, Activity, Clock, AlertTriangle } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { calculateExposureScore } from '../utils/aqiCalculator';

export const ActivityRiskCalculator: React.FC = () => {
  const { airData, userProfile } = useAirGuard();

  const activities = ['Walking', 'Running', 'Cycling', 'Outdoor Sports', 'Commuting', 'Sitting'];
  const durations = [15, 30, 60, 120];

  const [selectedActivity, setSelectedActivity] = useState<string>('Running');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);

  const result = calculateExposureScore(airData.aqi, selectedDuration, selectedActivity, userProfile);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Activity Risk Calculator</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            How risky is your activity under current ambient conditions?
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          AirGuard Demo Exposure Model
        </span>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Activity selection */}
        <div>
          <label className="text-xs font-bold text-slate-600 mb-2 block">
            Select Physical Activity:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {activities.map((act) => (
              <button
                key={act}
                onClick={() => setSelectedActivity(act)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedActivity === act
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Duration selection */}
        <div>
          <label className="text-xs font-bold text-slate-600 mb-2 block">
            Select Duration:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedDuration === dur
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {dur >= 60 ? `${dur / 60} hour${dur > 60 ? 's' : ''}` : `${dur} min`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exposure Score Result Bar */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimated Exposure
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{result.score}%</span>
              <span
                className="text-xs font-black uppercase px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${result.color}20`, color: result.color }}
              >
                {result.level} RISK
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Current AQI: <strong className="text-slate-800">{airData.aqi}</strong></div>
            <div>User Sensitivity: <strong className="text-slate-800 capitalize">{userProfile.sensitivityLevel}</strong></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${result.score}%`, backgroundColor: result.color }}
          />
        </div>

        {/* Simulation Context Advice */}
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          {selectedActivity === 'Running' || selectedActivity === 'Outdoor Sports' ? (
            <>
              Running or playing sports for {selectedDuration} minutes in current conditions results in
              <strong className="text-rose-600"> significantly higher particulate ventilation</strong> than a relaxed 20-minute walk.
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
