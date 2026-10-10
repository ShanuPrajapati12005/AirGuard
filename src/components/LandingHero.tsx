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

interface LandingHeroProps {
  onExploreDashboard: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreDashboard,
}) => {
  const { airData } = useAirGuard();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Nav bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
            🌫️
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AirGuard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreDashboard}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Launch Dashboard →
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Column: Narrative */}
        <div className="lg:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Beyond Raw AQI — Personal Air Guardian</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Breathe <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Smarter.</span>
          </h1>

          <p className="text-xl font-medium text-slate-300">
            Your air quality. Your exposure. Your decisions.
          </p>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            AirGuard transforms passive pollution readings into proactive personal exposure intelligence.
            By calculating your individualized respiratory intake from PM2.5, commute corridors, and activity duration,
            AirGuard answers: <strong className="text-white">"How does today's air affect MY routine, and what should I do right now?"</strong>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onExploreDashboard}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature checklist */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-300 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Personalized Intake Multipliers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Clean-Air Route Navigation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Guardian Assistant (Gemini)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ESP32 Simulated Hardware Stream</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Mockup Cards */}
        <div className="lg:w-1/2 w-full relative">
          <div className="relative bg-slate-850/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
            {/* Top row */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-400 ml-2 font-mono">airguard.demo/dashboard</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                Live Preview
              </span>
            </div>

            {/* Cards Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Ambient AQI */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ambient AQI
                </div>
                <div className="text-4xl font-black text-rose-500 mt-1">
                  276
                </div>
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">
                  Unhealthy Tier
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  PM2.5: 142 µg/m³
                </div>
              </div>

              {/* Card 2: Personal Intake */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Your Exposure Today
                </div>
                <div className="text-4xl font-black text-amber-400 mt-1">
                  72<span className="text-lg text-slate-500">/100</span>
                </div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                  High Exposure
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  +18% vs yesterday
                </div>
              </div>
            </div>

            {/* Route comparison teaser */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                  Smart Route Choice
                </span>
                <div className="text-xs font-bold text-slate-200 mt-0.5">
                  Route B (Botanical Canopy)
                </div>
                <div className="text-[10px] text-slate-400">
                  +4 mins duration • <strong className="text-emerald-400">-48% PM2.5 inhalation</strong>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
            </div>

            {/* AI Callout teaser */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-3.5 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
              <Bot className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs text-slate-200 leading-snug">
                <strong className="text-emerald-300">AirGuard AI:</strong> "Current conditions will overtax your respiratory threshold during outdoor cardio. Move workout indoors or wait for the 6:00 AM window."
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-4 border-t border-slate-800/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
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
