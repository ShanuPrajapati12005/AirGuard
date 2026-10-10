import React from 'react';
import {
  RefreshCw,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { ScenarioType } from '../types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenLocation }) => {
  const {
    airData,
    scenario,
    setScenario,
    refreshAirData,
    isRefreshing,
    userProfile,
  } = useAirGuard();

  const scenarios: { key: ScenarioType; label: string; icon: string }[] = [
    { key: 'normal', label: 'Normal Ambient Air', icon: '🌿' },
    { key: 'high_pollution', label: 'Winter Smog Alert', icon: '⚠️' },
    { key: 'rush_hour', label: 'Peak Highway Traffic', icon: '🚗' },
    { key: 'school_alert', label: 'Campus Safety Warning', icon: '🏫' },
    { key: 'industrial_plume', label: 'Industrial Plume Spike', icon: '🏭' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-20 px-6 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Greeting & Location */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              Good afternoon, {userProfile.name}
            </h2>
            <Badge variant="secondary" className="bg-zinc-100/50 text-zinc-600 border-zinc-200/50 gap-1.5 px-2 py-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse-subtle"></span>
              Live Telemetry
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mt-1 tracking-tight">
            <button
              onClick={onOpenLocation}
              className="inline-flex items-center gap-1.5 font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100/50 hover:bg-zinc-100 px-2 py-1 rounded-md transition-all border border-zinc-200/50 cursor-pointer group"
              title="Click to change location"
            >
              <MapPin className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
              <span className="max-w-[280px] truncate">{airData.locationName}</span>
              <span className="text-[9px] text-zinc-500 uppercase font-semibold tracking-wide ml-1 bg-zinc-200/50 px-1.5 rounded-sm hidden sm:inline-block">
                Change
              </span>
            </button>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-400">Updated {airData.updatedAt}</span>
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={refreshAirData}
          disabled={isRefreshing}
          className="h-8 w-8 text-zinc-500 hover:text-zinc-900 border-zinc-200/50 bg-white shadow-none"
          title="Refresh live atmospheric readings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-zinc-900' : ''}`} />
        </Button>
      </div>

      {/* Right: Atmospheric Conditions & User Profile */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Scenario / Condition Profile */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium tracking-tight uppercase">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Atmospheric Filter:
          </div>
          <Select value={scenario} onValueChange={(val) => setScenario(val as ScenarioType)}>
            <SelectTrigger className="w-[200px] h-8 text-[12px] font-medium bg-zinc-50 border-zinc-200/50 shadow-none focus:ring-1 focus:ring-zinc-900/10 transition-all rounded-md">
              <SelectValue placeholder="Select Scenario" />
            </SelectTrigger>
            <SelectContent className="border-zinc-200 shadow-sm rounded-lg">
              {scenarios.map((sc) => (
                <SelectItem key={sc.key} value={sc.key} className="text-xs font-medium cursor-pointer">
                  <span className="mr-2">{sc.icon}</span>
                  {sc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Profile Pill */}
        <Button
          variant="outline"
          onClick={onOpenSettings}
          className="flex items-center gap-2 h-8 pl-1 pr-3 bg-white border-zinc-200/50 hover:bg-zinc-50 text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-full transition-all"
          title="Open Profile & API Settings"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-semibold">
            {userProfile.name[0]}
          </div>
          <div className="flex flex-col items-start leading-none gap-0.5">
            <span className="text-[12px] font-medium tracking-tight">{userProfile.name}</span>
          </div>
        </Button>
      </div>
    </header>
  );
};
