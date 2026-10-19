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
import { Loader2, AlertTriangle, Info, GraduationCap } from 'lucide-react';

const InteractivePollutionMap = React.lazy(() =>
  import('../components/InteractivePollutionMap').then(module => ({ default: module.InteractivePollutionMap }))
);

export const MainDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    scenario,
  } = useAirGuard();

  const currentPreset = SCENARIO_PRESETS[scenario];

  return (
    <div className="p-2 sm:p-4 lg:p-6 pb-24 md:pb-8 max-w-[1240px] mx-auto space-y-4 sm:space-y-6">
      {/* Realtime Atmosphere Alert (only if active alert in condition) */}
      {currentPreset.alertTitle && (
        <div className="card card-3d p-3.5 sm:p-4 bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="p-2 bg-rose-500/20 rounded-[8px] text-rose-600 dark:text-rose-400 mt-0.5 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display text-sm font-medium text-rose-900 dark:text-rose-200">{currentPreset.alertTitle}</h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{currentPreset.alertMessage}</p>
            </div>
          </div>
          {scenario === 'school_alert' && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold bg-rose-500/20 text-rose-900 dark:text-rose-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-[8px] border border-rose-500/30 shrink-0">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Campus Protocol Activated</span>
              <span className="xs:hidden">Protocol</span>
            </div>
          )}
        </div>
      )}

      {/* Primary Dashboard View (When activeTab is 'dashboard') */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Top At-A-Glance Hero Section */}
          <div className="card card-3d p-4 sm:p-6 shadow-[var(--sh-3d)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:divide-x divide-[var(--line)]">
              <MainAQICard />
              <div className="pl-0 md:pl-8 border-t border-[var(--line)] pt-6 md:border-t-0 md:pt-0">
                <PersonalExposureCard onViewDetailed={() => setActiveTab('exposure')} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6 items-start">
            <div className="xl:col-span-2 space-y-6">
              {/* Interactive Map Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-medium text-[var(--ink)] tracking-tight">
                    Geospatial Pollution Map
                  </h3>
                  <span className="text-[11px] font-medium text-[var(--mut)]">Open-Meteo Telemetry</span>
                </div>
                <div className="card card-3d p-2 shadow-[var(--sh-3d)]">
                  <React.Suspense fallback={
                    <div className="h-[400px] w-full flex items-center justify-center bg-[var(--bg)] rounded-[10px]">
                      <Loader2 className="w-5 h-5 text-[var(--ac)] animate-spin" />
                    </div>
                  }>
                    <InteractivePollutionMap />
                  </React.Suspense>
                </div>
              </div>

              {/* Planning Tools */}
              <div className="space-y-6">
                <BestTimePlanner />
                <SmartRouteComparison />
              </div>
            </div>

            <div className="xl:col-span-1 space-y-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="card card-3d p-4 sm:p-6 border border-[var(--line)] shadow-[var(--sh-3d)] h-full flex flex-col justify-between">
              <MainAQICard extended />
            </div>
            <div className="h-full">
              <LiveSensorMonitor />
            </div>
          </div>
          <BestTimePlanner />
        </div>
      )}

      {activeTab === 'exposure' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="card card-3d p-4 sm:p-6 border border-[var(--line)] shadow-[var(--sh-3d)] h-full flex flex-col justify-between">
              <PersonalExposureCard onViewDetailed={() => {}} extended />
            </div>
            <div className="h-full">
              <ActivityRiskCalculator />
            </div>
          </div>
          <InsightsHistory />
        </div>
      )}

      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="card card-3d p-2 shadow-[var(--sh-3d)]">
            <React.Suspense fallback={
              <div className="h-[400px] w-full flex items-center justify-center bg-[var(--bg)] rounded-[10px]">
                <Loader2 className="w-6 h-6 text-[var(--ac)] animate-spin" />
              </div>
            }>
              <InteractivePollutionMap />
            </React.Suspense>
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="space-y-6">
          <SmartRouteComparison />
          <React.Suspense fallback={
            <div className="h-[400px] w-full flex items-center justify-center card">
              <Loader2 className="w-6 h-6 text-[var(--ac)] animate-spin" />
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
      <footer className="mt-8 sm:mt-12 pt-6 border-t border-[var(--line)] text-xs text-[var(--mut)] space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 className="font-display font-medium text-[var(--ink)] text-[14px]">About AirGuard</h5>
            <p className="text-[var(--mut)] mt-0.5 max-w-2xl leading-relaxed">
              AirGuard translates atmospheric telemetry into individualized inhalation exposure metrics. Powered by Open-Meteo meteorological models, interactive GIS route planning, and AI advisory synthesis.
            </p>
          </div>
          <div className="text-left sm:text-right text-[11px] text-[var(--mut)] space-y-0.5 font-mono">
            <div>Data Standard: <span className="text-[var(--ink)] font-medium">India NAQI & US EPA AQI</span></div>
            <div>Exposure Index: <span className="text-[var(--ink)] font-medium">AirGuard Physiological v1.2</span></div>
          </div>
        </div>

        <div className="card p-3 bg-[var(--bg)] text-[var(--mut)] text-[11px] flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[var(--mut)] shrink-0" />
          <span>
            <strong className="text-[var(--ink)] font-semibold">Advisory Disclaimer:</strong> Personal exposure calculations and recommended timing windows are informational aids and do not constitute clinical guidance.
          </span>
        </div>
      </footer>
    </div>
  );
};
