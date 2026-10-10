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
  Flame,
} from 'lucide-react';
import { WEEKLY_DATA, DAILY_TIMELINE } from '../data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const InsightsHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Weekly Summary Metrics Header */}
      <Card className="p-6 bg-white shadow-sm border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your Air Quality Week</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Longitudinal tracking of cumulative physiological particulate burden
            </p>
          </div>

          {/* Gamification Streak Banner */}
          <Badge className="gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 border border-amber-200 text-amber-900 text-xs font-bold shadow-sm">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
            <span>5-Day Healthy Air Streak 🔥</span>
          </Badge>
        </div>

        {/* 4 Summary Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/60 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Average AQI</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{WEEKLY_DATA.avgAqi}</span>
            <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Poor Tier</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/60 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Exposure Score</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{WEEKLY_DATA.avgExposureScore}<span className="text-lg font-bold text-slate-400">/100</span></span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">12% lower than peer avg</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/60 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Outdoor Time</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{WEEKLY_DATA.outdoorHours}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Logged over 7 days</span>
          </div>

          <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100/60 shadow-sm">
            <span className="text-[11px] font-bold text-rose-600 block uppercase tracking-wider">High Exposure</span>
            <span className="text-2xl font-black text-rose-900 mt-1 block">{WEEKLY_DATA.highExposureHours}</span>
            <span className="text-[10px] text-rose-700 font-medium block mt-0.5">Peak traffic transits</span>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="mt-6 pt-2">
          <h4 className="text-xs font-bold text-slate-700 mb-4">
            7-Day Exposure Score vs Ambient AQI
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA.daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} tickMargin={8} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickMargin={8} domain={[0, 350]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0f172a', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#334155', fontWeight: 600 }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Bar dataKey="aqi" fill="#cbd5e1" name="Ambient AQI" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exposureScore" fill="#10b981" name="Your Exposure Score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Daily Exposure Timeline */}
      <Card className="p-6 bg-white shadow-sm border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Daily Exposure Timeline</h3>
            <p className="text-xs text-slate-500 mt-1">
              Activity log correlating transit milestones with encountered particulate density
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold text-slate-500 border-slate-200">Today's Itinerary</Badge>
        </div>

        <div className="relative pl-7 border-l-2 border-slate-100 space-y-7 mt-7 ml-2">
          {DAILY_TIMELINE.map((item, idx) => {
            const isHigh = item.exposure === 'High' || item.exposure === 'Very High';
            return (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div
                  className={cn(
                    "absolute -left-[35px] top-0 w-4 h-4 rounded-full border-[3px] border-white shadow-sm transition-transform group-hover:scale-125",
                    isHigh ? "bg-rose-500" : item.exposure === 'Moderate' ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-slate-50/50 p-3 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-sm font-bold text-slate-800">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5",
                          isHigh
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : item.exposure === 'Moderate'
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {item.exposure} Exposure
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-medium">
                        AQI: <strong className="text-slate-700">{item.aqiEncountered}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 self-start sm:self-center mt-2 sm:mt-0 bg-white px-2.5 py-1 rounded-md border border-slate-100 shadow-xs">
                    <span className="text-slate-600">{item.time}</span> <span className="opacity-50 mx-1">•</span> {item.duration}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
