import React from 'react';
import { Bot, ArrowRight, Activity, ShieldCheck, AlertCircle, Home, Footprints, Bike, Sparkles } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';

interface AIRecommendationCardProps {
  onAskAirGuard: () => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ onAskAirGuard }) => {
  const { airData, userProfile } = useAirGuard();

  const isHigh = airData.aqi > 200;

  const activities = [
    {
      name: 'Running',
      icon: '🏃',
      status: isHigh ? 'Avoid now' : 'Permissible',
      color: isHigh ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'Walking',
      icon: '🚶',
      status: isHigh ? 'Prefer low-traffic route' : 'Good with mask',
      color: isHigh ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'Cycling',
      icon: '🚲',
      status: isHigh ? 'Not recommended' : 'Acceptable',
      color: isHigh ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      name: 'Indoor',
      icon: '🏠',
      status: 'Better option',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-navy-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              AirGuard Recommendation
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            Realtime AI
          </span>
        </div>

        {/* Primary Advice */}
        <div className="my-3.5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            {isHigh ? (
              <>
                <strong className="text-rose-400">Pollution levels are currently high ({airData.aqi} AQI).</strong> Avoid strenuous outdoor cardio exercise right now to safeguard respiratory health.
              </>
            ) : (
              <>
                <strong className="text-emerald-400">Air quality is manageable today ({airData.aqi} AQI).</strong> Outdoor routine is clear; consider keeping transits outside of the afternoon rush.
              </>
            )}
          </p>
        </div>

        {/* Activity Quick Status Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {activities.map((act) => (
            <div
              key={act.name}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl p-2.5 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{act.icon}</span>
                <span className="text-xs font-semibold text-slate-300">{act.name}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${act.color}`}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Personalized for {userProfile.name} ({userProfile.age}y, {userProfile.healthConditions[0]})
        </span>
        <button
          onClick={onAskAirGuard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
        >
          <span>Ask AirGuard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
