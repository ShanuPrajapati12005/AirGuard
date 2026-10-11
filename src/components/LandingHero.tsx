import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Wind,
  CheckCircle2,
  Navigation,
  Shield,
  Activity,
  Radio,
  Clock,
  Compass,
  ChevronDown,
  Sun,
  Moon,
  ExternalLink,
  HeartHandshake,
  Layers,
  Thermometer,
  Droplets,
  AlertCircle,
  User,
  MapPin,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { useTheme } from '../hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LandingHeroProps {
  onExploreDashboard: () => void;
  onOpenSettings?: () => void;
  onOpenLocation?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreDashboard,
  onOpenSettings,
  onOpenLocation,
}) => {
  const { airData, currentLocation, routes, userProfile } = useAirGuard();
  const { theme, toggleTheme } = useTheme();

  // Interactive showcase state
  const [activeDemoRoute, setActiveDemoRoute] = useState<'A' | 'B'>('B');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const currentRouteData = activeDemoRoute === 'A'
    ? {
        name: 'Route A: Expressway Corridor',
        tag: 'FASTEST ROUTE',
        tagColor: 'destructive' as const,
        duration: '20 min',
        distance: '8.0 km',
        exposureLevel: 'HIGH',
        exposureColor: '#ef4444',
        exposureScore: 82,
        traffic: 'Heavy diesel congestion & idling exhaust',
        inhalationToxicity: 'High particulate penetration (~185 µg/m³ PM2.5)',
        benefit: 'Direct highway path with maximum vehicular emission concentration.',
      }
    : {
        name: 'Route B: Green Canopy Route',
        tag: 'LOW-EXPOSURE ROUTE ⭐',
        tagColor: 'accent' as const,
        duration: '24 min',
        distance: '7.5 km',
        exposureLevel: 'LOWER',
        exposureColor: '#10b981',
        exposureScore: 42,
        traffic: 'Light residential road & dense tree canopy',
        inhalationToxicity: 'Significantly reduced intake (~58 µg/m³ PM2.5)',
        benefit: 'Adds 4 minutes of transit while reducing PM2.5 lung intake by 48%.',
      };

  const faqItems = [
    {
      q: 'How does Personal Exposure differ from standard city-wide AQI?',
      a: 'City AQI is a static geographic average measured by rooftop government stations. It assumes an average sedentary person breathing uniform air. In reality, your lungs inhale air based on your precise travel route, cardiovascular breathing rate (minute ventilation), age group, and medical sensitivity (such as asthma). AirGuard models your actual physiological inhalation intake.',
    },
    {
      q: 'Where does AirGuard get its live atmospheric telemetry?',
      a: 'AirGuard integrates live telemetry from Open-Meteo European and US atmospheric dispersion models, fused with high-resolution Copernicus Sentinel satellite feeds, local ground monitoring stations across India and global cities, and real-time ESP32 IoT hardware sensors.',
    },
    {
      q: 'How does the Clean-Air Smart Route calculation work?',
      a: 'Standard mapping applications optimize strictly for the fewest minutes. AirGuard runs a multi-objective cost optimization balancing transit duration against cumulative particulate exposure. It calculates time-integrated PM2.5 along urban green corridors and tree canopy buffers, often finding routes with a negligible 3-4 minute difference that slash inhaled toxins by up to 48%.',
    },
    {
      q: 'Can I connect my own physical ESP32 or PMS5003 air quality sensor?',
      a: 'Yes. AirGuard includes a built-in IoT hardware monitor interface. You can stream live microclimate telemetry from an ESP32 microcontroller outfitted with Plantower PMS5003 or Sensirion SPS30 particulate sensors over local REST/MQTT feeds.',
    },
    {
      q: 'Is my physiological profile and location kept private?',
      a: 'Absolutely. All physiological parameters, age calibrations, and activity inputs are processed client-side within your browser session and stored locally in browser storage. No personal health records are sold or transmitted to third-party ad networks.',
    },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col justify-between relative overflow-x-hidden">
      {/* Ambient atmospheric gradients */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[var(--ac)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-[var(--ac2)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[450px] h-[450px] bg-[var(--ok)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================================
          Sticky Navigation Bar
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[var(--card)]/85 backdrop-blur-md border-b border-[var(--line)] shadow-xs">
        <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onExploreDashboard}>
            <span className="w-8 h-8 rounded-[9px] bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Wind className="w-4 h-4" strokeWidth={2.4} />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-medium tracking-tight text-[var(--ink)]">
                AirGuard
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--ac)]/10 text-[var(--ac)] px-2 py-0.5 rounded-[5px] hidden sm:inline-block border border-[var(--ac)]/20">
                Intelligence
              </span>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[var(--mut)]">
            <a href="#telemetry" className="hover:text-[var(--ink)] transition-colors">
              Telemetry
            </a>
            <a href="#features" className="hover:text-[var(--ink)] transition-colors">
              Intelligence Pillars
            </a>
            <a href="#routes" className="hover:text-[var(--ink)] transition-colors">
              Clean Routes
            </a>
            <a href="#how-it-works" className="hover:text-[var(--ink)] transition-colors">
              Methodology
            </a>
            <a href="#faq" className="hover:text-[var(--ink)] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-medium rounded-[8px] border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] shadow-2xs transition-all flex items-center gap-1.5"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--ac2)]" />
                  <span className="hidden sm:inline text-[11px]">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--ink)]" />
                  <span className="hidden sm:inline text-[11px]">Dark Mode</span>
                </>
              )}
            </Button>

            {/* Location Selector Button */}
            {onOpenLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenLocation}
                className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-medium rounded-[8px] border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] shadow-2xs transition-all flex items-center gap-1.5"
                title="Change telemetry location or station"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--ac)]" />
                <span className="hidden sm:inline max-w-[120px] truncate text-[11px] font-medium">
                  {currentLocation.city || currentLocation.name}
                </span>
                <span className="sm:hidden text-[11px] font-medium">Location</span>
              </Button>
            )}

            {/* Profile Customization Button */}
            {onOpenSettings && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSettings}
                className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-medium rounded-[8px] border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] shadow-2xs transition-all flex items-center gap-1.5"
                title="Customize user profile and physiological parameters"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center text-[10px] font-semibold">
                  {userProfile.name ? userProfile.name[0].toUpperCase() : <User className="w-3 h-3" />}
                </div>
                <span className="hidden sm:inline text-[11px] font-medium">{userProfile.name || 'Set Profile'}</span>
              </Button>
            )}

            {/* Launch Dashboard Button */}
            <Button
              variant="primary"
              onClick={onExploreDashboard}
              className="h-8 sm:h-9 text-xs font-semibold px-3.5 sm:px-4 rounded-[8px] shadow-sm flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 pt-12 pb-16 lg:py-20 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left Column: Narrative Headline */}
        <div className="lg:w-1/2 space-y-6 sm:space-y-7">
          <Badge variant="default" className="text-xs py-1 px-3 border border-[var(--line)] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--ac2)] mr-1" />
            <span>Personal Respiratory Intelligence • Open-Meteo Telemetry</span>
          </Badge>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-[var(--ink)] tracking-tight leading-[1.08]">
            Breathe <span className="italic font-normal text-[var(--ac)]">Smarter.</span><br />
            Protect Every Breath.
          </h1>

          <p className="text-lg sm:text-xl font-medium text-[var(--ink)] tracking-tight">
            Your air quality. Your physiological exposure. Your routine decisions.
          </p>

          <p className="text-sm sm:text-base text-[var(--mut)] leading-relaxed max-w-xl font-normal">
            AirGuard converts raw pollution sensor metrics into proactive personal respiratory intelligence.
            By computing your individualized inhalation intake across commute corridors, cardio workout windows, and indoor environments,
            AirGuard answers: <strong className="text-[var(--ink)] font-semibold">"How does current air impact MY body right now?"</strong>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={onExploreDashboard}
              className="text-sm font-semibold px-6 shadow-sm h-11 rounded-[9px]"
            >
              Launch Live Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a href="#routes">
              <Button
                size="lg"
                variant="outline"
                className="text-sm font-medium h-11 px-5 rounded-[9px]"
              >
                Explore Clean Routes
              </Button>
            </a>
          </div>

          {/* Feature checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 text-xs text-[var(--mut)] border-t border-[var(--line)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--ac)] shrink-0" />
              <span className="font-medium text-[var(--ink)]">Personalized Intake Multipliers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--ac)] shrink-0" />
              <span className="font-medium text-[var(--ink)]">Clean-Air Route Navigation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--ac)] shrink-0" />
              <span className="font-medium text-[var(--ink)]">AI Guardian Copilot</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--ac)] shrink-0" />
              <span className="font-medium text-[var(--ink)]">Live Open-Meteo & ESP32 Telemetry</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Telemetry Preview */}
        <div className="lg:w-1/2 w-full relative">
          <Card className="card-3d p-5 sm:p-6 space-y-4 border border-[var(--line)] shadow-[var(--sh-3d)] bg-[var(--card)]">
            {/* Top window bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] text-[var(--mut)] ml-2 font-mono">airguard.app/telemetry</span>
              </div>
              <Badge variant="accent" className="text-[10px] uppercase font-semibold gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ac)] animate-pulse" />
                Live Sensor Feed
              </Badge>
            </div>

            {/* Live Station & Location Header */}
            <div className="flex items-center justify-between text-xs text-[var(--mut)]">
              {onOpenLocation ? (
                <button
                  type="button"
                  onClick={onOpenLocation}
                  className="flex items-center gap-1.5 hover:text-[var(--ac)] transition-colors cursor-pointer group text-left"
                  title="Click to change monitoring station or city"
                >
                  <Compass className="w-3.5 h-3.5 text-[var(--ac)] group-hover:rotate-45 transition-transform" />
                  <span className="font-medium text-[var(--ink)] underline decoration-dotted underline-offset-2">
                    {currentLocation.name}
                  </span>
                  <span className="text-[10px] text-[var(--mut)] bg-[var(--bg)] px-1.5 py-0.2 rounded border border-[var(--line)] ml-1">
                    Change
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[var(--ac)]" />
                  <span className="font-medium text-[var(--ink)]">{currentLocation.name}</span>
                </div>
              )}
              <span className="font-mono text-[11px] text-[var(--mut)]">Updated {airData.updatedAt}</span>
            </div>

            {/* Cards Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Ambient AQI */}
              <div className="card card-3d p-4 bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mut)]">
                  Ambient Station AQI
                </div>
                <div className="font-display text-4xl text-rose-600 dark:text-rose-400 mt-1.5 font-normal tracking-tight">
                  {airData.aqi}
                </div>
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                  Unhealthy Atmosphere
                </div>
                <div className="text-[11px] text-[var(--mut)] mt-1 font-mono">
                  PM2.5: {airData.pm25} µg/m³
                </div>
              </div>

              {/* Card 2: Personal Intake */}
              <div className="card card-3d p-4 bg-[var(--bg)] border border-[var(--line)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mut)]">
                  Personal Exposure Index
                </div>
                <div className="font-display text-4xl text-[var(--ac2)] mt-1.5 font-normal tracking-tight">
                  72<span className="text-lg text-[var(--mut)] font-normal">/100</span>
                </div>
                <div className="text-xs font-semibold text-[var(--ac2)] mt-0.5">
                  High Individual Load
                </div>
                <div className="text-[11px] text-[var(--mut)] mt-1 font-mono">
                  +18% above baseline
                </div>
              </div>
            </div>

            {/* Clean Route Teaser */}
            <div className="card card-3d p-4 bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Badge variant="accent" className="text-[9px] py-0 px-1.5">
                    Recommended
                  </Badge>
                  <span className="text-[11px] font-semibold text-[var(--ink)] truncate">
                    Route B (Botanical Canopy)
                  </span>
                </div>
                <p className="text-xs text-[var(--mut)]">
                  +4 min duration • <strong className="text-[var(--ac)] font-semibold">-48% PM2.5 inhalation</strong>
                </p>
              </div>
              <div className="w-8 h-8 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center shrink-0 border border-[var(--ac)]/20 shadow-2xs">
                <Navigation className="w-4 h-4" />
              </div>
            </div>

            {/* AI Callout Preview */}
            <div className="card card-3d p-3.5 bg-[var(--ink)] text-[var(--onac)] border border-[var(--ink)] flex items-start gap-3 shadow-md">
              <div className="w-6 h-6 rounded-full bg-[var(--ac)]/20 text-[var(--ac)] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-normal">
                <strong className="text-[var(--ac)] font-semibold">AirGuard AI:</strong> "Current atmospheric boundary layer inversion exceeds safe bounds for outdoor cardio. Relocate indoor or delay until 06:30 AM."
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          LIVE TELEMETRY PARAMETERS STRIP (#telemetry)
         ========================================================================= */}
      <section id="telemetry" className="border-y border-[var(--line)] bg-[var(--card)]/60 backdrop-blur-xs py-12 px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ac)] bg-[var(--ac)]/10 px-2.5 py-1 rounded-full border border-[var(--ac)]/20">
              Real-time Sensor Stream
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-[var(--ink)] tracking-tight mt-2.5">
              Microclimate Environmental Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mut)] mt-1.5 font-normal">
              Direct physical sensor metrics synced from Open-Meteo satellites and local ambient stations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Metric 1 */}
            <div className="card card-3d p-4 bg-[var(--card)] border border-[var(--line)] text-center">
              <span className="text-[10px] text-[var(--mut)] font-semibold uppercase tracking-wider block">PM2.5</span>
              <span className="font-display text-2xl font-normal text-rose-600 dark:text-rose-400 mt-1 block">
                {airData.pm25}
              </span>
              <span className="text-[10px] text-[var(--mut)] block font-mono">µg/m³</span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1.5 inline-block bg-rose-500/10 px-2 py-0.5 rounded">
                WHO Target: 15
              </span>
            </div>

            {/* Metric 2 */}
            <div className="card card-3d p-4 bg-[var(--card)] border border-[var(--line)] text-center">
              <span className="text-[10px] text-[var(--mut)] font-semibold uppercase tracking-wider block">PM10</span>
              <span className="font-display text-2xl font-normal text-amber-600 dark:text-amber-400 mt-1 block">
                {airData.pm10}
              </span>
              <span className="text-[10px] text-[var(--mut)] block font-mono">µg/m³</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1.5 inline-block bg-amber-500/10 px-2 py-0.5 rounded">
                WHO Target: 45
              </span>
            </div>

            {/* Metric 3 */}
            <div className="card card-3d p-4 bg-[var(--card)] border border-[var(--line)] text-center">
              <span className="text-[10px] text-[var(--mut)] font-semibold uppercase tracking-wider block">NO2 (Diesel)</span>
              <span className="font-display text-2xl font-normal text-[var(--ink)] mt-1 block">
                {airData.no2}
              </span>
              <span className="text-[10px] text-[var(--mut)] block font-mono">µg/m³</span>
              <span className="text-[10px] text-[var(--mut)] font-medium mt-1.5 inline-block bg-[var(--bg)] px-2 py-0.5 rounded">
                Traffic Exhaust
              </span>
            </div>

            {/* Metric 4 */}
            <div className="card card-3d p-4 bg-[var(--card)] border border-[var(--line)] text-center">
              <span className="text-[10px] text-[var(--mut)] font-semibold uppercase tracking-wider block">Ozone (O3)</span>
              <span className="font-display text-2xl font-normal text-[var(--ink)] mt-1 block">
                {airData.o3}
              </span>
              <span className="text-[10px] text-[var(--mut)] block font-mono">µg/m³</span>
              <span className="text-[10px] text-[var(--ok)] font-medium mt-1.5 inline-block bg-emerald-500/10 px-2 py-0.5 rounded">
                Satisfactory
              </span>
            </div>

            {/* Metric 5 */}
            <div className="card card-3d p-4 bg-[var(--card)] border border-[var(--line)] text-center">
              <span className="text-[10px] text-[var(--mut)] font-semibold uppercase tracking-wider block">Temperature</span>
              <span className="font-display text-2xl font-normal text-[var(--ink)] mt-1 block">
                {airData.temperature}°C
              </span>
              <span className="text-[10px] text-[var(--mut)] block font-mono">Ambient</span>
              <span className="text-[10px] text-[var(--mut)] font-medium mt-1.5 inline-block bg-[var(--bg)] px-2 py-0.5 rounded">
                Dispersion layer
              </span>
            </div>

            {/* Metric 6 */}
            <div className="card card-3d p-4 bg-[var(--card)] border border-[var(--line)] text-center">
              <span className="text-[10px] text-[var(--mut)] font-semibold uppercase tracking-wider block">Humidity</span>
              <span className="font-display text-2xl font-normal text-[var(--ink)] mt-1 block">
                {airData.humidity}%
              </span>
              <span className="text-[10px] text-[var(--mut)] block font-mono">Relative</span>
              <span className="text-[10px] text-[var(--mut)] font-medium mt-1.5 inline-block bg-[var(--bg)] px-2 py-0.5 rounded">
                Hygroscopic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOUR CORE INTELLIGENCE PILLARS (#features)
         ========================================================================= */}
      <section id="features" className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 py-20 z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="default" className="text-xs mb-3">
            Core Architecture
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-normal text-[var(--ink)] tracking-tight">
            Why AirGuard Changes Everything
          </h2>
          <p className="text-sm sm:text-base text-[var(--mut)] mt-3 leading-relaxed">
            Existing air apps display a generic city number. AirGuard transforms atmospheric science into personal, actionable protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="card card-3d p-6 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 mb-4 shadow-2xs">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-medium text-[var(--ink)] mb-2">
                Personalized Intake Multiplier
              </h3>
              <p className="text-xs text-[var(--mut)] leading-relaxed font-normal">
                Lungs are not identical. A morning jogger with asthma inhales 4x the particulate matter of a slow pedestrian. AirGuard calibrates intake to your exact respiratory profile, age, and minute ventilation rate.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] font-semibold text-[var(--ac)] flex items-center gap-1.5">
              <span>Physiological Calibration</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="card card-3d p-6 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 mb-4 shadow-2xs">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-medium text-[var(--ink)] mb-2">
                Clean-Air Route Navigation
              </h3>
              <p className="text-xs text-[var(--mut)] leading-relaxed font-normal">
                Conventional GPS routes you through high-exhaust traffic corridors to save 3 minutes. AirGuard identifies green canopy corridors and residential buffers that slash inhaled toxins by up to 48%.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] font-semibold text-[var(--ac)] flex items-center gap-1.5">
              <span>Smart Commute Planning</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="card card-3d p-6 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 mb-4 shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-medium text-[var(--ink)] mb-2">
                AI Guardian Pulmonology Copilot
              </h3>
              <p className="text-xs text-[var(--mut)] leading-relaxed font-normal">
                Generative AI trained on clinical pulmonology heuristics. Provides actionable advice: whether your child needs a mask for school, safe outdoor workout windows, or when to seal indoor windows.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] font-semibold text-[var(--ac)] flex items-center gap-1.5">
              <span>Contextual Health Coaching</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="card card-3d p-6 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 mb-4 shadow-2xs">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-medium text-[var(--ink)] mb-2">
                ESP32 IoT & Satellite Fusion
              </h3>
              <p className="text-xs text-[var(--mut)] leading-relaxed font-normal">
                Blends macro-scale satellite meteorology from Copernicus and Open-Meteo with physical ESP32 Plantower PMS5003 sensors streaming over MQTT for microclimate street-level precision.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] font-semibold text-[var(--ac)] flex items-center gap-1.5">
              <span>Hardware & API Bridge</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CLEAN ROUTE COMPARISON DEMO (#routes)
         ========================================================================= */}
      <section id="routes" className="border-t border-[var(--line)] bg-[var(--bg)] py-20 px-4 sm:px-6 z-10">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ac)] bg-[var(--ac)]/10 px-2.5 py-1 rounded-full border border-[var(--ac)]/20">
              Interactive Route Simulator
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-normal text-[var(--ink)] tracking-tight mt-2.5">
              Duration vs Particulate Exposure
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mut)] mt-1.5">
              Test how choosing Route B over Route A cuts toxic particulate inhalation by ~48% with only 4 minutes extra commute.
            </p>
          </div>

          <div className="card card-3d p-6 sm:p-8 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)]">
            {/* Interactive Toggle Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
              <div>
                <span className="text-xs text-[var(--mut)] block">Active Origin to Destination:</span>
                <span className="font-display text-base font-medium text-[var(--ink)]">
                  Connaught Place ➔ South Campus Tech Corridor
                </span>
              </div>

              {/* Selector Buttons */}
              <div className="flex items-center gap-2 bg-[var(--bg)] p-1.5 rounded-[10px] border border-[var(--line)]">
                <button
                  onClick={() => setActiveDemoRoute('A')}
                  className={cn(
                    "px-4 py-2 rounded-[8px] text-xs font-semibold transition-all cursor-pointer",
                    activeDemoRoute === 'A'
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-[var(--mut)] hover:text-[var(--ink)]"
                  )}
                >
                  Route A (Expressway)
                </button>
                <button
                  onClick={() => setActiveDemoRoute('B')}
                  className={cn(
                    "px-4 py-2 rounded-[8px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                    activeDemoRoute === 'B'
                      ? "bg-[var(--ac)] text-[var(--onac)] shadow-xs"
                      : "text-[var(--mut)] hover:text-[var(--ink)]"
                  )}
                >
                  <span>Route B (Green Canopy)</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded">-48% PM2.5</span>
                </button>
              </div>
            </div>

            {/* Comparison Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
              {/* Route Metric Cards */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant={currentRouteData.tagColor} className="text-xs py-1 px-3">
                    {currentRouteData.tag}
                  </Badge>
                  <span className="text-xs text-[var(--mut)] font-mono">
                    Mode: 🚶 Commute / Cycling / Transit
                  </span>
                </div>

                <h3 className="font-display text-2xl font-medium text-[var(--ink)]">
                  {currentRouteData.name}
                </h3>

                <p className="text-sm text-[var(--mut)] leading-relaxed">
                  {currentRouteData.benefit}
                </p>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-3 card bg-[var(--bg)] p-4 rounded-[10px] border border-[var(--line)] text-center">
                  <div>
                    <span className="text-[11px] text-[var(--mut)] block">Travel Time</span>
                    <span className="font-display text-base font-semibold text-[var(--ink)] mt-0.5 block">
                      {currentRouteData.duration}
                    </span>
                    <span className="text-[10px] text-[var(--mut)] font-mono">({currentRouteData.distance})</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[var(--mut)] block">Exposure Level</span>
                    <span
                      className="font-display text-base font-semibold mt-0.5 block"
                      style={{ color: currentRouteData.exposureColor }}
                    >
                      {currentRouteData.exposureLevel}
                    </span>
                    <span className="text-[10px] text-[var(--mut)]">Toxicity index</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[var(--mut)] block">Exposure Score</span>
                    <span
                      className="font-display text-base font-semibold mt-0.5 block"
                      style={{ color: currentRouteData.exposureColor }}
                    >
                      {currentRouteData.exposureScore}/100
                    </span>
                    <span className="text-[10px] text-[var(--mut)]">Relative burden</span>
                  </div>
                </div>

                {/* Traffic summary */}
                <div className="flex items-center gap-2 text-xs text-[var(--mut)] pt-1">
                  <span className="font-semibold text-[var(--ink)]">Micro-Environment:</span>
                  <span>{currentRouteData.traffic}</span>
                </div>
              </div>

              {/* Visual Inhalation Gauge / Comparison Graph */}
              <div className="lg:col-span-5 card card-3d p-6 bg-[var(--bg)] border border-[var(--line)] space-y-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--mut)] flex items-center justify-between">
                  <span>Particulate Inhalation</span>
                  <span className="font-mono text-[11px]">PM2.5 Burden</span>
                </div>

                {/* Route A Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-[var(--ink)]">Route A (Highway)</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">185 µg/m³</span>
                  </div>
                  <div className="w-full bg-[var(--line)] h-3 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: '85%' }} />
                  </div>
                </div>

                {/* Route B Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-[var(--ink)]">Route B (Green Canopy)</span>
                    <span className="font-mono text-[var(--ac)] font-bold">58 µg/m³ (-48%)</span>
                  </div>
                  <div className="w-full bg-[var(--line)] h-3 rounded-full overflow-hidden">
                    <div className="bg-[var(--ac)] h-full rounded-full transition-all duration-500" style={{ width: '38%' }} />
                  </div>
                </div>

                {/* Result Callout */}
                <div className="p-3 bg-[var(--card)] rounded-[8px] border border-[var(--line)] text-xs text-[var(--mut)] leading-relaxed">
                  💡 <strong className="text-[var(--ink)] font-semibold">Clinical Insight:</strong> Adding 4 minutes to your commute by choosing green residential buffers cuts fine particulate lung deposition by almost half, preventing blood-barrier translocation.
                </div>
              </div>
            </div>

            {/* Launch in Dashboard CTA */}
            <div className="pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[var(--mut)]">
                Try custom GPS origins and destinations on the live geospatial map.
              </span>
              <Button
                variant="primary"
                onClick={onExploreDashboard}
                className="text-xs font-semibold px-5 h-9 rounded-[8px]"
              >
                Launch Route Tool in App <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (3-STEP METHODOLOGY) (#how-it-works)
         ========================================================================= */}
      <section id="how-it-works" className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 py-20 z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="default" className="text-xs mb-3">
            System Workflow
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-normal text-[var(--ink)] tracking-tight">
            How AirGuard Protects You
          </h2>
          <p className="text-sm sm:text-base text-[var(--mut)] mt-3">
            A continuous closed-loop respiratory health cycle from ambient telemetry to proactive intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="card card-3d p-6 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)] relative">
            <span className="font-display text-5xl font-normal text-[var(--mut)]/20 absolute top-4 right-4">
              01
            </span>
            <div className="w-10 h-10 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 mb-4 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[var(--ink)] mb-2">
              Calibrate Physiological Profile
            </h3>
            <p className="text-xs text-[var(--mut)] leading-relaxed font-normal">
              Enter your age bracket, respiratory sensitivity (healthy, mild asthma, or severe COPD), and your habitual activity intensity. AirGuard computes your personal intake baseline.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card card-3d p-6 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)] relative">
            <span className="font-display text-5xl font-normal text-[var(--mut)]/20 absolute top-4 right-4">
              02
            </span>
            <div className="w-10 h-10 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 mb-4 shadow-2xs">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[var(--ink)] mb-2">
              Ingest Real-Time Microclimates
            </h3>
            <p className="text-xs text-[var(--mut)] leading-relaxed font-normal">
              AirGuard continuously streams satellite atmospheric dispersion forecasts, ground monitoring station data, and live ESP32 sensor fluctuations to map your immediate surroundings.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card card-3d p-6 bg-[var(--card)] border border-[var(--line)] shadow-[var(--sh-3d)] relative">
            <span className="font-display text-5xl font-normal text-[var(--mut)]/20 absolute top-4 right-4">
              03
            </span>
            <div className="w-10 h-10 rounded-[10px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 mb-4 shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-[var(--ink)] mb-2">
              Execute Proactive Decisions
            </h3>
            <p className="text-xs text-[var(--mut)] leading-relaxed font-normal">
              Receive smart commute recommendations, optimal outdoor cardio windows (e.g. 06:00 AM), air purifier schedules, and instant AI copilot warnings before entering toxic plume corridors.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLINICAL STANDARDS & BENCHMARKS
         ========================================================================= */}
      <section className="border-t border-[var(--line)] bg-[var(--card)]/40 py-16 px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ac)] bg-[var(--ac)]/10 px-2.5 py-1 rounded-full border border-[var(--ac)]/20">
              Clinical Air Benchmarks
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-[var(--ink)] tracking-tight mt-2.5">
              WHO 2021 Guidelines vs AirGuard Protection
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mut)] mt-1.5">
              How global health agencies classify particulate matter and where standard guidance falls short
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card card-3d p-5 bg-[var(--card)] border border-[var(--line)]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--mut)]">
                WHO 2021 Guideline
              </div>
              <div className="font-display text-2xl font-normal text-[var(--ink)] mt-2">
                15 µg/m³ <span className="text-xs font-sans text-[var(--mut)]">24h mean PM2.5</span>
              </div>
              <p className="text-xs text-[var(--mut)] mt-2 leading-relaxed font-normal">
                Strict medical standard to prevent chronic cardio-pulmonary disease. Almost 92% of Asian urban centers exceed this daily limit.
              </p>
            </div>

            <div className="card card-3d p-5 bg-[var(--card)] border border-[var(--line)]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--mut)]">
                US EPA National Standard
              </div>
              <div className="font-display text-2xl font-normal text-[var(--ink)] mt-2">
                35 µg/m³ <span className="text-xs font-sans text-[var(--mut)]">24h primary standard</span>
              </div>
              <p className="text-xs text-[var(--mut)] mt-2 leading-relaxed font-normal">
                Regulatory compliance metric. Does not account for personal minute ventilation during intense cardiovascular exercise.
              </p>
            </div>

            <div className="card card-3d p-5 bg-[var(--card)] border border-[var(--ac)]/40 bg-[var(--ac)]/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--ac)]">
                AirGuard Real-Time Model
              </div>
              <div className="font-display text-2xl font-normal text-[var(--ac)] mt-2">
                Dynamic Intake <span className="text-xs font-sans text-[var(--mut)]">(Liters × µg)</span>
              </div>
              <p className="text-xs text-[var(--mut)] mt-2 leading-relaxed font-normal">
                Evaluates cumulative inhaled micrograms based on personal exertion, route choice, and real-time atmospheric dispersion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION (#faq)
         ========================================================================= */}
      <section id="faq" className="max-w-[900px] mx-auto w-full px-4 sm:px-6 py-20 z-10">
        <div className="text-center mb-12">
          <Badge variant="default" className="text-xs mb-3">
            Knowledge Base
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[var(--ink)] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[var(--mut)] mt-2 font-normal">
            Everything you need to know about AirGuard telemetry, methodology, and privacy.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card card-3d border border-[var(--line)] bg-[var(--card)] transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <span className="font-display text-sm sm:text-base font-medium text-[var(--ink)]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-[var(--mut)] shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 text-[var(--ac)]" : ""
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--mut)] leading-relaxed border-t border-[var(--line)]/60 font-normal">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION BANNER
         ========================================================================= */}
      <section className="border-t border-[var(--line)] bg-[var(--card)] py-16 px-4 sm:px-6 text-center z-10">
        <div className="max-w-xl mx-auto space-y-5">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--ac)] text-[var(--onac)] mx-auto flex items-center justify-center shadow-sm">
            <Wind className="w-6 h-6" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[var(--ink)] tracking-tight">
            Take Proactive Control of Your Lungs
          </h2>
          <p className="text-xs sm:text-sm text-[var(--mut)] leading-relaxed font-normal">
            Experience hyper-local atmospheric telemetry and individualized respiratory intelligence right in your browser.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={onExploreDashboard}
              className="text-sm font-semibold px-7 h-11 rounded-[9px] shadow-sm"
            >
              Launch Live Dashboard Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMPREHENSIVE FOOTER
         ========================================================================= */}
      <footer className="border-t border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--mut)] py-10 px-4 sm:px-6 z-10">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-[6px] bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center">
                <Wind className="w-3.5 h-3.5" />
              </span>
              <span className="font-display text-base font-medium text-[var(--ink)]">
                AirGuard Intelligence Engine
              </span>
            </div>
            <p className="text-[11px] text-[var(--mut)] max-w-md">
              Personal Respiratory Exposure Intelligence • Powered by Open-Meteo & European Space Agency Copernicus Telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[var(--ac2)]" /> : <Moon className="w-3.5 h-3.5 text-[var(--ink)]" />}
              <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
            <button
              onClick={onExploreDashboard}
              className="px-3 py-1.5 rounded-[8px] border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] cursor-pointer"
            >
              Open Dashboard
            </button>
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--mut)]">
          <div>
            © {new Date().getFullYear()} AirGuard. Personal environmental telemetry & commute decision system.
          </div>
          <div className="text-[10px] text-[var(--mut)] max-w-sm sm:text-right">
            Notice: AirGuard provides environmental telemetry and informational exposure modeling, not medical diagnosis.
          </div>
        </div>
      </footer>
    </div>
  );
};
