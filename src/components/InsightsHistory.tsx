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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { exportToCsv } from '../utils/exportUtils';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InsightsHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Weekly Summary Metrics Header */}
      <div className="card card-3d p-5 sm:p-6 border border-[var(--line)] shadow-[var(--sh-3d)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-medium text-[var(--ink)]">
                Longitudinal Exposure History
              </h3>
            </div>
            <p className="text-xs text-[var(--mut)] mt-1 font-normal">
              7-day retrospective tracking of cumulative physiological particulate inhalation
            </p>
          </div>

          {/* Gamification Streak Banner */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCsv('airguard_exposure_history', WEEKLY_DATA.daysData)}
              className="text-xs h-7 px-2.5 rounded-[8px] gap-1.5"
            >
              <Download className="w-3 h-3 text-[var(--ac)]" />
              <span>Export CSV</span>
            </Button>
            <Badge variant="accent" className="gap-2 px-3 py-1 font-semibold text-xs">
            <Flame className="w-3.5 h-3.5 text-[var(--ac2)] fill-[var(--ac2)]" />
            <span>5-Day Clean Path Streak</span>
          </Badge>
          </div>
        </div>

        {/* 4 Summary Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="card p-3 bg-[var(--bg)] border border-[var(--line)]">
            <span className="text-[10px] text-[var(--mut)] block uppercase tracking-wider">Average AQI</span>
            <span className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5 block">{WEEKLY_DATA.avgAqi}</span>
            <span className="text-[10px] text-[var(--ac2)] font-medium block mt-0.5">Moderate Tier</span>
          </div>

          <div className="card p-3 bg-[var(--bg)] border border-[var(--line)]">
            <span className="text-[10px] text-[var(--mut)] block uppercase tracking-wider">Exposure Index</span>
            <span className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5 block">
              {WEEKLY_DATA.avgExposureScore}<span className="text-base text-[var(--mut)]">/100</span>
            </span>
            <span className="text-[10px] text-[var(--ok)] font-medium block mt-0.5">12% lower than peer avg</span>
          </div>

          <div className="card p-3 bg-[var(--bg)] border border-[var(--line)]">
            <span className="text-[10px] text-[var(--mut)] block uppercase tracking-wider">Outdoor Window</span>
            <span className="font-display text-2xl font-normal text-[var(--ink)] mt-0.5 block">{WEEKLY_DATA.outdoorHours}</span>
            <span className="text-[10px] text-[var(--mut)] block mt-0.5">Logged over 7 days</span>
          </div>

          <div className="card p-3 bg-[var(--bg)] border border-[var(--line)]">
            <span className="text-[10px] text-rose-700 block uppercase tracking-wider">Peak Exposure</span>
            <span className="font-display text-2xl font-normal text-rose-800 mt-0.5 block">{WEEKLY_DATA.highExposureHours}</span>
            <span className="text-[10px] text-rose-600 block mt-0.5">High-traffic corridors</span>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="mt-5 pt-2">
          <h4 className="font-display text-xs font-medium text-[var(--ink)] mb-3">
            7-Day Exposure Load vs Ambient Station AQI
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA.daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--mut)" fontSize={11} tickLine={false} tickMargin={8} />
                <YAxis stroke="var(--mut)" fontSize={11} tickLine={false} tickMargin={8} domain={[0, 350]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: 'var(--line)', borderRadius: '9px', color: '#111110', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  itemStyle={{ fontWeight: 500 }}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                />
                <Bar dataKey="aqi" fill="var(--line)" name="Ambient AQI" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exposureScore" fill="var(--ac)" name="Personal Exposure" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Exposure Timeline */}
      <div className="card p-5 sm:p-6 border border-[var(--line)] shadow-[var(--sh)]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
          <div>
            <h3 className="font-display text-base font-medium text-[var(--ink)]">
              Daily Exposure Itinerary
            </h3>
            <p className="text-xs text-[var(--mut)] mt-0.5">
              Chronological log correlating commute waypoints with encountered particulate load
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">Today's Timeline</Badge>
        </div>

        <div className="relative pl-6 border-l-2 border-[var(--line)] space-y-5 mt-6 ml-2">
          {DAILY_TIMELINE.map((item, idx) => {
            const isHigh = item.exposure === 'High' || item.exposure === 'Very High';
            return (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div
                  className={cn(
                    "absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--card)] shadow-xs transition-transform group-hover:scale-125",
                    isHigh ? "bg-rose-500" : item.exposure === 'Moderate' ? "bg-[var(--ac2)]" : "bg-[var(--ok)]"
                  )}
                />

                <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-3 bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--ac)]/40 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{item.icon}</span>
                      <span className="font-display text-sm font-medium text-[var(--ink)]">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant={isHigh ? "destructive" : item.exposure === 'Moderate' ? "default" : "accent"}
                        className="text-[10px] uppercase font-semibold"
                      >
                        {item.exposure} Exposure
                      </Badge>
                      <span className="text-xs text-[var(--mut)] font-normal">
                        AQI: <strong className="text-[var(--ink)]">{item.aqiEncountered}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-normal text-[var(--mut)] self-start sm:self-center mt-2 sm:mt-0 bg-[var(--card)] px-2.5 py-1 rounded-[6px] border border-[var(--line)] font-mono">
                    <span className="text-[var(--ink)]">{item.time}</span> <span className="opacity-40 mx-1">â€¢</span> {item.duration}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

