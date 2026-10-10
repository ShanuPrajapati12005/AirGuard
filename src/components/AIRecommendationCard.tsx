import React from 'react';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
      color: isHigh ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
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
      color: isHigh ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      name: 'Indoor',
      icon: '🏠',
      status: 'Better option',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold',
    },
  ];

  return (
    <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden h-full">

      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-semibold tracking-tight text-zinc-900 flex items-center gap-1.5">
              AirGuard Recommendation
            </h3>
          </div>
          <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-widest bg-zinc-50 px-2 py-0.5 rounded-sm text-zinc-500 border-zinc-200/60 shadow-none">
            Realtime AI
          </Badge>
        </div>

        {/* Primary Advice */}
        <div className="my-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-200/60 shadow-none">
          <p className="text-[13px] font-medium text-zinc-700 leading-relaxed tracking-tight">
            {isHigh ? (
              <>
                <strong className="text-zinc-900 font-semibold">Pollution levels are currently high ({airData.aqi} AQI).</strong> Avoid strenuous outdoor cardio exercise right now to safeguard respiratory health.
              </>
            ) : (
              <>
                <strong className="text-zinc-900 font-semibold">Air quality is manageable today ({airData.aqi} AQI).</strong> Outdoor routine is clear; consider keeping transits outside of the afternoon rush.
              </>
            )}
          </p>
        </div>

        {/* Activity Quick Status Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2 relative z-10">
          {activities.map((act) => (
            <div
              key={act.name}
              className="bg-white hover:bg-zinc-50 border border-zinc-200/60 rounded-lg p-2.5 flex items-center justify-between transition-colors shadow-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px]">{act.icon}</span>
                <span className="text-[11px] font-medium text-zinc-700 tracking-tight">{act.name}</span>
              </div>
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-sm border ${act.color}`}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between relative z-10">
        <span className="text-[10px] font-medium text-zinc-400 tracking-tight">
          Personalized for {userProfile.name} ({userProfile.age}y, {userProfile.healthConditions[0]})
        </span>
        <Button
          onClick={onAskAirGuard}
          variant="outline"
          className="border-zinc-200/60 text-zinc-700 font-medium text-[11px] shadow-none hover:bg-zinc-50 transition-all rounded-md h-7 px-2.5"
        >
          Ask AirGuard
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
