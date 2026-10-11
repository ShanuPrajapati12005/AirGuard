import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AirQualityData,
  ScenarioType,
  UserProfile,
  SensorReading,
  RouteOption,
  Hotspot,
  LocationPreset,
  HourlyForecast,
} from '../types';
import {
  DEFAULT_USER_PROFILE,
  getScenarioData,
  INITIAL_SENSOR,
  SMART_ROUTES,
  DEMO_HOTSPOTS,
  LOCATION_PRESETS,
  HOURLY_FORECASTS,
} from '../data/mockData';
import { fetchLiveAirQuality } from '../services/weatherApi';

interface AirGuardContextType {
  scenario: ScenarioType;
  setScenario: (scenario: ScenarioType) => void;
  currentLocation: LocationPreset;
  setLocation: (loc: LocationPreset) => Promise<void>;
  airData: AirQualityData;
  hourlyForecasts: HourlyForecast[];
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  sensor: SensorReading;
  selectedRoute: RouteOption;
  setSelectedRoute: (route: RouteOption) => void;
  routes: RouteOption[];
  hotspots: Hotspot[];
  selectedHotspot: Hotspot | null;
  setSelectedHotspot: (h: Hotspot | null) => void;
  refreshAirData: () => Promise<void>;
  isRefreshing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  connectSensor: () => void;
}

const AirGuardContext = createContext<AirGuardContextType | undefined>(undefined);

export const AirGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenario, setScenario] = useState<ScenarioType>('normal');
  const [currentLocation, setCurrentLocation] = useState<LocationPreset>(LOCATION_PRESETS[0]);
  const [airData, setAirData] = useState<AirQualityData>(() =>
    getScenarioData('normal', LOCATION_PRESETS[0])
  );
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecast[]>(HOURLY_FORECASTS);
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('airguard_user_profile');
      if (saved) {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse user profile from localStorage:', e);
    }
    return DEFAULT_USER_PROFILE;
  });
  const [sensor, setSensor] = useState<SensorReading>(INITIAL_SENSOR);
  const [routes, setRoutes] = useState<RouteOption[]>(SMART_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(SMART_ROUTES[1]);
  const [hotspots, setHotspots] = useState<Hotspot[]>(DEMO_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem('airguard_gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>> = useCallback((val) => {
    setUserProfileState((prev) => {
      const next = typeof val === 'function' ? (val as (prev: UserProfile) => UserProfile)(prev) : val;
      try {
        localStorage.setItem('airguard_user_profile', JSON.stringify(next));
        localStorage.setItem('airguard_profile_configured', 'true');
      } catch (e) {
        console.warn('Failed to persist user profile:', e);
      }
      return next;
    });
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    try {
      localStorage.setItem('airguard_gemini_api_key', key);
    } catch (e) {
      console.warn('Failed to persist API key:', e);
    }
  }, []);

  // Update location and fetch real live atmospheric data for that coordinate
  const setLocation = useCallback(async (loc: LocationPreset) => {
    setCurrentLocation(loc);
    setIsRefreshing(true);

    try {
      const [lat, lon] = loc.coordinates;
      const live = await fetchLiveAirQuality(lat, lon, `${loc.name}, ${loc.city}`);
      setAirData(live.airData);
      if (live.hourly.length > 0) setHourlyForecasts(live.hourly);
      if (live.hotspots.length > 0) setHotspots(live.hotspots);
      if (live.routes.length > 0) {
        setRoutes(live.routes);
        setSelectedRoute(live.routes[1] || live.routes[0]);
      }
    } catch {
      // Graceful offline fallback with scaled realistic data
      const fallback = getScenarioData(scenario, loc);
      setAirData(fallback);
    } finally {
      setIsRefreshing(false);
    }
  }, [scenario]);

  // Initial fetch for the default location on mount
  useEffect(() => {
    setLocation(LOCATION_PRESETS[0]);
  }, []);

  // When scenario changes manually
  useEffect(() => {
    setAirData(getScenarioData(scenario, currentLocation));
  }, [scenario, currentLocation]);

  // Live simulated hardware sensor fluctuations every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSensor((prev) => {
        if (!prev.isOnline) return prev;
        const delta = (Math.random() - 0.48) * 3;
        const newPm25 = Math.max(15, Math.min(180, Math.round(prev.pm25 + delta)));
        const newPm10 = Math.round(newPm25 * 1.38);
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const newHistory = [
          ...prev.history.slice(-9),
          { timestamp: timeStr, pm25: newPm25, pm10: newPm10 },
        ];

        return {
          ...prev,
          pm25: newPm25,
          pm10: newPm10,
          temperature: +(prev.temperature + (Math.random() - 0.5) * 0.1).toFixed(1),
          humidity: Math.round(prev.humidity + (Math.random() - 0.5) * 0.4),
          lastUpdatedSecondsAgo: Math.floor(Math.random() * 3) + 1,
          history: newHistory,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const refreshAirData = async () => {
    setIsRefreshing(true);
    try {
      const [lat, lon] = currentLocation.coordinates;
      const live = await fetchLiveAirQuality(lat, lon, `${currentLocation.name}, ${currentLocation.city}`);
      setAirData(live.airData);
      if (live.hourly.length > 0) setHourlyForecasts(live.hourly);
    } catch {
      setAirData((prev) => ({
        ...prev,
        updatedAt: 'Just now',
        pm25: prev.pm25 + Math.floor(Math.random() * 3) - 1,
        aqi: prev.aqi + Math.floor(Math.random() * 4) - 2,
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  const connectSensor = () => {
    setSensor((prev) => ({
      ...prev,
      isOnline: !prev.isOnline,
      lastUpdatedSecondsAgo: 1,
    }));
  };

  return (
    <AirGuardContext.Provider
      value={{
        scenario,
        setScenario,
        currentLocation,
        setLocation,
        airData,
        hourlyForecasts,
        userProfile,
        setUserProfile,
        sensor,
        selectedRoute,
        setSelectedRoute,
        routes,
        hotspots,
        selectedHotspot,
        setSelectedHotspot,
        refreshAirData,
        isRefreshing,
        activeTab,
        setActiveTab,
        apiKey,
        setApiKey,
        connectSensor,
      }}
    >
      {children}
    </AirGuardContext.Provider>
  );
};

export const useAirGuard = () => {
  const context = useContext(AirGuardContext);
  if (!context) {
    throw new Error('useAirGuard must be used within an AirGuardProvider');
  }
  return context;
};
