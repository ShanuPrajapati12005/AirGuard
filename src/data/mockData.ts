import {
  AirQualityData,
  Hotspot,
  HourlyForecast,
  RouteOption,
  ScenarioType,
  SensorReading,
  TimelineEvent,
  UserProfile,
  WeeklySummary,
  LocationPreset,
} from '../types';
import { getAQICategory } from '../utils/aqiCalculator';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  age: 26,
  healthConditions: ['None'],
  commuteMode: 'walking',
  sensitivityLevel: 'normal',
  dailyOutdoorGoalMinutes: 60,
};

export const SCENARIO_PRESETS: Record<
  ScenarioType,
  {
    name: string;
    description: string;
    aqi: number;
    pm25: number;
    pm10: number;
    indoorPm25: number;
    alertTitle?: string;
    alertMessage?: string;
  }
> = {
  normal: {
    name: 'Normal Moderate Day',
    description: 'Typical seasonal air with moderate dust and breezy dispersal.',
    aqi: 145,
    pm25: 68,
    pm10: 110,
    indoorPm25: 28,
  },
  high_pollution: {
    name: 'High Pollution Day',
    description: 'Winter smog inversion, high particulate accumulation.',
    aqi: 276,
    pm25: 142,
    pm10: 188,
    indoorPm25: 54,
    alertTitle: '⚠️ HIGH POLLUTION ALERT',
    alertMessage: 'AQI crossed 250 (Unhealthy). Consider reducing non-essential outdoor exertion.',
  },
  rush_hour: {
    name: 'Traffic Rush Hour',
    description: 'Heavy vehicular congestion along major highway arterial corridors.',
    aqi: 312,
    pm25: 168,
    pm10: 220,
    indoorPm25: 58,
    alertTitle: '🚗 PEAK TRAFFIC EMISSION',
    alertMessage: 'Nitrogen dioxide and particulate spikes along arterial highways.',
  },
  school_alert: {
    name: 'School Safety Alert',
    description: 'Morning temperature inversion creating dense smog over educational campus zones.',
    aqi: 328,
    pm25: 178,
    pm10: 240,
    indoorPm25: 62,
    alertTitle: '🏫 CAMPUS EMERGENCY NOTICE',
    alertMessage: 'Outdoor assembly and sports should be moved indoors immediately.',
  },
  industrial_plume: {
    name: 'Industrial Smog Spike',
    description: 'Localized industrial plume downwind of manufacturing clusters.',
    aqi: 384,
    pm25: 225,
    pm10: 295,
    indoorPm25: 75,
    alertTitle: '🏭 INDUSTRIAL POLLUTION WARNING',
    alertMessage: 'Very high particulate density with elevated sulfur oxides detected.',
  },
};

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'noida-sec62',
    name: 'Sector 62, Noida',
    city: 'Noida / NCR',
    state: 'Uttar Pradesh',
    coordinates: [28.629, 77.368],
    baseAqi: 276,
    basePm25: 142,
    basePm10: 188,
    temperature: 28,
    humidity: 58,
    description: 'IT hub and highway transit junction with dense commercial traffic.',
  },
  {
    id: 'delhi-cp',
    name: 'Connaught Place, Central Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    coordinates: [28.6315, 77.2167],
    baseAqi: 318,
    basePm25: 165,
    basePm10: 228,
    temperature: 29,
    humidity: 52,
    description: 'Dense commercial hub with heavy vehicular congestion and inner ring road emissions.',
  },
  {
    id: 'gurugram-cybercity',
    name: 'Cyber City, Gurugram',
    city: 'Gurugram / NCR',
    state: 'Haryana',
    coordinates: [28.4952, 77.0891],
    baseAqi: 254,
    basePm25: 130,
    basePm10: 175,
    temperature: 30,
    humidity: 49,
    description: 'Corporate business district flanked by NH-48 expressway arterial traffic.',
  },
  {
    id: 'mumbai-bkc',
    name: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    state: 'Maharashtra',
    coordinates: [19.0662, 72.8687],
    baseAqi: 138,
    basePm25: 62,
    basePm10: 105,
    temperature: 32,
    humidity: 78,
    description: 'Coastal financial business hub tempered by Arabian Sea sea-breeze circulation.',
  },
  {
    id: 'bengaluru-indiranagar',
    name: 'Indiranagar / Whitefield corridor',
    city: 'Bengaluru',
    state: 'Karnataka',
    coordinates: [12.9784, 77.6408],
    baseAqi: 82,
    basePm25: 38,
    basePm10: 64,
    temperature: 24,
    humidity: 65,
    description: 'Elevated plateau with lush tree canopy and steady westerly ventilation.',
  },
  {
    id: 'kolkata-parkstreet',
    name: 'Park Street / Victoria',
    city: 'Kolkata',
    state: 'West Bengal',
    coordinates: [22.5516, 78.3512],
    baseAqi: 220,
    basePm25: 115,
    basePm10: 160,
    temperature: 29,
    humidity: 72,
    description: 'Historic urban center with slow vehicular disperse and river delta moisture.',
  },
];

