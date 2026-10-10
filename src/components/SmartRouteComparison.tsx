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
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Smart Route Comparison</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare travel duration against cumulative particulate exposure
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Mode:</span>
          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
            🚶 Walking / Commute
          </span>
        </div>
      </div>

      {/* Input Form Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
        <div className="md:col-span-5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            From
          </label>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <input
              type="text"
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              className="bg-transparent w-full focus:outline-hidden"
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            To
          </label>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <input
              type="text"
              value={toLoc}
              onChange={(e) => setToLoc(e.target.value)}
              className="bg-transparent w-full focus:outline-hidden"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            onClick={handleCompare}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Compass className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
            <span>Compare</span>
          </button>
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
              className={`rounded-xl p-4 border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Badge Header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                    route.isRecommended
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {route.tag}
                </span>

                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-1">{route.name}</h4>
              <p className="text-xs text-slate-500 leading-snug mb-3">{route.description}</p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Time / Dist</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {route.durationMinutes}m <span className="font-normal text-slate-500">({route.distanceKm}km)</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Exposure</span>
                  <span
                    className="text-xs font-black uppercase"
                    style={{ color: route.exposureColor }}
                  >
                    {route.exposureLevel}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Score</span>
                  <span
                    className="text-xs font-black"
                    style={{ color: route.exposureColor }}
                  >
                    {route.exposureScore}/100
                  </span>
                </div>
              </div>

              {/* Button */}
              <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium">
                  Traffic: <strong className="text-slate-700 capitalize">{route.trafficIntensity}</strong>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoute(route);
                  }}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? 'Active Route' : `Choose ${route.name.split(':')[0]}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Callout */}
      <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-200/70 rounded-xl flex items-center justify-between gap-3 text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Route B</strong> takes <strong>4 minutes longer</strong> but reduces estimated PM2.5 inhalation by <strong>48%</strong>!
          </span>
        </div>
        <button
          onClick={() => setSelectedRoute(SMART_ROUTES[1])}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer"
        >
          Choose Route B ⭐
        </button>
      </div>
    </div>
  );
};
