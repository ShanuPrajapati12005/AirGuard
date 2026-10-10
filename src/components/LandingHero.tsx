import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Bot,
  Activity,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-60" />

      {/* Nav bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black shadow-sm">
            <Wind className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            AirGuard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onExploreDashboard}
            className="font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6"
          >
            Launch Dashboard <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Column: Narrative */}
        <div className="lg:w-1/2 space-y-8">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 px-3 py-1 text-xs font-semibold rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Beyond Raw AQI — Personal Air Guardian</span>
          </Badge>

          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Breathe <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">Smarter.</span>
          </h1>

          <p className="text-2xl font-semibold text-slate-700">
            Your air quality. Your exposure. Your decisions.
          </p>

          <p className="text-base text-slate-600 leading-relaxed max-w-xl">
            AirGuard transforms passive pollution readings into proactive personal exposure intelligence.
            By calculating your individualized respiratory intake from PM2.5, commute corridors, and activity duration,
            AirGuard answers: <strong className="text-slate-900">"How does today's air affect MY routine, and what should I do right now?"</strong>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={onExploreDashboard}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full px-8 h-14 text-base shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              Launch Live Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Feature checklist */}
          <div className="grid grid-cols-2 gap-4 pt-6 text-sm font-medium text-slate-600 border-t border-slate-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Personalized Intake Multipliers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Clean-Air Route Navigation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>AI Guardian Assistant</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Simulated Hardware Stream</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Mockup Cards */}
        <div className="lg:w-1/2 w-full relative">
          <Card className="relative bg-white/60 backdrop-blur-xl border-slate-200/60 rounded-[32px] p-8 shadow-2xl shadow-slate-200/50 space-y-6">
            {/* Top row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-slate-400 ml-2 font-mono font-medium">airguard.demo/dashboard</span>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-emerald-600 border-emerald-200 bg-emerald-50">
                Live Preview
              </Badge>
            </div>

            {/* Cards Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Ambient AQI */}
              <Card className="rounded-2xl p-5 border-slate-100 shadow-sm bg-white">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ambient AQI
                </div>
                <div className="text-5xl font-black text-rose-500 mt-2 tracking-tight">
                  276
                </div>
                <div className="text-xs font-bold text-rose-500 uppercase tracking-wide mt-1">
                  Unhealthy Tier
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  PM2.5: 142 µg/m³
                </div>
              </Card>

              {/* Card 2: Personal Intake */}
              <Card className="rounded-2xl p-5 border-slate-100 shadow-sm bg-white">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Your Exposure Today
                </div>
                <div className="text-5xl font-black text-amber-500 mt-2 tracking-tight">
                  72<span className="text-xl text-slate-400 font-semibold">/100</span>
                </div>
                <div className="text-xs font-bold text-amber-500 uppercase tracking-wide mt-1">
                  High Exposure
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  +18% vs yesterday
                </div>
              </Card>
            </div>

            {/* Route comparison teaser */}
            <Card className="rounded-2xl p-5 border-emerald-100 bg-emerald-50/50 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                  Smart Route Choice
                </span>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  Route B (Botanical Canopy)
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  +4 mins duration • <strong className="text-emerald-700">-48% PM2.5 inhalation</strong>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
            </Card>

            {/* AI Callout teaser */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-2xl border border-slate-700 flex items-start gap-3 shadow-lg">
              <Bot className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                <strong className="text-emerald-400">AirGuard AI:</strong> "Current conditions will overtax your respiratory threshold during outdoor cardio. Move workout indoors or wait for the 6:00 AM window."
              </p>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-200/60 text-xs font-medium text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div>
          AirGuard Prototype • Built for Hackathon Demo • Exposure estimates are informational and not medical advice.
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>React + Vite + TypeScript</span>
          <span>•</span>
          <span>Gemini / LangChain Ready</span>
        </div>
      </footer>
    </div>
  );
};
