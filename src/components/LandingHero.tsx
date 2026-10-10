import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Wind,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface LandingHeroProps {
  onExploreDashboard: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreDashboard,
}) => {
  const { airData } = useAirGuard();

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col justify-between relative overflow-hidden">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--ac)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[var(--ac2)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Nav bar */}
      <header className="max-w-[1240px] mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-[9px] bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center shadow-xs">
            <Wind className="w-4 h-4" strokeWidth={2.2} />
          </span>
          <span className="font-display text-xl font-medium tracking-tight text-[var(--ink)]">
            AirGuard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onExploreDashboard}
            className="text-xs"
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            onClick={onExploreDashboard}
            className="text-xs font-semibold px-4"
          >
            Launch Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-[1240px] mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Column: Editorial narrative */}
        <div className="lg:w-1/2 space-y-7">
          <Badge variant="default" className="text-xs py-1 px-3">
            <Sparkles className="w-3.5 h-3.5 text-[var(--ac2)]" />
            <span>Personal Respiratory Intelligence</span>
          </Badge>

          <h1 className="font-display text-5xl sm:text-7xl font-normal text-[var(--ink)] tracking-tight leading-[1.05]">
            Breathe <span className="italic font-normal text-[var(--ac)]">Smarter.</span>
          </h1>

          <p className="text-xl font-medium text-[var(--ink)]/90 tracking-tight">
            Your air quality. Your exposure. Your routine decisions.
          </p>

          <p className="text-sm text-[var(--mut)] leading-relaxed max-w-xl">
            AirGuard converts raw pollution sensor metrics into proactive personal respiratory intelligence.
            By computing your individualized inhalation intake across commute routes, workout windows, and indoor environments,
            AirGuard answers: <strong className="text-[var(--ink)] font-semibold">"How does current air impact MY body right now?"</strong>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={onExploreDashboard}
              className="text-sm font-semibold px-6 shadow-sm"
            >
              Launch Live Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onExploreDashboard}
              className="text-sm font-medium"
            >
              Explore Sensor Map
            </Button>
          </div>

          {/* Feature checklist */}
          <div className="grid grid-cols-2 gap-3.5 pt-6 text-xs text-[var(--mut)] border-t border-[var(--line)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
              <span>Personalized Intake Multipliers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
              <span>Clean-Air Route Navigation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
              <span>AI Guardian Copilot</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
              <span>Live Sensor Telemetry</span>
            </div>
          </div>
        </div>

        {/* Right Column: MeetMind Style Preview Mockup */}
        <div className="lg:w-1/2 w-full relative">
          <Card className="p-6 space-y-5 border border-[var(--line)] shadow-lg bg-[var(--card)]/90 backdrop-blur-sm">
            {/* Top window bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--line)]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--line)]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--line)]"></span>
                <span className="text-[11px] text-[var(--mut)] ml-2 font-mono">airguard.app/telemetry</span>
              </div>
              <Badge variant="accent" className="text-[10px] uppercase font-semibold">
                Live Stream
              </Badge>
            </div>

            {/* Cards Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Ambient AQI */}
              <div className="card p-4 bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mut)]">
                  Ambient AQI
                </div>
                <div className="font-display text-4xl text-rose-600 mt-1.5 font-normal tracking-tight">
                  {airData.aqi}
                </div>
                <div className="text-xs font-semibold text-rose-600 mt-0.5">
                  Unhealthy Tier
                </div>
                <div className="text-[11px] text-[var(--mut)] mt-1">
                  PM2.5: {airData.pm25} µg/m³
                </div>
              </div>

              {/* Card 2: Personal Intake */}
              <div className="card p-4 bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mut)]">
                  Personal Exposure
                </div>
                <div className="font-display text-4xl text-[var(--ac2)] mt-1.5 font-normal tracking-tight">
                  72<span className="text-lg text-[var(--mut)] font-normal">/100</span>
                </div>
                <div className="text-xs font-semibold text-[var(--ac2)] mt-0.5">
                  High Exposure
                </div>
                <div className="text-[11px] text-[var(--mut)] mt-1">
                  +18% vs baseline
                </div>
              </div>
            </div>

            {/* Route comparison teaser */}
            <div className="card p-4 bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--ac)] uppercase tracking-wide">
                  Smart Route Choice
                </span>
                <div className="text-sm font-semibold text-[var(--ink)] mt-0.5">
                  Route B (Botanical Canopy)
                </div>
                <div className="text-xs text-[var(--mut)] mt-0.5">
                  +4 mins duration • <span className="text-[var(--ac)] font-semibold">-48% PM2.5 intake</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center font-bold">
                <Navigation className="w-4 h-4" />
              </div>
            </div>

            {/* AI Callout teaser */}
            <div className="card p-4 bg-[var(--ink)] text-[var(--onac)] border border-[var(--ink)] flex items-start gap-3">
              <Bot className="w-4 h-4 text-[var(--ac)] shrink-0 mt-0.5" />
              <p className="text-xs text-white/90 leading-relaxed font-normal">
                <strong className="text-[var(--ac)] font-semibold">AirGuard AI:</strong> "Current atmospheric conditions exceed safe respiratory bounds for high-cadence cardio. Relocate workout indoors or postpone to 06:00 AM."
              </p>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1240px] mx-auto w-full px-6 py-6 border-t border-[var(--line)] text-xs text-[var(--mut)] flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div>
          AirGuard Intelligence • Personal Air Pollution Guardian • Informational telemetry
        </div>
        <div className="flex items-center gap-3">
          <span>React + Vite + TypeScript</span>
          <span>•</span>
          <span className="text-[var(--ac)] font-medium">MeetMind UI System</span>
        </div>
      </footer>
    </div>
  );
};