export function getScenarioData(
  scenario: ScenarioType,
  location: LocationPreset = LOCATION_PRESETS[0]
): AirQualityData {
  const preset = SCENARIO_PRESETS[scenario];
  
  // Scale AQI based on the location ratio compared to Noida base
  const locationRatio = location.baseAqi / 276;
  const computedAqi = Math.max(25, Math.min(490, Math.round(preset.aqi * locationRatio)));
  const computedPm25 = Math.max(12, Math.round(preset.pm25 * locationRatio));
  const computedPm10 = Math.max(18, Math.round(preset.pm10 * locationRatio));
  const computedIndoor = Math.max(10, Math.round(preset.indoorPm25 * Math.min(locationRatio, 1.2)));

  const cat = getAQICategory(computedAqi);

  return {
    aqi: computedAqi,
    category: cat.category,
    categoryLabel: cat.label,
    categoryColor: cat.color,
    categoryBg: cat.bgColor,
    pm25: computedPm25,
    pm10: computedPm10,
    no2: Math.round(computedAqi * 0.18),
    o3: 32,
    so2: Math.round(computedAqi * 0.08),
    co: +(1.4 * locationRatio).toFixed(1),
    temperature: location.temperature,
    humidity: location.humidity,
    windSpeed: 8,
    windDirection: 'NW (310°)',
    updatedAt: 'Just now',
    locationName: `${location.name}, ${location.city}, India`,
    coordinates: location.coordinates,
    indoorPm25: computedIndoor,
    indoorCategory: computedIndoor < 35 ? 'Good' : 'Moderate',
  };
}

export const HOURLY_FORECASTS: HourlyForecast[] = [
  { time: '05 AM', hour: 5, aqi: 75, pm25: 35, level: 'Good', color: '#10b981', recommended: true },
  { time: '06 AM', hour: 6, aqi: 82, pm25: 38, level: 'Good', color: '#10b981', recommended: true },
  { time: '07 AM', hour: 7, aqi: 98, pm25: 45, level: 'Satisfactory', color: '#84cc16', recommended: true },
  { time: '08 AM', hour: 8, aqi: 165, pm25: 78, level: 'Moderate', color: '#f59e0b', recommended: false },
  { time: '09 AM', hour: 9, aqi: 245, pm25: 120, level: 'Poor', color: '#f97316', recommended: false },
  { time: '10 AM', hour: 10, aqi: 285, pm25: 148, level: 'Poor', color: '#f97316', recommended: false },
  { time: '11 AM', hour: 11, aqi: 310, pm25: 165, level: 'Very Poor', color: '#ef4444', recommended: false },
  { time: '12 PM', hour: 12, aqi: 275, pm25: 139, level: 'Poor', color: '#f97316', recommended: false },
  { time: '01 PM', hour: 13, aqi: 215, pm25: 105, level: 'Poor', color: '#f97316', recommended: false },
  { time: '02 PM', hour: 14, aqi: 190, pm25: 92, level: 'Moderate', color: '#f59e0b', recommended: false },
  { time: '03 PM', hour: 15, aqi: 180, pm25: 86, level: 'Moderate', color: '#f59e0b', recommended: false },
  { time: '04 PM', hour: 16, aqi: 220, pm25: 110, level: 'Poor', color: '#f97316', recommended: false },
  { time: '05 PM', hour: 17, aqi: 290, pm25: 155, level: 'Poor', color: '#ef4444', recommended: false },
  { time: '06 PM', hour: 18, aqi: 315, pm25: 170, level: 'Very Poor', color: '#ef4444', recommended: false },
  { time: '07 PM', hour: 19, aqi: 260, pm25: 135, level: 'Poor', color: '#f97316', recommended: false },
  { time: '08 PM', hour: 20, aqi: 210, pm25: 102, level: 'Poor', color: '#f97316', recommended: false },
];

export const DEMO_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs-1',
    name: 'NH-91 Highway Junction',
    type: 'highway',
    aqi: 342,
    deltaText: '+18% vs surrounding area',
    pm25: 185,
    coordinates: [28.625, 77.375],
    description: 'Heavy truck diesel exhaust corridor & arterial bottleneck.',
    alert: 'Peak congestion warning',
  },
  {
    id: 'hs-2',
    name: 'Industrial Zone Phase-III',
    type: 'industrial',
    aqi: 318,
    deltaText: '+24% SO2 and PM10',
    pm25: 168,
    coordinates: [28.618, 77.39],
    description: 'Electroplating, casting, and logistics warehouses with heavy particulate load.',
  },
  {
    id: 'hs-3',
    name: 'Main Market & Bus Terminal',
    type: 'market',
    aqi: 286,
    deltaText: 'High street canyon accumulation',
    pm25: 145,
    coordinates: [28.632, 77.362],
    description: 'Dense commercial street market with idling buses and auto-rickshaws.',
  },
  {
    id: 'hs-4',
    name: 'University & School Campus Area',
    type: 'school',
    aqi: 241,
    deltaText: 'Morning inversion hotspot',
    pm25: 122,
    coordinates: [28.638, 77.368],
    description: 'Campus grounds vulnerable during morning assembly & sports hours.',
  },
  {
    id: 'hs-5',
    name: 'City Green Botanical Park',
    type: 'park',
    aqi: 135,
    deltaText: '-45% lower than highway',
    pm25: 58,
    coordinates: [28.629, 77.355],
    description: 'Dense canopy buffer zone providing clean air sanctuary.',
  },
  {
    id: 'hs-6',
    name: 'Greenwoods Residential Sector',
    type: 'residential',
    aqi: 160,
    deltaText: 'Moderate filtered air',
    pm25: 72,
    coordinates: [28.635, 77.348],
    description: 'Gated enclave with tree-lined streets away from main arterial transit.',
  },
];

