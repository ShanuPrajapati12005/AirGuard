import React, { useState, useEffect } from 'react';
import { MapPin, Search, Check, Compass, X, Loader2, Navigation } from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { LOCATION_PRESETS } from '../data/mockData';
import { LocationPreset } from '../types';
import { searchLocationsOnline } from '../services/weatherApi';
import { Card } from '@/components/ui/card';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-bold shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Change Active Location</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Search any city worldwide or pick a live monitoring zone
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar + GPS */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search any city (e.g. Pune, Jaipur, London, New York)..."
              className="w-full pl-9 pr-9 py-2 bg-slate-50 border-slate-200 h-10 rounded-xl text-xs text-slate-800 font-medium focus-visible:ring-emerald-500/30 shadow-inner"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3 animate-spin" />
            )}
          </div>

          <Button
            onClick={handleDetectGPS}
            disabled={isDetecting || isApplying}
            className="w-full h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            variant="outline"
          >
            <Compass className={cn("w-4 h-4 text-emerald-600", isDetecting && "animate-spin")} />
            <span>{isDetecting ? 'Detecting device GPS coordinates...' : 'Use My Current Device GPS Location'}</span>
          </Button>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto mt-5 space-y-2.5 pr-2 custom-scrollbar">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            <span>{searchResults.length > 0 ? `Search Results (${searchResults.length})` : 'Popular Monitoring Zones'}</span>
            {isApplying && <span className="text-emerald-600 font-semibold normal-case flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin"/>Fetching live telemetry...</span>}
          </div>

          {displayedLocations.map((loc) => {
            const isSelected = currentLocation.name.includes(loc.name);
            return (
              <div
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className={cn(
                  "p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group",
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{loc.name}</span>
                    <span className="text-[11px] font-medium text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-100 shadow-xs">{loc.city}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1 font-medium">
                    {loc.description || `Coordinates: ${loc.coordinates[0].toFixed(2)}, ${loc.coordinates[1].toFixed(2)}`}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
