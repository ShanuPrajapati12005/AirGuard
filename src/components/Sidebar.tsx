import React from 'react';
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
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SeverityDot } from './ui/SeverityDot';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const { activeTab, setActiveTab, airData } = useAirGuard();

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-[var(--card)] flex-col h-screen sticky top-0 shrink-0 border-r border-[var(--line)] select-none z-30 hidden md:flex shadow-[var(--sh)]">
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-[var(--line)]/60">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
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
        <div className="px-6 py-2.5 flex items-center justify-between text-xs border-b border-[var(--line)]/40 bg-[var(--bg)]/50">
          <div className="flex items-center gap-2 text-[var(--mut)] font-medium">
            <SeverityDot colorHex="var(--ok)" animate />
            <span className="text-[11px] tracking-tight">Telemetry Online</span>
          </div>
          <span className="font-mono text-[11px] text-[var(--ink)] font-medium">
            {airData.aqi} AQI
          </span>
        </div>

        {/* Nav List */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-[9px] text-[13px] font-medium transition-all group outline-none",
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
        <div className="p-3.5 mx-3.5 mb-3.5 card bg-[var(--bg)] border border-[var(--line)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)] mb-0.5">
            <span className="font-display text-[12px] font-medium">Healthy Streak</span>
            <span className="text-[var(--ac)] font-mono text-[11px] font-bold">5 Days</span>
          </div>
          <p className="text-[11px] text-[var(--mut)] leading-relaxed">
            Maintained safe route thresholds today.
          </p>
        </div>

        {/* Footer Nav */}
        <div className="px-3.5 py-3 border-t border-[var(--line)] space-y-1 bg-[var(--card)]">
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
              Documentation
            </div>
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--line)] shadow-lg z-40 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.filter(i => ['dashboard', 'map', 'routes', 'ai-guardian', 'sensor'].includes(i.id)).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-[8px] min-w-[60px]",
                  isActive ? "text-[var(--ac)]" : "text-[var(--mut)]"
                )}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[9px] font-medium">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
