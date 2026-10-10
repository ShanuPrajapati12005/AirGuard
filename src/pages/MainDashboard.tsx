import React from 'react';
import { useAirGuard } from '../context/AirGuardContext';
import { MainAQICard } from '../components/MainAQICard';
import { PersonalExposureCard } from '../components/PersonalExposureCard';
import { AIRecommendationCard } from '../components/AIRecommendationCard';
import { BestTimePlanner } from '../components/BestTimePlanner';
import { SmartRouteComparison } from '../components/SmartRouteComparison';
import { ActivityRiskCalculator } from '../components/ActivityRiskCalculator';
import { AIGuardianChat } from '../components/AIGuardianChat';
import { LiveSensorMonitor } from '../components/LiveSensorMonitor';
import { InsightsHistory } from '../components/InsightsHistory';
import { SCENARIO_PRESETS } from '../data/mockData';
import { Loader2 } from 'lucide-react';

const InteractivePollutionMap = React.lazy(() => import('../components/InteractivePollutionMap').then(module => ({ default: module.InteractivePollutionMap })));
import {
  AlertTriangle,
  Info,
  GraduationCap,
} from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    scenario,
  } = useAirGuard();

  const currentPreset = SCENARIO_PRESETS[scenario];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Realtime Atmosphere Alert (only if active alert in condition) */}
      {currentPreset.alertTitle && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-700 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">{currentPreset.alertTitle}</h4>
              <p className="text-xs text-rose-700 mt-0.5">{currentPreset.alertMessage}</p>
            </div>
          </div>
          {scenario === 'school_alert' && (
            <div className="hidden md:flex items-center gap-2 text-xs font-bold bg-rose-200/60 text-rose-900 px-3 py-1.5 rounded-xl">
              <GraduationCap className="w-4 h-4" />
              <span>Campus Protocol Activated</span>
            </div>
          )}
        </div>
      )}

      {/* Primary Dashboard View (When activeTab is 'dashboard') */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Top At-A-Glance Hero Section */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-2 sm:p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:divide-x divide-zinc-100">
              <MainAQICard />
              <div className="pl-0 md:pl-8">
                <PersonalExposureCard onViewDetailed={() => setActiveTab('exposure')} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Interactive Map Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Geospatial Pollution Map</h3>
                  <span className="text-[11px] font-medium text-zinc-500">Live API</span>
                </div>
                <div className="bg-white border border-zinc-200/60 p-2 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
                  <React.Suspense fallback={
                    <div className="h-[400px] w-full flex items-center justify-center bg-zinc-50 rounded-xl">
                      <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                    </div>
                  }>
                    <InteractivePollutionMap />
                  </React.Suspense>
                </div>
              </div>

              {/* Planning Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BestTimePlanner />
                <SmartRouteComparison />
              </div>
            </div>

            <div className="xl:col-span-1 space-y-8">
              <AIRecommendationCard onAskAirGuard={() => setActiveTab('ai-guardian')} />
              <ActivityRiskCalculator />
              <LiveSensorMonitor />
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Section Tabs */}
      {activeTab === 'live-air' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MainAQICard />
            <LiveSensorMonitor />
          </div>
          <BestTimePlanner />
        </div>
      )}

      {activeTab === 'exposure' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PersonalExposureCard onViewDetailed={() => {}} />
            <ActivityRiskCalculator />
          </div>
          <InsightsHistory />
        </div>
      )}

      {activeTab === 'map' && (
        <div className="space-y-6">
          <React.Suspense fallback={
            <div className="h-[400px] w-full flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          }>
            <InteractivePollutionMap />
          </React.Suspense>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="space-y-6">
          <SmartRouteComparison />
          <React.Suspense fallback={
            <div className="h-[400px] w-full flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          }>
            <InteractivePollutionMap />
          </React.Suspense>
        </div>
      )}

      {activeTab === 'best-time' && (
        <div className="space-y-6">
          <BestTimePlanner />
          <ActivityRiskCalculator />
        </div>
      )}

      {activeTab === 'ai-guardian' && (
        <div className="space-y-6">
          <AIGuardianChat />
        </div>
      )}

      {activeTab === 'sensor' && (
        <div className="space-y-6">
          <LiveSensorMonitor />
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <InsightsHistory />
        </div>
      )}

      {/* Footer / About Section */}
      <footer className="mt-16 pt-8 border-t border-zinc-200/50 text-xs text-zinc-500 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 className="font-semibold text-zinc-800 text-[13px] tracking-tight">About AirGuard</h5>
            <p className="text-zinc-500 mt-1 max-w-2xl leading-relaxed tracking-tight">
              AirGuard transforms raw air-quality data into personalized exposure intelligence. Built with realtime Open-Meteo meteorological API telemetry, interactive Leaflet routing, and AI synthesis.
            </p>
          </div>
          <div className="text-left sm:text-right text-[11px] text-zinc-400 space-y-0.5">
            <div>Data Standard: <strong className="text-zinc-500 font-medium">India NAQI & US AQI Standards</strong></div>
            <div>Exposure Model: <strong className="text-zinc-500 font-medium">AirGuard Physiological Index v1.2</strong></div>
          </div>
        </div>

        <div className="p-3 bg-zinc-50/50 rounded-lg text-zinc-500 text-[11px] flex items-center gap-2 border border-zinc-200/50 tracking-tight">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>
            <strong className="font-semibold text-zinc-700">Disclaimer:</strong> Exposure estimates and activity advice are informational and do not constitute clinical or medical advice.
          </span>
        </div>
      </footer>
    </div>
  );
};
