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
  const { userProfile, setUserProfile, apiKey, setApiKey, currentLocation, setLocation } = useAirGuard();

  const [name, setName] = useState(userProfile.name || '');
  const [age, setAge] = useState<number | string>(userProfile.age || 26);
  const [health, setHealth] = useState(
    userProfile.healthConditions && userProfile.healthConditions.length > 0
      ? userProfile.healthConditions.join(', ')
      : 'None'
  );
  const [sensitivity, setSensitivity] = useState(userProfile.sensitivityLevel || 'normal');
  const [keyInput, setKeyInput] = useState(apiKey || '');
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
      // Suggest sensitive or high risk if conditions exist
      if (sensitivity === 'normal') {
        setSensitivity(
          condition.toLowerCase().includes('severe') || condition.toLowerCase().includes('copd') || condition.toLowerCase().includes('cardio')
            ? 'high_risk'
            : 'sensitive'
        );
      }
    }
  };

  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const detectedLoc: LocationPreset = {
            id: `gps-${Date.now()}`,
            name: `My Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
            city: 'Live Device GPS',
            state: 'India',
            coordinates: [lat, lon],
            baseAqi: 180,
            basePm25: 75,
            basePm10: 110,
            temperature: 28,
            humidity: 55,
            description: 'Accurate real-time GPS coordinates directly from your device browser.',
          };
          setSelectedLocation(detectedLoc);
          setIsDetectingGps(false);
        },
        (err) => {
          console.warn('GPS detection error, falling back:', err);
          setIsDetectingGps(false);
          setSelectedLocation(LOCATION_PRESETS[0]);
        },
        { timeout: 7000 }
      );
    } else {
      setIsDetectingGps(false);
      setSelectedLocation(LOCATION_PRESETS[0]);
    }
  };

  const handleSave = () => {
    const parsedConditions = isNoneSelected
      ? ['None']
      : health
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
                Customize physiological factors, location & Gemini credentials
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
              <Label className="font-medium text-[var(--ink)]">Age</Label>
              <Input
                type="number"
                min={1}
                max={120}
                value={age}
                placeholder="26"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                className="bg-[var(--card)] border-[var(--line)] h-9 text-xs rounded-[8px] focus-visible:ring-[var(--ac)]"
              />
            </div>
          </div>

          {/* Location / Telemetry Station Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-[var(--ink)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--ac)]" />
                City / Air Quality Station
              </Label>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--line)] hover:border-[var(--ac)]/60 bg-[var(--bg)] text-[var(--ink)] transition-all cursor-pointer flex items-center gap-1 font-medium shadow-2xs hover:bg-[var(--card)]"
                title="Acquire coordinates directly from your device GPS"
              >
                <Compass className={cn("w-3 h-3 text-[var(--ac)]", isDetectingGps && "animate-spin")} />
                <span>{isDetectingGps ? 'Locating...' : 'Use Device GPS'}</span>
              </button>
            </div>

            {/* Active Selected Location Display Card */}
            <div className="card p-2.5 bg-[var(--bg)] border border-[var(--line)] rounded-[9px] flex items-center justify-between gap-2.5">
              <div className="min-w-0 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[7px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center shrink-0 border border-[var(--ac)]/20 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-[var(--ink)] truncate">
                      {selectedLocation.name}
                    </span>
                    <span className="text-[10px] text-[var(--ac)] bg-[var(--ac)]/10 px-1.5 py-0.2 rounded font-medium border border-[var(--ac)]/20 shrink-0">
                      Selected
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--mut)] truncate">
                    {selectedLocation.city} • [{selectedLocation.coordinates[0].toFixed(2)}°, {selectedLocation.coordinates[1].toFixed(2)}°]
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingLocation(!isChangingLocation)}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-[6px] border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--bg)] text-[var(--ink)] hover:text-[var(--ac)] transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{isChangingLocation ? 'Done' : 'Change Location'}</span>
                {isChangingLocation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Expandable Location Selector (Presets & Search) */}
            {isChangingLocation && (
              <div className="space-y-2.5 p-3 bg-[var(--card)] rounded-[9px] border border-[var(--line)] animate-in fade-in duration-150">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--mut)] absolute left-2.5 top-2.5" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Search any global city or station (e.g. Pune, London, Delhi)..."
                    className="pl-8 pr-8 h-8 text-xs bg-[var(--bg)] border-[var(--line)] rounded-[7px] focus-visible:ring-[var(--ac)]"
                  />
                  {isSearching && (
                    <Loader2 className="w-3.5 h-3.5 text-[var(--ac)] absolute right-2.5 top-2.5 animate-spin" />
                  )}
                </div>

                {/* Search Results Dropdown/List */}
                {searchResults.length > 0 && (
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1 custom-scrollbar pt-1">
                    <div className="text-[10px] font-semibold uppercase text-[var(--mut)] px-1">
                      Search Matches ({searchResults.length})
                    </div>
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
                        ? cond === 'None'
                          ? 'bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs font-semibold'
                          : 'bg-[var(--ac)] text-[var(--onac)] border-[var(--ac)] shadow-2xs font-semibold'
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
                <span className="text-[var(--ok)] font-medium">
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
