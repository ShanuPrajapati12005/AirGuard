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
  ExternalLink,
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
    { id: 'routes', label: 'Smart Routes', icon: Navigation, highlight: true },
    { id: 'best-time', label: 'Best Time Planner', icon: Clock },
    { id: 'ai-guardian', label: 'AI Guardian', icon: Bot, badge: 'AI' },
    { id: 'sensor', label: 'Sensor Monitor', icon: Radio, online: true },
    { id: 'insights', label: 'Insights & History', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-zinc-50/50 flex-col h-screen sticky top-0 shrink-0 border-r border-zinc-200/50 select-none z-30 hidden md:flex">
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-zinc-900 font-semibold text-[15px] tracking-tight flex items-center gap-1.5">
                AirGuard
                <span className="text-[9px] uppercase font-bold bg-zinc-200/60 text-zinc-600 px-1.5 py-0.5 rounded-sm">
                  PRO
                </span>
              </h1>
              <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Personal Exposure Model</p>
            </div>
          </div>
        </div>

        {/* Live Status Strip */}
        <div className="px-6 py-2 flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2 text-zinc-500 font-medium">
            <SeverityDot colorHex="#10b981" animate />
            <span className="tracking-tight text-[11px]">System Online</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">
            {airData.aqi} AQI
          </span>
        </div>

        {/* Nav List */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10",
                  isActive
                    ? "bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-zinc-200/60"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03] border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"
                    )}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={cn(
                    "text-[9px] font-semibold px-1.5 py-0.5 rounded-sm tracking-widest uppercase",
                    isActive ? "bg-zinc-100 text-zinc-600" : "text-zinc-400"
                  )}>
                    {item.badge}
                  </span>
                )}
                {item.online && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-subtle" title="Live ESP32 Connected" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Streak Widget in Sidebar */}
        <div className="p-3 mx-4 mb-4 bg-white border border-zinc-200/50 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[11px] text-zinc-800 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              Healthy Streak
            </span>
            <span className="text-zinc-500">5d</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-snug tracking-tight">
            Maintained low exposure paths.
          </p>
        </div>

        {/* Footer Nav */}
        <div className="px-4 py-3 border-t border-zinc-200/50 space-y-0.5">
          <Button
            variant="ghost"
            onClick={onOpenSettings}
            className="w-full justify-start h-8 px-2 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03] tracking-tight rounded-md"
          >
            <Settings className="w-3.5 h-3.5 mr-2.5 text-zinc-400" />
            Preferences
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('insights')}
            className="w-full justify-between h-8 px-2 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03] tracking-tight rounded-md"
          >
            <div className="flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-2.5 text-zinc-400" />
              Documentation
            </div>
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.filter(i => ['dashboard', 'map', 'routes', 'ai-guardian', 'sensor'].includes(i.id)).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg min-w-[64px]",
                  isActive ? "text-emerald-600" : "text-slate-500"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1", isActive ? "fill-emerald-50" : "")} />
                <span className="text-[9px] font-semibold">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
