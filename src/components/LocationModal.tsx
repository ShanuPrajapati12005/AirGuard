import React, { useState, useEffect } from 'react';
import { MapPin, Search, Check, Compass, X, Loader2 } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { LOCATION_PRESETS } from '../data/mockData';
import { LocationPreset } from '../types';
import { searchLocationsOnline } from '../services/weatherApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { currentLocation, setLocation } = useAirGuard();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationPreset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Debounced search with Open-Meteo Geocoding
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
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelect = async (loc: LocationPreset) => {
    setIsApplying(true);
    try {
      await setLocation(loc);
      onClose();
    } finally {
      setIsApplying(false);
    }
  };

  const handleDetectGPS = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
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
          await handleSelect(detectedLoc);
          setIsDetecting(false);
        },
        (err) => {
          console.warn('GPS error, falling back:', err);
          setIsDetecting(false);
          handleSelect(LOCATION_PRESETS[0]);
        },
        { timeout: 7000 }
      );
    } else {
      setIsDetecting(false);
      handleSelect(LOCATION_PRESETS[0]);
    }
  };

  const displayedLocations = searchResults.length > 0 ? searchResults : LOCATION_PRESETS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="card bg-[var(--card)] rounded-[12px] max-w-lg w-full p-6 shadow-xl border border-[var(--line)] flex flex-col max-h-[85vh] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 font-bold shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-medium text-[var(--ink)] tracking-tight">
                Select Telemetry Station
              </h3>
              <p className="text-xs text-[var(--mut)] mt-0.5">
                Query global meteorological stations or resolve device coordinates
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[var(--mut)] hover:text-[var(--ink)] rounded-[8px] h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar + GPS */}
        <div className="mt-4 space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--mut)] absolute left-3 top-3" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search station (e.g. Pune, London, Delhi, Tokyo)..."
              className="w-full pl-9 pr-9 py-2 bg-[var(--bg)] border-[var(--line)] h-9 rounded-[8px] text-xs text-[var(--ink)] focus-visible:ring-[var(--ac)]"
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 text-[var(--ac)] absolute right-3 top-3 animate-spin" />
            )}
          </div>

          <Button
            onClick={handleDetectGPS}
            disabled={isDetecting || isApplying}
            className="w-full h-9 bg-[var(--bg)] hover:bg-[var(--card)] text-[var(--ink)] border border-[var(--line)] rounded-[8px] text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-2xs"
            variant="outline"
          >
            <Compass className={cn("w-3.5 h-3.5 text-[var(--ac)]", isDetecting && "animate-spin")} />
            <span>{isDetecting ? 'Resolving device coordinates...' : 'Acquire Current Device GPS'}</span>
          </Button>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1 custom-scrollbar">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--mut)] mb-1 px-1">
            <span>{searchResults.length > 0 ? `Results (${searchResults.length})` : 'Preset Meteorological Hubs'}</span>
            {isApplying && (
              <span className="text-[var(--ac)] font-medium normal-case flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                Connecting stream...
              </span>
            )}
          </div>

          {displayedLocations.map((loc) => {
            const isSelected = currentLocation.name.includes(loc.name);
            return (
              <div
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className={cn(
                  "card p-3 transition-all cursor-pointer flex items-center justify-between shadow-2xs",
                  isSelected
                    ? "border-[var(--ac)] bg-[var(--ac)]/5"
                    : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--ac)]/40 hover:bg-[var(--bg)]"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-medium text-[var(--ink)]">{loc.name}</span>
                    <span className="text-[10px] font-mono text-[var(--mut)] bg-[var(--bg)] px-1.5 py-0.2 rounded border border-[var(--line)]">
                      {loc.city}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--mut)] mt-1 line-clamp-1">
                    {loc.description || `Coordinates: ${loc.coordinates[0].toFixed(2)}, ${loc.coordinates[1].toFixed(2)}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--ac)] text-[var(--onac)] flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
