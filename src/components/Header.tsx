import React from 'react';
import {
  RefreshCw,
  MapPin,
  SlidersHorizontal,
  Menu,
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
  onGoToLanding?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenLocation,
  onGoToLanding,
  onToggleMobileMenu,
}) => {
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
    { key: 'normal', label: 'Normal Ambient Air', icon: '🌱' },
    { key: 'high_pollution', label: 'Winter Smog Alert', icon: '⚠️' },
    { key: 'rush_hour', label: 'Peak Highway Traffic', icon: '🚗' },
    { key: 'school_alert', label: 'Campus Safety Warning', icon: '🏫' },
    { key: 'industrial_plume', label: 'Industrial Plume Spike', icon: '🏭' },
  ];

  return (
    <header className="bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--line)] sticky top-0 z-20 px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-[var(--sh)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 max-w-[1440px] mx-auto">
        {/* Top row on mobile / Left group on desktop */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Menu Hamburger */}
            {onToggleMobileMenu && (
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleMobileMenu}
                className="md:hidden h-8 w-8 shrink-0 text-[var(--ink)] border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--card)] rounded-[8px]"
                title="Open Navigation Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-sm sm:text-lg font-medium text-[var(--ink)] tracking-tight truncate">
                  <span className="hidden xs:inline">Good afternoon, </span>
                  <span className="xs:hidden">Hi, </span>
                  {userProfile.name || 'Friend'}
                </h2>
                <Badge variant="accent" className="gap-1 py-0.5 px-1.5 sm:px-2 shrink-0 text-[10px] sm:text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] animate-pulse"></span>
                  <span className="hidden xs:inline">Live Telemetry</span>
                  <span className="xs:hidden">Live</span>
                </Badge>
              </div>

              {/* Desktop Location strip */}
              <div className="hidden md:flex items-center gap-2 text-xs text-[var(--mut)] mt-1 flex-wrap">
                <button
                  onClick={onOpenLocation}
                  className="inline-flex items-center gap-1.5 font-medium text-[var(--ink)] hover:text-[var(--ac)] bg-[var(--bg)] hover:bg-[var(--card)] px-2.5 py-1 rounded-[8px] transition-all border border-[var(--line)] cursor-pointer group shadow-2xs"
                  title="Click to change location"
                >
                  <MapPin className="w-3.5 h-3.5 text-[var(--mut)] group-hover:text-[var(--ac)] transition-colors" />
                  <span className="max-w-[200px] sm:max-w-[280px] truncate">{airData.locationName}</span>
                  <span className="text-[9px] text-[var(--mut)] uppercase font-semibold tracking-wide ml-1 bg-[var(--card)] px-1.5 py-0.2 rounded border border-[var(--line)] hidden sm:inline-block">
                    Change
                  </span>
                </button>
                <span className="text-[var(--line)]">•</span>
                <span className="text-[11px] text-[var(--mut)]">Synced {airData.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Theme & Profile on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 md:hidden">
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

            {/* Dark/Light Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-[var(--ink)] bg-[var(--card)] hover:bg-[var(--bg)] border-[var(--line)] rounded-[8px] shadow-2xs transition-all"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-[var(--ac2)]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[var(--ink)]" />
              )}
            </Button>

            {/* Profile Avatar Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
              className="h-8 w-8 rounded-full border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] shadow-2xs"
              title="Open Profile & API Settings"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center text-[10px] font-semibold">
                {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
              </div>
            </Button>
          </div>
        </div>

        {/* Desktop Refresh button (placed next to location in desktop view) */}
        <div className="hidden md:flex items-center">
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

        {/* Second row on mobile / Right controls on desktop */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:flex-nowrap">
          {/* Mobile Location Pill */}
          <div className="md:hidden flex-1 min-w-[140px]">
            <button
              onClick={onOpenLocation}
              className="w-full inline-flex items-center justify-between gap-1.5 font-medium text-[var(--ink)] bg-[var(--bg)] hover:bg-[var(--card)] px-2.5 py-1.5 rounded-[8px] transition-all border border-[var(--line)] text-xs shadow-2xs cursor-pointer"
              title="Click to change location"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
                <span className="truncate text-[11px] font-medium">{airData.locationName}</span>
              </div>
              <span className="text-[9px] text-[var(--mut)] uppercase font-semibold bg-[var(--card)] px-1.5 py-0.2 rounded border border-[var(--line)] shrink-0">
                Change
              </span>
            </button>
          </div>

          {/* Landing Page Link */}
          {onGoToLanding && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGoToLanding}
              className="h-8 px-2.5 text-xs text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px] border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] shrink-0"
              title="Return to Landing Page"
            >
              Landing
            </Button>
          )}

          {/* Scenario / Condition Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 md:flex-initial min-w-[150px]">
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[var(--mut)] font-medium uppercase shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Atmosphere:
            </div>
            <Select value={scenario} onValueChange={(val) => setScenario(val as ScenarioType)}>
              <SelectTrigger className="w-full md:w-[180px] lg:w-[195px] h-8 text-[11px] sm:text-[12px] font-medium bg-[var(--bg)] border-[var(--line)] rounded-[8px] shadow-2xs">
                <SelectValue placeholder="Select Scenario" />
              </SelectTrigger>
              <SelectContent className="border-[var(--line)] bg-[var(--card)] shadow-md rounded-[9px] z-50">
                {scenarios.map((sc) => (
                  <SelectItem key={sc.key} value={sc.key} className="text-xs font-medium cursor-pointer">
                    <span className="mr-2">{sc.icon}</span>
                    {sc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden md:flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-8 px-2.5 gap-1.5 text-xs text-[var(--ink)] bg-[var(--card)] hover:bg-[var(--bg)] border-[var(--line)] rounded-[8px] shadow-2xs transition-all shrink-0"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--ac2)]" />
                  <span className="hidden sm:inline text-[11px] font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--ink)]" />
                  <span className="hidden sm:inline text-[11px] font-medium">Dark</span>
                </>
              )}
            </Button>
          </div>

          {/* Desktop Profile Pill */}
          <div className="hidden md:flex items-center">
            <Button
              variant="outline"
              onClick={onOpenSettings}
              className="flex items-center gap-2 h-8 pl-1 pr-3 rounded-full border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] shadow-2xs shrink-0"
              title="Open Profile & API Settings"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center text-[10px] font-semibold">
                {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-[12px] font-medium truncate max-w-[100px]">{userProfile.name || 'Profile'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

