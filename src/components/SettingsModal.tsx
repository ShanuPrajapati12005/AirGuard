import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  User,
  Save,
  Check,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Search,
  Compass,
  Loader2,
  ChevronDown,
  ChevronUp,
  Radio,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { LOCATION_PRESETS } from '../data/mockData';
import { LocationPreset } from '../types';
import { searchLocationsOnline } from '../services/weatherApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime?: boolean;
}

const COMMON_CONDITIONS = [
  'None',
  'Mild Asthma',
  'Severe Asthma',
  'Allergies / Hay Fever',
  'Bronchitis',
  'Sinusitis',
  'Cardiovascular',
  'COPD',
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isFirstTime }) => {
  const {
    userProfile,
    setUserProfile,
    apiKey,
    setApiKey,
    waqiToken,
    setWaqiToken,
    currentLocation,
    setLocation,
  } = useAirGuard();

  const [name, setName] = useState(userProfile.name || '');
  const [age, setAge] = useState<number | string>(userProfile.age || 26);
  const [health, setHealth] = useState(
    userProfile.healthConditions && userProfile.healthConditions.length > 0
      ? userProfile.healthConditions.join(', ')
      : 'None'
  );
  const [sensitivity, setSensitivity] = useState(userProfile.sensitivityLevel || 'normal');
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [waqiInput, setWaqiInput] = useState(waqiToken || '');
  const [saved, setSaved] = useState(false);

  // Location customization state
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(currentLocation);
  const [isChangingLocation, setIsChangingLocation] = useState(Boolean(isFirstTime));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationPreset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Debounced online location search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocationsOnline(searchQuery);
        setSearchResults(results);
      } catch (e) {
        console.error('Failed to search locations:', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  // Determine whether "None" is currently active
  const isNoneSelected =
    !health.trim() ||
    health.trim().toLowerCase() === 'none' ||
    health.split(',').map((s) => s.trim().toLowerCase()).includes('none');

  const handleSelectCondition = (condition: string) => {
    if (condition === 'None') {
      setHealth('None');
      // If user chooses None, default sensitivity to normal if it was previously elevated
      if (sensitivity === 'sensitive' || sensitivity === 'high_risk') {
        setSensitivity('normal');
      }
      return;
    }

    // Toggle specific condition
    const currentList = health
      .split(',')
      .map((s) => s.trim())
      .filter((s) => Boolean(s) && s.toLowerCase() !== 'none');

    const index = currentList.findIndex((item) => item.toLowerCase() === condition.toLowerCase());

    if (index >= 0) {
      currentList.splice(index, 1);
    } else {
      currentList.push(condition);
    }

    if (currentList.length === 0) {
      setHealth('None');
      setSensitivity('normal');
    } else {
      setHealth(currentList.join(', '));
      if (
        condition.toLowerCase().includes('asthma') ||
        condition.toLowerCase().includes('cardio') ||
        condition.toLowerCase().includes('copd')
      ) {
        setSensitivity('high_risk');
      } else if (sensitivity === 'normal') {
        setSensitivity('sensitive');
      }
    }
  };

  const handleUseBrowserGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        const gpsLoc: LocationPreset = {
          id: `gps-${Date.now()}`,
          name: 'My Current GPS Location',
          city: 'Detected Device Location',
          state: 'Live GPS',
          coordinates: coords,
          baseAqi: 130,
          basePm25: 50,
          basePm10: 85,
          temperature: 28,
          humidity: 50,
          description: 'Live physical GPS device coordinates.',
        };
        setSelectedLocation(gpsLoc);
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsDetectingGps(false);
        alert('Could not access device GPS. Please search your city name in the input below.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSave = () => {
    const parsedConditions = health
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Update location in context
    if (selectedLocation && (selectedLocation.id !== currentLocation.id || selectedLocation.name !== currentLocation.name)) {
      setLocation(selectedLocation);
    }

    setUserProfile({
      ...userProfile,
      name: name.trim() || 'User',
      age: Number(age) || 26,
      healthConditions: parsedConditions.length > 0 ? parsedConditions : ['None'],
      sensitivityLevel: sensitivity,
      location: selectedLocation.name,
    });
    setApiKey(keyInput.trim());
    setWaqiToken(waqiInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="card bg-[var(--card)] rounded-[12px] max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-[var(--line)] relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center font-bold border border-[var(--ac)]/20 shadow-2xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-medium text-[var(--ink)] tracking-tight">
                  User Profile & Intelligence
                </h3>
                {isFirstTime && (
                  <span className="text-[10px] font-semibold bg-[var(--ac)]/10 text-[var(--ac)] px-2 py-0.5 rounded-full border border-[var(--ac)]/20">
                    Welcome
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--mut)] mt-0.5">
                Customize physiological factors, location, WAQI & Gemini credentials
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px] h-8 w-8"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-4 text-xs custom-scrollbar">
          {/* Welcome Callout if First Time */}
          {isFirstTime && (
            <div className="p-3 rounded-[9px] bg-[var(--ac)]/10 border border-[var(--ac)]/20 flex items-start gap-2.5 text-xs text-[var(--ink)]">
              <Sparkles className="w-4 h-4 text-[var(--ac)] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[var(--ac)]">Welcome to AirGuard!</span> Set your profile
                and home location to receive customized daily exposure indices, sensitive route alerts, and tailored AI recommendations.
              </div>
            </div>
          )}

          {/* User Name & Age */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="font-medium text-[var(--ink)]">Your Name</Label>
              <Input
                type="text"
                value={name}
                placeholder="e.g. Alex, Maria, John..."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="bg-[var(--card)] border-[var(--line)] h-9 text-xs rounded-[8px] focus-visible:ring-[var(--ac)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium text-[var(--ink)]">Age (Years)</Label>
              <Input
                type="number"
                value={age}
                min={1}
                max={120}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                className="bg-[var(--card)] border-[var(--line)] h-9 text-xs rounded-[8px] focus-visible:ring-[var(--ac)]"
              />
            </div>
          </div>

          {/* Location & Coordinates Customization Card */}
          <div className="card p-3 bg-[var(--bg)] rounded-[10px] border border-[var(--line)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--ac)] shrink-0" />
                <span className="font-medium text-[var(--ink)] text-xs">Primary Monitored Location</span>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingLocation((prev) => !prev)}
                className="text-[11px] font-semibold text-[var(--ac)] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>{isChangingLocation ? 'Done' : 'Change Location'}</span>
                {isChangingLocation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Current Active Location Display */}
            <div className="p-2.5 rounded-[8px] bg-[var(--card)] border border-[var(--line)] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-[var(--ink)] truncate text-xs">{selectedLocation.name}</div>
                <div className="text-[10px] text-[var(--mut)] truncate">
                  {selectedLocation.city} • [{selectedLocation.coordinates[0].toFixed(2)}°N, {selectedLocation.coordinates[1].toFixed(2)}°E]
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--ac)]/10 text-[var(--ac)] border border-[var(--ac)]/25 shrink-0 font-medium">
                Active Zone
              </span>
            </div>

            {/* Expanding Custom Location Search & GPS Selector */}
            {isChangingLocation && (
              <div className="pt-2 border-t border-[var(--line)] space-y-2.5 animate-in fade-in duration-150">
                {/* GPS Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleUseBrowserGPS}
                  disabled={isDetectingGps}
                  className="w-full py-1.5 px-3 rounded-[6px] border border-[var(--ac)]/30 bg-[var(--ac)]/10 hover:bg-[var(--ac)]/20 text-[var(--ac)] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isDetectingGps ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting Satellite Coordinates...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5" />
                      <span>Use My Exact Device GPS Location</span>
                    </>
                  )}
                </button>

                {/* Search Any City / Address Worldwide */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--mut)]" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Search any town, colony, sector, or city worldwide..."
                    className="pl-8 bg-[var(--card)] border-[var(--line)] h-8 text-xs rounded-[6px]"
                  />
                  {isSearching && (
                    <Loader2 className="w-3 h-3 animate-spin absolute right-2.5 top-2.5 text-[var(--ac)]" />
                  )}
                </div>

                {/* Search Results Dropdown List */}
                {searchResults.length > 0 && (
                  <div className="space-y-1 max-h-36 overflow-y-auto border border-[var(--line)] rounded-[6px] p-1 bg-[var(--card)] shadow-xs">
                    {searchResults.map((res) => {
                      const isCurrent = selectedLocation.id === res.id || selectedLocation.name === res.name;
                      return (
                        <button
                          key={res.id}
                          type="button"
                          onClick={() => {
                            setSelectedLocation(res);
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                          className={cn(
                            "w-full text-left p-2 rounded-[6px] border text-xs transition-all flex items-center justify-between cursor-pointer",
                            isCurrent
                              ? "bg-[var(--ac)]/10 border-[var(--ac)] text-[var(--ink)]"
                              : "bg-[var(--bg)] border-[var(--line)] hover:border-[var(--ac)]/50 text-[var(--ink)]"
                          )}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-medium truncate">{res.name}</div>
                            <div className="text-[10px] text-[var(--mut)] truncate">{res.city}</div>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Popular Station Presets */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mut)] mb-1.5 px-0.5">
                    Popular Hubs
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {LOCATION_PRESETS.map((preset) => {
                      const isCurrent = selectedLocation.id === preset.id || selectedLocation.name === preset.name;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedLocation(preset)}
                          className={cn(
                            "text-[11px] px-2.5 py-1 rounded-[6px] border transition-all cursor-pointer font-medium flex items-center gap-1",
                            isCurrent
                              ? "bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs font-semibold"
                              : "bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--mut)]/60"
                          )}
                        >
                          {isCurrent && <Check className="w-3 h-3" />}
                          <span>{preset.city}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Health Conditions / Health Problem */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-[var(--ink)] flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-[var(--ac)]" />
                Respiratory / Health Conditions
              </Label>
              {/* Dedicated Quick 'None' Button */}
              <button
                type="button"
                onClick={() => handleSelectCondition('None')}
                className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 font-medium ${
                  isNoneSelected
                    ? 'bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs font-semibold'
                    : 'bg-[var(--bg)] text-[var(--mut)] hover:text-[var(--ink)] border-[var(--line)]'
                }`}
                title="Select None if you have no pre-existing respiratory or health conditions"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>None (Healthy)</span>
              </button>
            </div>

            {/* Quick condition selector pills */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {COMMON_CONDITIONS.map((cond) => {
                const isSelected =
                  cond === 'None'
                    ? isNoneSelected
                    : !isNoneSelected &&
                      health
                        .split(',')
                        .map((s) => s.trim().toLowerCase())
                        .includes(cond.toLowerCase());

                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleSelectCondition(cond)}
                    className={`text-[11px] px-2.5 py-1 rounded-[6px] border transition-all cursor-pointer font-medium ${
                      isSelected
                        ? 'bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs font-semibold'
                        : 'bg-[var(--bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--mut)]/60'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {cond}
                  </button>
                );
              })}
            </div>

            {/* Editable input field */}
            <Input
              type="text"
              value={health}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHealth(e.target.value)}
              placeholder="e.g. None, Mild Asthma, Allergies..."
              className="bg-[var(--card)] border-[var(--line)] h-9 text-xs rounded-[8px] focus-visible:ring-[var(--ac)]"
            />
            
            <p className="text-[11px] text-[var(--mut)]">
              {isNoneSelected ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Standard baseline: No respiratory conditions recorded.
                </span>
              ) : (
                <span>
                  Alerts and inhalation vulnerability scores will be calibrated for your selected conditions.
                </span>
              )}
            </p>
          </div>

          {/* Vulnerability Sensitivity */}
          <div className="space-y-1.5">
            <Label className="font-medium text-[var(--ink)]">Vulnerability Sensitivity</Label>
            <select
              value={sensitivity}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSensitivity(e.target.value as any)}
              className="flex h-9 w-full rounded-[8px] border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ac)]"
            >
              <option value="normal">Normal (Standard healthy adult)</option>
              <option value="sensitive">Sensitive (Prone to throat / ocular irritation)</option>
              <option value="high_risk">High Risk (Asthmatic, cardiovascular or elderly)</option>
            </select>
          </div>

          {/* WAQI Ground Station Feed (aqicn.org) */}
          <div className="card p-3.5 bg-[var(--bg)] rounded-[10px] border border-[var(--line)]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-medium text-[var(--ink)]">
                <Radio className="w-3.5 h-3.5 text-[var(--ac)]" />
                <span className="font-display text-xs">WAQI Ground Station API Token (aqicn.org)</span>
              </div>
              <a
                href="https://aqicn.org/data-platform/token/"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[var(--ac)] hover:underline font-medium"
              >
                Get Free Token ↗
              </a>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[var(--mut)] mb-2.5">
              <span>Direct CPCB/DPCC physical sensor stream (matches Google AQI).</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live CPCB Feed Active
              </span>
            </div>
            <Input
              type="password"
              value={waqiInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaqiInput(e.target.value)}
              placeholder="Pre-configured (Enter custom WAQI token to override)..."
              className="bg-[var(--card)] border-[var(--line)] h-8 font-mono text-xs rounded-[8px]"
            />
          </div>

          {/* Gemini API Key */}
          <div className="card p-3.5 bg-[var(--bg)] rounded-[10px] border border-[var(--line)]">
            <div className="flex items-center gap-2 font-medium text-[var(--ink)] mb-1">
              <Key className="w-3.5 h-3.5 text-[var(--ac)]" />
              <span className="font-display text-xs">Google Gemini API Key (Optional)</span>
            </div>
            <p className="text-[11px] text-[var(--mut)] mb-2.5">
              Leave blank to employ the onboard autonomous rule synthesis model.
            </p>
            <Input
              type="password"
              value={keyInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="bg-[var(--card)] border-[var(--line)] h-8 font-mono text-xs rounded-[8px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-[var(--line)] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[var(--mut)]">
            {isFirstTime ? 'You can always update this in Settings.' : ''}
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-xs h-8 px-3 rounded-[8px]"
            >
              {isFirstTime ? 'Skip for Now' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="text-xs font-semibold h-8 px-4 rounded-[8px]"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {isFirstTime ? 'Save & Continue' : 'Save Profile'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
