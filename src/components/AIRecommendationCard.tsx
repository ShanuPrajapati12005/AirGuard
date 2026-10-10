import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
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
      color: isHigh ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-[var(--ac)] bg-[var(--ac)]/10 border-[var(--ac)]/30',
    },
    {
      name: 'Walking',
      icon: '🚶',
      status: isHigh ? 'Mask advised' : 'Good with mask',
      color: isHigh ? 'text-[var(--ac2)] bg-[var(--ac2)]/10 border-[var(--ac2)]/30' : 'text-[var(--ac)] bg-[var(--ac)]/10 border-[var(--ac)]/30',
    },
    {
      name: 'Cycling',
      icon: '🚲',
      status: isHigh ? 'Not recommended' : 'Acceptable',
      color: isHigh ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-[var(--ac2)] bg-[var(--ac2)]/10 border-[var(--ac2)]/30',
    },
    {
      name: 'Indoor',
      icon: '🏠',
      status: 'Optimal',
      color: 'text-[var(--ok)] bg-[var(--ok)]/10 border-[var(--ok)]/30 font-semibold',
    },
  ];

  return (
    <div className="card p-5 border border-[var(--line)] shadow-[var(--sh)] flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="font-display text-sm font-medium tracking-tight text-[var(--ink)]">
              AI Guardian Guidance
            </h3>
          </div>
          <Badge variant="accent" className="text-[10px] uppercase font-semibold">
            Realtime AI
          </Badge>
        </div>

        {/* Primary Advice */}
        <div className="my-3.5 p-3.5 rounded-[9px] bg-[var(--bg)] border border-[var(--line)]">
          <p className="text-xs text-[var(--ink)] leading-relaxed">
            {isHigh ? (
              <>
                <strong className="font-semibold text-[var(--ink)]">Atmospheric toxicity elevated ({airData.aqi} AQI).</strong> Postpone intensive outdoor cardio to prevent particulate alveolar penetration.
              </>
            ) : (
              <>
                <strong className="font-semibold text-[var(--ink)]">Air conditions stable ({airData.aqi} AQI).</strong> Outdoor schedule is clear; keep travel transits outside peak corridor hours.
              </>
            )}
          </p>
        </div>

        {/* Activity Quick Status Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {activities.map((act) => (
            <div
              key={act.name}
              className="card p-2 bg-[var(--card)] hover:border-[var(--ac)]/40 flex items-center justify-between transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{act.icon}</span>
                <span className="text-xs font-medium text-[var(--ink)]">{act.name}</span>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${act.color}`}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-[var(--line)] flex items-center justify-between">
        <span className="text-[11px] text-[var(--mut)]">
          Profile: {userProfile.name} ({userProfile.age}y, {userProfile.healthConditions[0]})
        </span>
        <Button
          onClick={onAskAirGuard}
          variant="outline"
          size="sm"
          className="text-xs h-7 px-3 rounded-[8px]"
        >
          Ask Guardian
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