export const SMART_ROUTES: RouteOption[] = [
  {
    id: 'route-fastest',
    name: 'Route A: Expressway Corridor',
    tag: 'FASTEST ROUTE',
    durationMinutes: 20,
    distanceKm: 8.0,
    exposureScore: 82,
    exposureLevel: 'HIGH',
    exposureColor: '#ef4444',
    trafficIntensity: 'heavy',
    description: 'Direct along highway with heavy diesel traffic, high PM2.5 and idling fumes.',
    isRecommended: false,
    coordinates: [
      [28.628, 77.358],
      [28.626, 77.366],
      [28.624, 77.375],
      [28.638, 77.368],
    ],
  },
  {
    id: 'route-clean',
    name: 'Route B: Green Park Canopy',
    tag: 'LOW-EXPOSURE ROUTE ⭐',
    durationMinutes: 24,
    distanceKm: 7.5,
    exposureScore: 42,
    exposureLevel: 'LOWER',
    exposureColor: '#10b981',
    trafficIntensity: 'light',
    description: 'Bypasses major junction through green belt residential roads. Cuts inhalation by 48%.',
    isRecommended: true,
    coordinates: [
      [28.628, 77.358],
      [28.631, 77.354],
      [28.635, 77.360],
      [28.638, 77.368],
    ],
  },
];

export const DAILY_TIMELINE: TimelineEvent[] = [
  { time: '07:00 AM', location: 'Home (Indoor with purifier)', icon: '🏠', exposure: 'Low', duration: '1h 30m', aqiEncountered: 48 },
  { time: '08:30 AM', location: 'Morning Commute (Expressway)', icon: '🚶', exposure: 'High', duration: '35m', aqiEncountered: 295 },
  { time: '09:15 AM', location: 'College / Office Lab', icon: '🏫', exposure: 'Moderate', duration: '3h 45m', aqiEncountered: 120 },
  { time: '01:00 PM', location: 'Campus Cafeteria & Garden', icon: '🥗', exposure: 'Low', duration: '45m', aqiEncountered: 95 },
  { time: '02:00 PM', location: 'Classroom & Library', icon: '📚', exposure: 'Low', duration: '3h 00m', aqiEncountered: 88 },
  { time: '05:30 PM', location: 'Evening Commute (Rush Hour)', icon: '🚗', exposure: 'Very High', duration: '45m', aqiEncountered: 320 },
  { time: '07:00 PM', location: 'Home Enclave & Balcony', icon: '🏠', exposure: 'Moderate', duration: '2h 00m', aqiEncountered: 160 },
];

export const WEEKLY_DATA: WeeklySummary = {
  avgAqi: 218,
  avgExposureScore: 64,
  outdoorHours: '16h 42m',
  highExposureHours: '3h 12m',
  bestDay: 'Sunday (Clean rain wash)',
  worstDay: 'Thursday (Winter inversion)',
  streakDays: 5,
  daysData: [
    { day: 'Mon', aqi: 240, exposureScore: 70 },
    { day: 'Tue', aqi: 285, exposureScore: 78 },
    { day: 'Wed', aqi: 210, exposureScore: 62 },
    { day: 'Thu', aqi: 310, exposureScore: 84 },
    { day: 'Fri', aqi: 276, exposureScore: 72 },
    { day: 'Sat', aqi: 150, exposureScore: 48 },
    { day: 'Sun', aqi: 110, exposureScore: 34 },
  ],
};

export const INITIAL_SENSOR: SensorReading = {
  deviceId: 'AirGuard-ESP32-V2',
  deviceName: 'AirGuard Node 04 (Living Room)',
  isOnline: true,
  pm25: 54,
  pm10: 78,
  temperature: 26.5,
  humidity: 52,
  co2: 640,
  batteryLevel: 94,
  lastUpdatedSecondsAgo: 4,
  history: [
    { timestamp: '13:20', pm25: 52, pm10: 76 },
    { timestamp: '13:21', pm25: 53, pm10: 77 },
    { timestamp: '13:22', pm25: 55, pm10: 79 },
    { timestamp: '13:23', pm25: 56, pm10: 80 },
    { timestamp: '13:24', pm25: 54, pm10: 78 },
  ],
};
