import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Sparkles,
  Flame,
  Award,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { WEEKLY_DATA, DAILY_TIMELINE } from '../data/mockData';

export const InsightsHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Weekly Summary Metrics Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your Air Quality Week</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Longitudinal tracking of cumulative physiological particulate burden
            </p>
          </div>

          {/* Gamification Streak Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/15 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>5-Day Healthy Air Streak 🔥</span>
          </div>
        </div>

        {/* 4 Summary Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Average AQI</span>
            <span className="text-2xl font-black text-slate-800">{WEEKLY_DATA.avgAqi}</span>
            <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Poor Tier</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Exposure Score</span>
            <span className="text-2xl font-black text-slate-800">{WEEKLY_DATA.avgExposureScore}/100</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">12% lower than peer avg</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Outdoor Time</span>
            <span className="text-2xl font-black text-slate-800">{WEEKLY_DATA.outdoorHours}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Logged over 7 days</span>
          </div>

          <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-100">
            <span className="text-[11px] font-bold text-rose-600 block uppercase">High Exposure</span>
            <span className="text-2xl font-black text-rose-900">{WEEKLY_DATA.highExposureHours}</span>
            <span className="text-[10px] text-rose-700 font-medium block mt-0.5">Peak traffic transits</span>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="mt-4 pt-2">
          <h4 className="text-xs font-bold text-slate-700 mb-3">
            7-Day Exposure Score vs Ambient AQI
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA.daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 350]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="aqi" fill="#cbd5e1" name="Ambient AQI" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exposureScore" fill="#10b981" name="Your Exposure Score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Exposure Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Daily Exposure Timeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Activity log correlating transit milestones with encountered particulate density
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Today's Itinerary</span>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 mt-6">
          {DAILY_TIMELINE.map((item, idx) => {
            const isHigh = item.exposure === 'High' || item.exposure === 'Very High';
            return (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-125 ${
                    isHigh ? 'bg-rose-500' : item.exposure === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-800">{item.location}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    {item.time} • <span className="text-slate-400 font-normal">{item.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800'
                        : item.exposure === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.exposure} Exposure
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Encountered AQI: <strong className="text-slate-700">{item.aqiEncountered}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
