import React from 'react';
import {
  RefreshCw,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
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
  const { theme, toggleTheme } = useTheme();

  const scenarios: { key: ScenarioType; label: string; icon: string }[] = [
    { key: 'normal', label: 'Normal Ambient Air', icon: 'ðŸŒ¿' },
    { key: 'high_pollution', label: 'Winter Smog Alert', icon: 'âš ï¸' },
    { key: 'rush_hour', label: 'Peak Highway Traffic', icon: 'ðŸš—' },
    { key: 'school_alert', label: 'Campus Safety Warning', icon: 'ðŸ«' },
    { key: 'industrial_plume', label: 'Industrial Plume Spike', icon: 'ðŸ­' },
  ];

  return (
    <header className="bg-[var(--card)]/85 backdrop-blur-md border-b border-[var(--line)] sticky top-0 z-20 px-6 py-3.5 shadow-[var(--sh)] flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Greeting & Location */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-medium text-[var(--ink)] tracking-tight">
              Good afternoon, {userProfile.name}
            </h2>
            <Badge variant="accent" className="gap-1.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] animate-pulse"></span>
              Live Telemetry
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--mut)] mt-1">
            <button
              onClick={onOpenLocation}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--ink)] hover:text-[var(--ac)] bg-[var(--bg)] hover:bg-[var(--card)] px-2.5 py-1 rounded-[8px] transition-all border border-[var(--line)] cursor-pointer group shadow-2xs"
              title="Click to change location"
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--mut)] group-hover:text-[var(--ac)] transition-colors" />
              <span className="max-w-[280px] truncate">{airData.locationName}</span>
              <span className="text-[9px] text-[var(--mut)] uppercase font-semibold tracking-wide ml-1 bg-[var(--card)] px-1.5 py-0.2 rounded border border-[var(--line)] hidden sm:inline-block">
                Change
              </span>
            </button>
            <span className="text-[var(--line)]">â€¢</span>
            <span className="text-[11px] text-[var(--mut)]">Synced {airData.updatedAt}</span>
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={refreshAirData}
          disabled={isRefreshing}
          className="h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px]"
          title="Refresh live atmospheric readings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--ac)]' : ''}`} />
        </Button>
      </div>

      {/* Right: Atmospheric Conditions & User Profile */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Scenario / Condition Profile */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[var(--mut)] font-medium uppercase">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Atmospheric Mode:
          </div>
          <Select value={scenario} onValueChange={(val) => setScenario(val as ScenarioType)}>
            <SelectTrigger className="w-[195px] h-8 text-[12px] font-medium bg-[var(--bg)] border-[var(--line)] rounded-[8px] shadow-2xs">
              <SelectValue placeholder="Select Scenario" />
            </SelectTrigger>
            <SelectContent className="border-[var(--line)] bg-[var(--card)] shadow-md rounded-[9px]">
              {scenarios.map((sc) => (
                <SelectItem key={sc.key} value={sc.key} className="text-xs font-medium cursor-pointer">
                  <span className="mr-2">{sc.icon}</span>
                  {sc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

                {/* Dark/Light Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px]"
          title="Toggle Warm / Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[var(--ac2)]" /> : <Moon className="w-3.5 h-3.5 text-[var(--ink)]" />}
        </Button>

        {/* Profile Pill */}
        <Button
          variant="outline"
          onClick={onOpenSettings}
          className="flex items-center gap-2 h-8 pl-1 pr-3 rounded-full border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] shadow-2xs"
          title="Open Profile & API Settings"
        >
          <div className="w-6 h-6 rounded-full bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center text-[10px] font-semibold">
            {userProfile.name[0]}
          </div>
          <span className="text-[12px] font-medium">{userProfile.name}</span>
        </Button>
      </div>
    </header>
  );
};

