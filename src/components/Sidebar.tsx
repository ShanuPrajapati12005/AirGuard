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
  Sparkles,
  Settings,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';

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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800 shadow-xl select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-extrabold text-xl">
            🌫️
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight flex items-center gap-1.5">
              AirGuard
              <span className="text-[10px] uppercase font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Personal Pollution Shield</p>
          </div>
        </div>
      </div>

      {/* Live Status Strip */}
      <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Station Active</span>
        </div>
        <span
          className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
          style={{ backgroundColor: `${airData.categoryColor}25`, color: airData.categoryColor }}
        >
          AQI {airData.aqi}
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-white border-l-4 border-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.online && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live ESP32 Connected" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Streak Widget in Sidebar */}
      <div className="p-4 mx-3 mb-3 bg-slate-950/70 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
          <span className="flex items-center gap-1.5">
            🌱 Healthy Streak
          </span>
          <span>5 DAYS 🔥</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          You chose lower-exposure routes for 5 consecutive days!
        </p>
      </div>

      {/* Footer Nav */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>User Profile & API Keys</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>AirGuard Help & Guide</span>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </aside>
  );
};
