import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  HeartPulse,
  Clock,
  CheckCheck,
  Send,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationTab = 'alerts' | 'reminders' | 'windows';

interface NotificationItem {
  id: string;
  type: 'threshold' | 'health' | 'commute';
  title: string;
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
  read: boolean;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { airData, userProfile, currentLocation } = useAirGuard();
  const [activeTab, setActiveTab] = useState<NotificationTab>('alerts');
  const [thresholdPush, setThresholdPush] = useState(true);
  const [morningDigest, setMorningDigest] = useState(true);

  // Dynamic notifications based on live data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'threshold',
      title: airData.aqi > 200 ? 'Severe PM2.5 Inversion Spike' : 'Atmospheric Inversion Warning',
      message: `Localized PM2.5 recorded at ${airData.pm25} µg/m³ near ${currentLocation.name}. Direct alveolar deposition risk elevated.`,
      time: '12m ago',
      severity: airData.aqi > 200 ? 'critical' : 'warning',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'health',
      title: 'Personalized Health Safeguard',
      message: `Active profile: ${userProfile.name || 'Friend'} (${userProfile.sensitivityLevel || 'Sensitive'}). Recommended N95 mask usage during outdoor exposure.`,
      time: '45m ago',
      severity: 'warning',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'commute',
      title: 'Optimal Low-Exposure Travel Window',
      message: 'Cleanest atmospheric ventilation window predicted between 04:30 PM – 06:15 PM today.',
      time: '2h ago',
      severity: 'info',
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  // Demo Trigger for Hackathon Presentation
  const handleTriggerTestAlert = () => {
    const alertMsg = `⚠️ Critical AQI Spike: Localized PM2.5 reached ${airData.pm25} µg/m³ near ${currentLocation.name}. Avoid intense outdoor exercise.`;
    
    toast.warning('AirGuard Real-Time Alert', {
      description: alertMsg,
      duration: 6000,
      action: {
        label: 'View Advisory',
        onClick: () => setActiveTab('alerts'),
      },
    });

    // Add into notifications list
    const newAlert: NotificationItem = {
      id: `alert-${Date.now()}`,
      type: 'threshold',
      title: 'Live Simulated Sensor Alert',
      message: alertMsg,
      time: 'Just now',
      severity: 'critical',
      read: false,
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="card bg-[var(--card)] rounded-[14px] max-w-lg w-full shadow-2xl border border-[var(--line)] flex flex-col my-auto max-h-[88vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[var(--line)] bg-[var(--bg)]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs font-bold relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse ring-2 ring-[var(--card)]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--ink)] tracking-tight">
                  Health Alerts & Smart Notifications
                </h3>
                {unreadCount > 0 && (
                  <Badge variant="accent" className="text-[10px] py-0 px-1.5 font-bold">
                    {unreadCount} New
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-[var(--mut)]">
                Personalized telemetry triggers & daily reminders
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-[var(--mut)] hover:text-[var(--ink)]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Controls */}
        <div className="px-4 py-2.5 bg-[var(--card)] border-b border-[var(--line)] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all cursor-pointer border ${
                activeTab === 'alerts'
                  ? 'bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs'
                  : 'bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Thresholds</span>
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all cursor-pointer border ${
                activeTab === 'reminders'
                  ? 'bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs'
                  : 'bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Health SOPs</span>
            </button>
            <button
              onClick={() => setActiveTab('windows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all cursor-pointer border ${
                activeTab === 'windows'
                  ? 'bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs'
                  : 'bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--ink)] border-[var(--line)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Clean Windows</span>
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-[var(--mut)] hover:text-[var(--ac)] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark Read</span>
            </button>
          )}
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'alerts' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-[10px] bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--ink)]">Automated Micro-Pollutant Triggers</div>
                  <div className="text-[11px] text-[var(--mut)] mt-0.5">
                    AirGuard continuously tracks localized air density and alerts you whenever PM2.5 or PM10 exceeds your personal safety threshold.
                  </div>
                </div>
              </div>

              {notifications
                .filter((n) => n.type === 'threshold')
                .map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-[10px] border transition-all ${
                      notif.severity === 'critical'
                        ? 'bg-rose-500/5 border-rose-500/30'
                        : 'bg-[var(--bg)] border-[var(--line)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            notif.severity === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-xs font-semibold text-[var(--ink)]">{notif.title}</span>
                      </div>
                      <span className="text-[10px] text-[var(--mut)] font-mono">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-[var(--mut)] leading-relaxed pl-4">
                      {notif.message}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-[10px] bg-[var(--ac)]/10 border border-[var(--ac)]/20 text-xs flex items-start gap-2.5">
                <HeartPulse className="w-4 h-4 text-[var(--ac)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--ink)]">
                    Profile Tailored: {userProfile.sensitivityLevel || 'Standard Adult'}
                  </div>
                  <div className="text-[11px] text-[var(--mut)] mt-0.5">
                    Precautionary reminders based on your age ({userProfile.age || 26}) and respiratory baseline.
                  </div>
                </div>
              </div>

              {/* Medication & Protective Gear Reminders */}
              <div className="p-3.5 rounded-[10px] bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--ink)]">Pre-Commute Inhaler & Mask Reminder</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-emerald-600 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-[11px] text-[var(--mut)] leading-relaxed">
                  AQI is currently {airData.aqi} ({airData.category}). Asthmatic and vulnerable users should carry a reliever inhaler and wear an N95 mask before leaving home or office.
                </p>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--ink)]">Hydration & Airway Lubrication Alert</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-[var(--ac)] border-[var(--ac)]/30">
                    Recommended
                  </Badge>
                </div>
                <p className="text-[11px] text-[var(--mut)] leading-relaxed">
                  Dry aerosol smog dries bronchial mucous membranes. Drink at least 250ml of warm water every 90 minutes to assist mucosal ciliary clearance.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'windows' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--ink)]">Smart Outdoor & Commute Windows</div>
                  <div className="text-[11px] text-[var(--mut)] mt-0.5">
                    Atmospheric boundary layer forecast predicts the cleanest air periods for your location.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[var(--bg)] border border-[var(--line)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--ink)]">Safest Afternoon Window</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    03:45 PM – 05:30 PM
                  </span>
                </div>
                <p className="text-[11px] text-[var(--mut)] leading-relaxed">
                  Solar thermal currents disperse surface particulates. Safest window for outdoor chores, short runs, or student pick-ups.
                </p>
              </div>

              <div className="p-3.5 rounded-[10px] bg-rose-500/5 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Hazardous Night Inversion</span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    09:00 PM – 07:00 AM
                  </span>
                </div>
                <p className="text-[11px] text-[var(--mut)] leading-relaxed">
                  Temperature inversion traps vehicular soot at ground level. Keep residential windows closed; run indoor air scrubbers.
                </p>
              </div>
            </div>
          )}

          {/* Quick Notification Preferences */}
          <div className="pt-3 border-t border-[var(--line)]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--mut)] mb-2">
              Automated Alert Settings
            </div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-[8px] bg-[var(--bg)] cursor-pointer">
                <span className="text-[var(--ink)]">Instant High AQI Push Warning</span>
                <input
                  type="checkbox"
                  checked={thresholdPush}
                  onChange={(e) => setThresholdPush(e.target.checked)}
                  className="rounded border-[var(--line)] text-[var(--ac)] focus:ring-[var(--ac)]"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded-[8px] bg-[var(--bg)] cursor-pointer">
                <span className="text-[var(--ink)]">Daily 07:00 AM Air Quality Briefing</span>
                <input
                  type="checkbox"
                  checked={morningDigest}
                  onChange={(e) => setMorningDigest(e.target.checked)}
                  className="rounded border-[var(--line)] text-[var(--ac)] focus:ring-[var(--ac)]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer with Interactive Hackathon Live Test Button */}
        <div className="px-4 py-3 border-t border-[var(--line)] bg-[var(--bg)]/90 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerTestAlert}
            className="gap-1.5 text-xs border-[var(--ac)]/40 text-[var(--ac)] hover:bg-[var(--ac)]/10 font-semibold"
            title="Demonstrate Real-Time Alert to Hackathon Judges"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Trigger Live Test Toast</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="text-xs bg-[var(--ac)] text-[var(--onac)] hover:opacity-90 px-4"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
