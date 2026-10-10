import React from 'react';
import { useAirGuard } from '../context/AirGuardContext';
import { MainAQICard } from '../components/MainAQICard';
import { PersonalExposureCard } from '../components/PersonalExposureCard';
import { AIRecommendationCard } from '../components/AIRecommendationCard';
import { BestTimePlanner } from '../components/BestTimePlanner';
import { SmartRouteComparison } from '../components/SmartRouteComparison';
import { InteractivePollutionMap } from '../components/InteractivePollutionMap';
import { ActivityRiskCalculator } from '../components/ActivityRiskCalculator';
import { AIGuardianChat } from '../components/AIGuardianChat';
import { LiveSensorMonitor } from '../components/LiveSensorMonitor';
import { InsightsHistory } from '../components/InsightsHistory';
import { SCENARIO_PRESETS } from '../data/mockData';
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
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
        <div className="space-y-6">
          {/* Top 3 Pillar Cards: AQI, Exposure, AI Advice */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MainAQICard />
            <PersonalExposureCard onViewDetailed={() => setActiveTab('exposure')} />
            <AIRecommendationCard onAskAirGuard={() => setActiveTab('ai-guardian')} />
          </div>

          {/* Middle Row: Best Outdoor Window & Smart Routes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BestTimePlanner />
            <SmartRouteComparison />
          </div>

          {/* Interactive Map Section */}
          <div>
            <InteractivePollutionMap />
          </div>

          {/* Bottom Row: Activity Risk Calculator & Live Hardware Sensor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityRiskCalculator />
            <LiveSensorMonitor />
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
          <InteractivePollutionMap />
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="space-y-6">
          <SmartRouteComparison />
          <InteractivePollutionMap />
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
      <footer className="mt-12 pt-8 border-t border-slate-200/80 text-xs text-slate-500 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h5 className="font-bold text-slate-700 text-sm">About AirGuard</h5>
            <p className="text-slate-500 mt-1 max-w-2xl leading-relaxed">
              AirGuard transforms raw air-quality data into personalized exposure intelligence. Built with realtime Open-Meteo meteorological API telemetry, interactive Leaflet routing, and AI synthesis.
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <div>Data Standard: <strong>India NAQI & US AQI Standards</strong></div>
            <div>Exposure Model: <strong>AirGuard Physiological Index v1.2</strong></div>
          </div>
        </div>

        <div className="p-3 bg-slate-100/80 rounded-xl text-slate-500 text-[11px] flex items-center gap-2 border border-slate-200">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> Exposure estimates and activity advice are informational and do not constitute clinical or medical advice.
          </span>
        </div>
      </footer>
    </div>
  );
};
