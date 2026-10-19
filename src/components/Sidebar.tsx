import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wind,
  ShieldAlert,
  MapPin,
  Navigation,
  Clock,
  Bot,
  Radio,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SeverityDot } from './ui/SeverityDot';

interface SidebarProps {
  onOpenSettings: () => void;
  onGoToLanding?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenLocation?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSettings,
  onGoToLanding,
  isMobileOpen = false,
  onCloseMobile,
  onOpenLocation,
}) => {
  const { activeTab, setActiveTab, airData } = useAirGuard();
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);

  const isDrawerOpen = isMobileOpen || internalDrawerOpen;
  const handleCloseDrawer = () => {
    setInternalDrawerOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-air', label: 'Live Air Quality', icon: Wind },
    { id: 'exposure', label: 'Personal Exposure', icon: ShieldAlert, badge: '72/100' },
    { id: 'map', label: 'Pollution Map', icon: MapPin },
    { id: 'routes', label: 'Smart Routes', icon: Navigation },
    { id: 'best-time', label: 'Best Time Planner', icon: Clock },
    { id: 'ai-guardian', label: 'AI Guardian', icon: Bot, badge: 'AI' },
    { id: 'sensor', label: 'Sensor Monitor', icon: Radio, online: true },
    { id: 'insights', label: 'Insights & History', icon: BarChart3 },
  ];

  const handleNavSelect = (id: string) => {
    setActiveTab(id);
    handleCloseDrawer();
  };

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <div className="hidden md:flex p-2.5 sm:p-3 pr-0 shrink-0 h-screen z-30">
        <aside
          role="navigation"
          aria-label="Main sidebar navigation"
          className="w-[245px] lg:w-[255px] h-full bg-[var(--card)] rounded-[16px] border border-[var(--line)] shadow-[var(--sh-3d)] flex flex-col select-none overflow-hidden"
        >
          {/* Brand Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[var(--line)]/60">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                if (onGoToLanding) onGoToLanding();
                else setActiveTab('dashboard');
              }}
              title="Click to visit Landing Page"
            >
              <div className="w-8 h-8 rounded-[9px] bg-[var(--ac)] flex items-center justify-center text-[var(--onac)] shadow-xs transition-transform group-hover:scale-105">
                <Wind className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="font-display text-[16px] font-medium tracking-tight text-[var(--ink)] flex items-center gap-1.5">
                  AirGuard
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-[var(--ac)]/10 text-[var(--ac)] px-1.5 py-0.5 rounded-[5px]">
                    PRO
                  </span>
                </h1>
                <p className="text-[11px] text-[var(--mut)] font-normal">Personal Exposure Engine</p>
              </div>
            </div>
          </div>

          {/* Live Status Strip */}
          <div className="px-4 sm:px-5 py-2 flex items-center justify-between text-xs border-b border-[var(--line)]/40 bg-[var(--bg)]/50">
            <div className="flex items-center gap-2 text-[var(--mut)] font-medium">
              <SeverityDot colorHex="var(--ok)" animate />
              <span className="text-[11px] tracking-tight">Telemetry Online</span>
            </div>
            <span className="font-mono text-[11px] text-[var(--ink)] font-medium">
              {airData.aqi} AQI
            </span>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-[9px] text-[13px] font-medium transition-all group outline-none cursor-pointer",
                    isActive
                      ? "bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)] shadow-xs"
                      : "text-[var(--mut)] hover:text-[var(--ink)] hover:bg-[var(--bg)]/60 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-[var(--ac)]" : "text-[var(--mut)] group-hover:text-[var(--ink)]"
                      )}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[9px] font-medium px-2 py-0.5 rounded-full border",
                        isActive
                          ? "bg-[var(--card)] text-[var(--ac)] border-[var(--line)]"
                          : "bg-[var(--card)] text-[var(--mut)] border-[var(--line)]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.online && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse" title="ESP32 Connected" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Streak Widget */}
          <div className="p-3 mx-2.5 mb-2.5 card bg-[var(--bg)] border border-[var(--line)] rounded-[10px]">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)] mb-0.5">
              <span className="font-display text-[12px] font-medium">Healthy Streak</span>
              <span className="text-[var(--ac)] font-mono text-[11px] font-bold">5 Days</span>
            </div>
            <p className="text-[11px] text-[var(--mut)] leading-relaxed">
              Maintained safe route thresholds today.
            </p>
          </div>

          {/* Footer Nav */}
          <div className="px-3 py-2.5 border-t border-[var(--line)] space-y-1 bg-[var(--card)]">
            <Button
              variant="ghost"
              onClick={onOpenSettings}
              className="w-full justify-start h-8 px-2 text-[12px] font-medium text-[var(--mut)] hover:text-[var(--ink)]"
            >
              <Settings className="w-3.5 h-3.5 mr-2 text-[var(--mut)]" />
              Preferences
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('insights')}
              className="w-full justify-between h-8 px-2 text-[12px] font-medium text-[var(--mut)] hover:text-[var(--ink)]"
            >
              <div className="flex items-center">
                <HelpCircle className="w-3.5 h-3.5 mr-2 text-[var(--mut)]" />
                Insights &amp; History
              </div>
            </Button>
          </div>
        </aside>
      </div>

      {/* Mobile Slide-Over Drawer Navigation */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={handleCloseDrawer}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-[85%] max-w-[320px] bg-[var(--card)] h-full flex flex-col shadow-2xl border-r border-[var(--line)] z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[var(--line)]">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => {
                  handleCloseDrawer();
                  if (onGoToLanding) onGoToLanding();
                  else setActiveTab('dashboard');
                }}
              >
                <div className="w-8 h-8 rounded-[9px] bg-[var(--ac)] flex items-center justify-center text-[var(--onac)] shadow-xs">
                  <Wind className="w-4 h-4" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="font-display text-[16px] font-medium tracking-tight text-[var(--ink)] flex items-center gap-1.5">
                    AirGuard
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-[var(--ac)]/10 text-[var(--ac)] px-1.5 py-0.5 rounded-[5px]">
                      PRO
                    </span>
                  </h2>
                  <p className="text-[10px] text-[var(--mut)]">Personal Exposure Engine</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDrawer}
                className="h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px]"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Live Status Strip */}
            <div className="px-4 py-2 flex items-center justify-between text-xs border-b border-[var(--line)]/50 bg-[var(--bg)]/70">
              <div className="flex items-center gap-2 text-[var(--mut)] font-medium">
                <SeverityDot colorHex="var(--ok)" animate />
                <span className="text-[11px]">Telemetry Online</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--ink)] font-semibold">
                {airData.aqi} AQI
              </span>
            </div>

            {/* Drawer Nav List (All 9 items) */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mut)] px-2 pb-1.5">
                Navigation
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavSelect(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-[9px] text-[13px] font-medium transition-all group outline-none cursor-pointer",
                      isActive
                        ? "bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)] shadow-xs font-semibold"
                        : "text-[var(--mut)] hover:text-[var(--ink)] hover:bg-[var(--bg)]/60 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isActive ? "text-[var(--ac)]" : "text-[var(--mut)]"
                        )}
                      />
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-medium px-2 py-0.5 rounded-full border",
                          isActive
                            ? "bg-[var(--card)] text-[var(--ac)] border-[var(--line)]"
                            : "bg-[var(--card)] text-[var(--mut)] border-[var(--line)]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.online && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions Drawer Footer */}
            <div className="p-3 border-t border-[var(--line)] space-y-1.5 bg-[var(--card)] pb-safe">
              {onOpenLocation && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleCloseDrawer();
                    onOpenLocation();
                  }}
                  className="w-full justify-start h-9 px-2 text-[12px] font-medium text-[var(--mut)] hover:text-[var(--ink)]"
                >
                  <Compass className="w-3.5 h-3.5 mr-2.5 text-[var(--ac)]" />
                  Change Location
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => {
                  handleCloseDrawer();
                  onOpenSettings();
                }}
                className="w-full justify-start h-9 px-2 text-[12px] font-medium text-[var(--mut)] hover:text-[var(--ink)]"
              >
                <Settings className="w-3.5 h-3.5 mr-2.5 text-[var(--mut)]" />
                Preferences & Profile
              </Button>

              {onGoToLanding && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleCloseDrawer();
                    onGoToLanding();
                  }}
                  className="w-full justify-start h-9 px-2 text-[12px] font-medium text-[var(--mut)] hover:text-[var(--ink)]"
                >
                  <Wind className="w-3.5 h-3.5 mr-2.5 text-[var(--mut)]" />
                  View Landing Page
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar (Sticky at bottom for phones & tablets) */}
      <nav
        role="navigation"
        aria-label="Mobile navigation bar"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--line)] shadow-lg z-40 pb-safe"
      >
        <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
          {/* Main quick tabs */}
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'live-air', label: 'Live Air', icon: Wind },
            { id: 'routes', label: 'Routes', icon: Navigation },
            { id: 'map', label: 'Map', icon: MapPin },
            { id: 'ai-guardian', label: 'Copilot', icon: Bot },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-[8px] min-w-[54px] transition-colors cursor-pointer",
                  isActive
                    ? "text-[var(--ac)] font-semibold"
                    : "text-[var(--mut)] hover:text-[var(--ink)]"
                )}
              >
                <Icon className={cn("w-4 h-4 mb-0.5", isActive && "stroke-[2.5]")} />
                <span className="text-[10px] leading-tight tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {/* More Menu Button */}
          <button
            onClick={() => setInternalDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-2 rounded-[8px] min-w-[54px] transition-colors cursor-pointer",
              !['dashboard', 'live-air', 'routes', 'map', 'ai-guardian'].includes(activeTab)
                ? "text-[var(--ac)] font-semibold"
                : "text-[var(--mut)] hover:text-[var(--ink)]"
            )}
            title="All features and settings"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};


