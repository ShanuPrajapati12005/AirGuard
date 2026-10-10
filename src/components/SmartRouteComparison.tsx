import React, { useState, useEffect } from 'react';
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { SMART_ROUTES } from '../data/mockData';
import { RouteOption } from '../types';
import { Card } from '@/components/ui/card';
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

  return (
    <div className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200/60 shadow-none">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight">Smart Route Comparison</h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium tracking-tight">
            Compare travel duration against cumulative particulate exposure
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium tracking-tight">Mode:</span>
          <Badge variant="outline" className="font-medium text-zinc-700 bg-white px-2 py-1 rounded border-zinc-200/60 shadow-none tracking-tight">
            🚶 Walking / Commute
          </Badge>
        </div>
      </div>

      {/* Input Form Strip */}
      {/* Input Form Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-6 bg-zinc-50/50 p-3 rounded-xl border border-zinc-200/60 shadow-none">
        <div className="md:col-span-5">
          <label className="text-[10px] font-medium text-zinc-500 block mb-1.5 ml-1 tracking-tight">
            Origin
          </label>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-medium text-zinc-700 shadow-none transition-all">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              className="bg-transparent w-full focus:outline-hidden tracking-tight"
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <label className="text-[10px] font-medium text-zinc-500 block mb-1.5 ml-1 tracking-tight">
            Destination
          </label>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-medium text-zinc-700 shadow-none transition-all">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={toLoc}
              onChange={(e) => setToLoc(e.target.value)}
              className="bg-transparent w-full focus:outline-hidden tracking-tight"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-end">
          <Button
            onClick={handleCompare}
            className="w-full h-[30px] bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[11px] font-medium transition-all shadow-none"
          >
            <Compass className={cn("w-3 h-3 mr-1.5", isComparing ? "animate-spin" : "")} />
            Compare
          </Button>
        </div>
      </div>

      {/* Routes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {(routes && routes.length > 0 ? routes : SMART_ROUTES).map((route) => {
          const isSelected = selectedRoute.id === route.id;
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={cn(
                "rounded-xl p-4 border transition-all cursor-pointer relative shadow-none",
                isSelected
                  ? "border-emerald-500 bg-emerald-50/20"
                  : "border-zinc-200/60 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
              )}
            >
              {/* Badge Header */}
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-semibold uppercase px-2 py-0.5 rounded-sm tracking-widest shadow-none",
                    route.isRecommended
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                      : "bg-rose-50 text-rose-700 border-rose-200/60"
                  )}
                >
                  {route.tag}
                </Badge>

                {isSelected && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 tracking-tight">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected
                  </span>
                )}
              </div>

              <h4 className="text-[13px] font-semibold text-zinc-900 mb-1 tracking-tight">{route.name}</h4>
              <p className="text-[11px] text-zinc-500 leading-snug mb-4 h-8 tracking-tight">{route.description}</p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-200/60 text-center shadow-none">
                <div>
                  <span className="text-[10px] text-zinc-500 block font-medium tracking-tight">Time / Dist</span>
                  <span className="text-[12px] font-semibold text-zinc-800 mt-0.5 block tracking-tight">
                    {route.durationMinutes}m <span className="font-normal text-zinc-400">({route.distanceKm}km)</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 block font-medium tracking-tight">Exposure</span>
                  <span
                    className="text-[12px] font-semibold mt-0.5 block tracking-tight capitalize"
                    style={{ color: route.exposureColor }}
                  >
                    {route.exposureLevel}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 block font-medium tracking-tight">Score</span>
                  <span
                    className="text-[12px] font-semibold mt-0.5 block tracking-tight"
                    style={{ color: route.exposureColor }}
                  >
                    {route.exposureScore}/100
                  </span>
                </div>
              </div>

              {/* Button */}
              <div className="mt-4 pt-4 flex items-center justify-between border-t border-zinc-100">
                <span className="text-[11px] text-zinc-500 font-medium tracking-tight">
                  Traffic: <strong className="text-zinc-700 capitalize">{route.trafficIntensity}</strong>
                </span>
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoute(route);
                  }}
                  className={cn(
                    "text-[10px] font-medium h-7 px-3 rounded-md transition-colors shadow-none",
                    isSelected ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-zinc-200/60 text-zinc-600"
                  )}
                >
                  {isSelected ? 'Active Route' : `Choose Route`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Callout */}
      <div className="mt-4 p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-center justify-between gap-3 text-[11px] text-zinc-700 shadow-none">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="leading-relaxed tracking-tight">
            <strong>Route B</strong> takes <strong>4 minutes longer</strong> but reduces estimated PM2.5 inhalation by <strong className="text-emerald-600">48%</strong>!
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => setSelectedRoute(SMART_ROUTES[1])}
          className="bg-white border-zinc-200/60 hover:bg-zinc-50 text-zinc-700 rounded-lg font-medium text-[11px] shrink-0 h-7 px-3 shadow-none"
        >
          Choose Route B
        </Button>
      </div>
    </div>
  );
};
