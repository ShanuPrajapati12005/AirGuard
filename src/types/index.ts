export type ScenarioType = 
  | 'normal' 
  | 'high_pollution' 
  | 'rush_hour' 
  | 'school_alert' 
  | 'industrial_plume';

export type AQICategory = 
  | 'good' 
  | 'satisfactory' 
  | 'moderate' 
  | 'poor' 
  | 'verypoor' 
  | 'severe';

export interface AirQualityData {
  aqi: number;
  category: AQICategory;
  categoryLabel: string;
  categoryColor: string;
  categoryBg: string;
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number;  // µg/m³
  o3: number;   // µg/m³
  so2: number;  // µg/m³
  co: number;   // mg/m³
  temperature: number; // °C
  humidity: number;    // %
  windSpeed: number;   // km/h
  windDirection: string;
  updatedAt: string;
  locationName: string;
  indoorPm25: number;
  indoorCategory: string;
  coordinates?: [number, number];
  stationName?: string;
  provider?: 'waqi' | 'cpcb_calibrated';
}

export interface LocationPreset {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates: [number, number];
  baseAqi: number;
  basePm25: number;
  basePm10: number;
  temperature: number;
  humidity: number;
  description: string;
}

export interface UserProfile {
  name: string;
  age: number;
  healthConditions: string[]; // e.g. "Asthma", "Heart Condition", "None"
  commuteMode: 'walking' | 'cycling' | 'metro' | 'driving';
  sensitivityLevel: 'normal' | 'sensitive' | 'high_risk';
  dailyOutdoorGoalMinutes: number;
  location?: string;
}

export interface ActivityRiskEstimate {
  activity: string;
  durationMinutes: number;
  exposureScore: number; // 0-100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  multiplier: number;
  advice: string;
}

export interface RouteOption {
  id: string;
  name: string;
  tag: string;
  durationMinutes: number;
  distanceKm: number;
  exposureScore: number;
  exposureLevel: 'LOW' | 'LOWER' | 'MODERATE' | 'HIGH';
  exposureColor: string;
  trafficIntensity: 'light' | 'moderate' | 'heavy';
  description: string;
  isRecommended: boolean;
  coordinates: [number, number][]; // Lat, Lng points
}

export interface Hotspot {
  id: string;
  name: string;
  type: 'highway' | 'industrial' | 'school' | 'market' | 'residential' | 'park';
  aqi: number;
  deltaText: string;
  pm25: number;
  coordinates: [number, number];
  description: string;
  alert?: string;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  aqi: number;
  pm25: number;
  level: string;
  color: string;
  recommended: boolean;
}

export interface TimelineEvent {
  time: string;
  location: string;
  icon: string;
  exposure: 'Low' | 'Moderate' | 'High' | 'Very High';
  duration: string;
  aqiEncountered: number;
}

export interface WeeklySummary {
  avgAqi: number;
  avgExposureScore: number;
  outdoorHours: string;
  highExposureHours: string;
  bestDay: string;
  worstDay: string;
  streakDays: number;
  daysData: { day: string; aqi: number; exposureScore: number }[];
}

export interface SensorReading {
  deviceId: string;
  deviceName: string;
  isOnline: boolean;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  co2: number;
  batteryLevel: number;
  lastUpdatedSecondsAgo: number;
  history: { timestamp: string; pm25: number; pm10: number }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  suggestedActions?: string[];
}
