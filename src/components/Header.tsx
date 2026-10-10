import React from 'react';
import {
  Sparkles,
  RefreshCw,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { ScenarioType } from '../types';

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Greeting & Location */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Good afternoon, {userProfile.name} 👋
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Telemetry
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
            <button
              onClick={onOpenLocation}
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-all border border-slate-200 shadow-2xs cursor-pointer group"
              title="Click to change location or search any city"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="max-w-[280px] truncate">{airData.locationName}</span>
              <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wide ml-0.5 bg-emerald-100/70 px-1 py-0.2 rounded">
                Change
              </span>
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Updated {airData.updatedAt}</span>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshAirData}
          disabled={isRefreshing}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-2xs cursor-pointer"
          title="Refresh live atmospheric readings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Right: Atmospheric Conditions & User Profile */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Scenario / Condition Profile */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
          <span className="text-slate-500 font-semibold mr-1.5 hidden lg:inline">Atmospheric Filter:</span>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as ScenarioType)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            {scenarios.map((sc) => (
              <option key={sc.key} value={sc.key}>
                {sc.icon} {sc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Pill */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          title="Open Profile & API Settings"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
            {userProfile.name[0]}
          </div>
          <span>{userProfile.name}</span>
          <span className="text-[10px] text-slate-400 font-medium">({userProfile.healthConditions[0] || 'Profile'})</span>
        </button>
      </div>
    </header>
  );
};
