import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshCw,
  MapPin,
  SlidersHorizontal,
  Menu,
  LogOut,
  Mail,
  User,
  Search,
  Settings,
  Activity,
  Moon,
  Sun,
  FileText,
  Bell,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { useTheme } from '../hooks/useTheme';
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
  onOpenReport?: () => void;
  onOpenNotification?: () => void;
  onGoToLanding?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenLocation,
  onOpenReport,
  onOpenNotification,
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
    sensor,
  } = useAirGuard();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener for instant search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenLocation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenLocation]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  const scenarios: { key: ScenarioType; label: string; icon: string }[] = [
    { key: 'normal', label: 'Normal Ambient Air', icon: '🌱' },
    { key: 'high_pollution', label: 'Winter Smog Alert', icon: '⚠️' },
    { key: 'rush_hour', label: 'Peak Highway Traffic', icon: '🚗' },
    { key: 'school_alert', label: 'Campus Safety Warning', icon: '🏫' },
    { key: 'industrial_plume', label: 'Industrial Plume Spike', icon: '🏭' },
  ];

  const userInitial = userProfile.name ? userProfile.name[0].toUpperCase() : 'U';
  const dummyEmail = userProfile.name
    ? `${userProfile.name.toLowerCase().replace(/\s+/g, '.')}@airguard.app`
    : 'user@airguard.app';

  return (
    <header className="w-full shrink-0 bg-[var(--card)]/90 backdrop-blur-md border border-[var(--line)] rounded-[14px] shadow-[var(--sh-3d)] z-20">
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 w-full">

        {/* ── Left: Hamburger (mobile) + Brand greeting & Location pill ── */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile hamburger */}
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

          {/* User greeting */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm sm:text-base font-medium text-[var(--ink)] tracking-tight truncate">
                <span className="hidden sm:inline">Good afternoon, </span>
                <span className="sm:hidden">Hi, </span>
                {userProfile.name || 'Friend'}
              </h2>
              <Badge variant="accent" className="gap-1 py-0.5 px-1.5 sm:px-2 shrink-0 text-[10px] sm:text-xs hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] animate-pulse" />
                Live
              </Badge>
            </div>

            {/* Location strip — desktop */}
            <button
              onClick={onOpenLocation}
              className="hidden md:inline-flex items-center gap-1.5 mt-0.5 text-[11px] font-medium text-[var(--mut)] hover:text-[var(--ac)] transition-colors group cursor-pointer"
              title="Click to search or change station location"
            >
              <MapPin className="w-3 h-3 group-hover:text-[var(--ac)] transition-colors shrink-0 text-[var(--ac)]" />
              <span className="truncate max-w-[180px] lg:max-w-[220px]">{airData.locationName}</span>
              <span className="text-[9px] text-[var(--mut)] uppercase font-semibold tracking-wide border border-[var(--line)] px-1.5 py-px rounded bg-[var(--bg)] group-hover:border-[var(--ac)]/40">
                Change
              </span>
            </button>
          </div>
        </div>

        {/* ── Center: Real-World Search Omnibar (Station / City search) ── */}
        <div className="hidden md:flex items-center flex-1 max-w-[280px] lg:max-w-[340px] mx-2">
          <button
            type="button"
            onClick={onOpenLocation}
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-[var(--mut)] bg-[var(--bg)] hover:bg-[var(--card)] hover:text-[var(--ink)] border border-[var(--line)] rounded-[8px] transition-all shadow-2xs hover:border-[var(--ac)]/50 group cursor-pointer"
            title="Search stations or worldwide cities (Ctrl + K)"
            aria-label="Search stations or worldwide cities"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-[var(--mut)] group-hover:text-[var(--ac)] transition-colors shrink-0" />
              <span className="truncate text-[11px] lg:text-xs font-normal">Search station, city...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--mut)] bg-[var(--card)] border border-[var(--line)] rounded shadow-2xs shrink-0">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* ── Right Actions: Scenario Selector + Telemetry Status + Tools + Profile ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Icon Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenLocation}
            className="md:hidden h-8 w-8 rounded-[8px] text-[var(--mut)] hover:text-[var(--ink)] border-[var(--line)] bg-[var(--bg)]"
            title="Search station or city"
            aria-label="Search station or city"
          >
            <Search className="w-3.5 h-3.5" />
          </Button>

          {/* Scenario selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden xl:flex items-center gap-1 text-[11px] text-[var(--mut)] font-medium uppercase tracking-wide shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-[var(--ac)]" />
              Scenario:
            </span>
            <Select value={scenario} onValueChange={(val) => setScenario(val as ScenarioType)}>
              <SelectTrigger
                className="w-[130px] sm:w-[160px] lg:w-[185px] h-8 text-[11px] font-medium bg-[var(--bg)] border-[var(--line)] rounded-[8px] shadow-2xs hover:border-[var(--ac)]/40 transition-colors"
                title="Simulate Atmospheric Scenario"
              >
                <SelectValue placeholder="Scenario" />
              </SelectTrigger>
              <SelectContent className="border border-[var(--line)] bg-[var(--card)] shadow-xl rounded-[10px] z-[100] min-w-[210px]">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[var(--mut)] uppercase tracking-wider border-b border-[var(--line)]/50">
                  Atmospheric Simulation
                </div>
                {scenarios.map((sc) => (
                  <SelectItem key={sc.key} value={sc.key} className="text-xs font-medium cursor-pointer py-1.5">
                    <span className="mr-2 text-sm">{sc.icon}</span>
                    <span>{sc.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Telemetry Hardware Node Badge (Desktop) */}
          <div
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[11px] font-medium text-[var(--mut)]"
            title={sensor.isOnline ? "ESP32 Hardware Node Online" : "Hardware Node Offline"}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-[var(--ink)] font-semibold">{sensor.isOnline ? 'Node Online' : 'Offline'}</span>
          </div>

          {/* Quick Refresh Data */}
          <Button
            variant="outline"
            size="icon"
            onClick={refreshAirData}
            disabled={isRefreshing}
            className="h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px] bg-[var(--bg)] border-[var(--line)]"
            title="Refresh atmospheric telemetry"
            aria-label="Refresh telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--ac)]' : ''}`} />
          </Button>

          {/* Official Area Compliance Report Button */}
          {onOpenReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenReport}
              className="hidden sm:inline-flex h-8 gap-1.5 text-xs font-semibold px-2.5 rounded-[8px] bg-[var(--bg)] hover:bg-[var(--card)] border-[var(--line)] text-[var(--ink)] shadow-2xs hover:border-[var(--ac)]/50 transition-all cursor-pointer"
              title="Generate Official Area Air Pollution Compliance Audit Report"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--ac)]" />
              <span className="hidden xl:inline">Area Report</span>
            </Button>
          )}

          {/* Health Notifications Bell with Unread Badge */}
          {onOpenNotification && (
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenNotification}
              className="relative h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px] bg-[var(--bg)] border-[var(--line)] shadow-2xs transition-all cursor-pointer"
              title="Health Alerts & Smart Notifications"
              aria-label="Health Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-[var(--card)]" />
            </Button>
          )}

          {/* Quick Settings Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenSettings}
            className="hidden sm:inline-flex h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px] bg-[var(--bg)] border-[var(--line)] shadow-2xs transition-all"
            title="Profile & Calibration Settings"
            aria-label="Profile and Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-[var(--ink)] bg-[var(--bg)] hover:bg-[var(--card)] border-[var(--line)] rounded-[8px] shadow-2xs transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-3.5 h-3.5 text-[var(--ac2)]" />
              : <Moon className="w-3.5 h-3.5 text-[var(--ink)]" />}
          </Button>

          {/* Profile Avatar + Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center text-[12px] font-semibold shadow-2xs border-2 border-[var(--card)] hover:scale-105 transition-transform cursor-pointer"
              title="Profile & settings"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              {userInitial}
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-64 card shadow-xl border border-[var(--line)] rounded-[12px] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Info Header */}
                <div className="px-4 py-3.5 border-b border-[var(--line)] bg-[var(--bg)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center text-[15px] font-semibold shrink-0">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-sm font-medium text-[var(--ink)] truncate">
                        {userProfile.name || 'AirGuard User'}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-[var(--mut)] shrink-0" />
                        <span className="text-[11px] text-[var(--mut)] truncate">{dummyEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile stats */}
                <div className="px-4 py-2.5 border-b border-[var(--line)] flex items-center gap-3 text-[11px] text-[var(--mut)] bg-[var(--card)]">
                  <div className="flex flex-col items-center">
                    <span className="font-display text-base font-medium text-[var(--ink)]">{userProfile.age || '—'}</span>
                    <span className="text-[10px]">Age</span>
                  </div>
                  <div className="w-px h-8 bg-[var(--line)]" />
                  <div className="flex flex-col items-center">
                    <span className="font-display text-base font-medium text-[var(--ink)] capitalize">{userProfile.sensitivityLevel || 'Normal'}</span>
                    <span className="text-[10px]">Sensitivity</span>
                  </div>
                  <div className="w-px h-8 bg-[var(--line)]" />
                  <div className="flex flex-col items-center flex-1">
                    <span className="font-display text-base font-medium text-[var(--ok)]">5</span>
                    <span className="text-[10px]">Day Streak</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-3 py-2.5 space-y-1 bg-[var(--card)]">
                  <button
                    onClick={() => { setProfileOpen(false); onOpenSettings(); }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[12px] font-medium text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[var(--mut)]" />
                    Edit Profile & Health Settings
                  </button>

                  {onOpenReport && (
                    <button
                      onClick={() => { setProfileOpen(false); onOpenReport(); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[12px] font-medium text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[var(--ac)]" />
                      Official Area Compliance Report
                    </button>
                  )}

                  {onOpenNotification && (
                    <button
                      onClick={() => { setProfileOpen(false); onOpenNotification(); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[12px] font-medium text-[var(--ink)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-rose-500" />
                      Health Alerts & Notifications
                    </button>
                  )}

                  <button
                    onClick={() => { setProfileOpen(false); if (onGoToLanding) onGoToLanding(); }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[12px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

