import React, { useState, useEffect } from 'react';
import {
  Navigation,
  CheckCircle2,
  MapPin,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { SMART_ROUTES } from '../data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const SmartRouteComparison: React.FC = () => {
  const { selectedRoute, setSelectedRoute, currentLocation, routes } = useAirGuard();
  const [fromLoc, setFromLoc] = useState(`Current Location (${currentLocation.name})`);
  const [toLoc, setToLoc] = useState('College / Office Campus');
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    setFromLoc(`Current Location (${currentLocation.name})`);
  }, [currentLocation]);

  const handleCompare = () => {
    setIsComparing(true);
    setTimeout(() => setIsComparing(false), 400);
  };

  const routeList = routes && routes.length > 0 ? routes : SMART_ROUTES;

  return (
    <div className="card card-3d p-5 sm:p-6 border border-[var(--line)] shadow-[var(--sh-3d)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="font-display text-sm sm:text-base font-medium text-[var(--ink)] tracking-tight">
              Smart Route Comparison
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-[var(--mut)] mt-1 font-normal">
            Evaluate commute duration vs cumulative particulate exposure
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--mut)] font-normal">Mode:</span>
          <Badge variant="secondary" className="text-[11px] py-0.5">
            🚶 Commute / Transit
          </Badge>
        </div>
      </div>

      {/* Input Form Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 my-4 card bg-[var(--bg)] p-3 border border-[var(--line)]">
        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-[var(--mut)] block mb-1 uppercase tracking-wider font-semibold">
            Origin
          </label>
          <div className="flex items-center gap-2 bg-[var(--card)] px-3 py-1.5 rounded-[8px] border border-[var(--line)] text-xs text-[var(--ink)] shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[var(--mut)] shrink-0" />
            <input
              type="text"
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              className="bg-transparent w-full focus:outline-hidden text-xs text-[var(--ink)] p-0 border-0 truncate"
              title={fromLoc}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-[var(--mut)] block mb-1 uppercase tracking-wider font-semibold">
            Destination
          </label>
          <div className="flex items-center gap-2 bg-[var(--card)] px-3 py-1.5 rounded-[8px] border border-[var(--line)] text-xs text-[var(--ink)] shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[var(--mut)] shrink-0" />
            <input
              type="text"
              value={toLoc}
              onChange={(e) => setToLoc(e.target.value)}
              className="bg-transparent w-full focus:outline-hidden text-xs text-[var(--ink)] p-0 border-0 truncate"
              title={toLoc}
            />
          </div>
        </div>

        <div className="shrink-0 flex items-end">
          <Button
            variant="primary"
            onClick={handleCompare}
            className="w-full sm:w-auto h-8 text-xs font-semibold px-4 rounded-[8px]"
          >
            <Compass className={cn("w-3.5 h-3.5 mr-1.5", isComparing ? "animate-spin" : "")} />
            Compare
          </Button>
        </div>
      </div>

      {/* Routes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {routeList.map((route) => {
          const isSelected = selectedRoute.id === route.id;
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={cn(
                "card card-3d p-4 transition-all cursor-pointer relative flex flex-col justify-between",
                isSelected
                  ? "border-[var(--ac)] bg-[var(--ac)]/5 shadow-md ring-1 ring-[var(--ac)]/30"
                  : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--ac)]/50"
              )}
            >
              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                  <Badge
                    variant={route.isRecommended ? "accent" : "destructive"}
                    className="text-[10px] uppercase font-semibold tracking-wider transition-transform hover:scale-105"
                  >
                    {route.tag}
                  </Badge>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--ac)] bg-[var(--ac)]/10 px-2 py-0.5 rounded-[6px] border border-[var(--ac)]/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-[11px] text-[var(--mut)] font-normal">Click to select</span>
                  )}
                </div>

                <h4 className="font-display text-sm font-medium text-[var(--ink)] mb-1 break-words">
                  {route.name}
                </h4>
                {/* Fluid, responsive text with natural height - no overflow */}
                <p className="text-xs text-[var(--mut)] leading-relaxed mb-3.5 min-h-[38px] break-words">
                  {route.description}
                </p>
              </div>

              <div>
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 card bg-[var(--bg)] p-2.5 rounded-[8px] border border-[var(--line)] text-center mb-3.5">
                  <div className="min-w-0">
                    <span className="text-[10px] text-[var(--mut)] block truncate">Duration</span>
                    <span className="font-display text-xs font-semibold text-[var(--ink)] mt-0.5 block truncate">
                      {route.durationMinutes}m <span className="font-sans text-[10px] text-[var(--mut)] font-normal">({route.distanceKm}km)</span>
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] text-[var(--mut)] block truncate">Exposure</span>
                    <span
                      className="font-display text-xs font-semibold mt-0.5 block capitalize truncate"
                      style={{ color: route.exposureColor }}
                    >
                      {route.exposureLevel}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] text-[var(--mut)] block truncate">Score</span>
                    <span
                      className="font-display text-xs font-semibold mt-0.5 block truncate"
                      style={{ color: route.exposureColor }}
                    >
                      {route.exposureScore}/100
                    </span>
                  </div>
                </div>

                {/* Button & Traffic Info */}
                <div className="pt-3 flex items-center justify-between flex-wrap gap-2 border-t border-[var(--line)]">
                  <span className="text-xs text-[var(--mut)]">
                    Traffic: <strong className="text-[var(--ink)] capitalize font-semibold">{route.trafficIntensity}</strong>
                  </span>
                  <Button
                    size="sm"
                    variant={isSelected ? "primary" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoute(route);
                    }}
                    className="text-[11px] h-7 px-3.5 rounded-[8px] font-semibold"
                  >
                    {isSelected ? 'Active Route' : 'Choose Route'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Callout */}
      <div className="mt-4 p-3.5 card bg-[var(--bg)] border border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--ink)]">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[var(--ac)]/15 text-[var(--ac)] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Route B</strong> adds <strong>4 minutes duration</strong> but reduces estimated PM2.5 inhalation by <strong className="text-[var(--ac)] font-bold">48%</strong>.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedRoute(routeList[1] || routeList[0])}
          className="text-xs shrink-0 w-full sm:w-auto h-7 px-3.5 rounded-[8px] font-medium"
        >
          Choose Route B
        </Button>
      </div>
    </div>
  );
};
