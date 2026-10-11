import { AQICategory, UserProfile } from '../types';

/**
 * Categorizes AQI using Indian National Air Quality Index (NAQI) standards.
 */
export function getAQICategory(aqi: number): {
  category: AQICategory;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
} {
  if (aqi <= 50) {
    return {
      category: 'good',
      label: 'GOOD',
      color: '#10b981',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'Minimal impact. Clean fresh air.',
    };
  } else if (aqi <= 100) {
    return {
      category: 'satisfactory',
      label: 'SATISFACTORY',
      color: '#84cc16',
      bgColor: 'bg-lime-50',
      borderColor: 'border-lime-200',
      textColor: 'text-lime-700',
      description: 'Minor breathing discomfort to sensitive people.',
    };
  } else if (aqi <= 200) {
    return {
      category: 'moderate',
      label: 'MODERATE',
      color: '#f59e0b',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'Breathing discomfort to the people with lungs, asthma and heart diseases.',
    };
  } else if (aqi <= 300) {
    return {
      category: 'poor',
      label: 'POOR',
      color: '#f97316',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      description: 'Breathing discomfort to most people on prolonged exposure.',
    };
  } else if (aqi <= 400) {
    return {
      category: 'verypoor',
      label: 'VERY POOR',
      color: '#ef4444',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700',
      description: 'Respiratory illness on prolonged exposure. Pronounced effect on vulnerable people.',
    };
  } else {
    return {
      category: 'severe',
      label: 'SEVERE',
      color: '#8b5cf6',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'Affects healthy people and seriously impacts those with existing diseases.',
    };
  }
}

/**
 * Activity Multipliers according to AirGuard Demo Exposure Model
 */
export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  'Sitting': 0.5,
  'Walking': 1.0,
  'Cycling': 1.5,
  'Running': 2.0,
  'Outdoor Sports': 2.2,
  'Commuting': 1.2,
};

/**
 * Calculates personal pollution exposure score (0 - 100)
 * Exposure Score = Pollution Factor × Duration Factor × Activity Factor × Vulnerability Factor
 */
export function calculateExposureScore(
  aqi: number,
  durationMinutes: number,
  activity: string,
  userProfile?: UserProfile
): {
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  color: string;
  explanation: string;
} {
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activity] || 1.0;
  
  // Base pollution factor (normalized around 200 AQI)
  const pollutionFactor = Math.min(aqi / 200, 2.5);

  // Duration factor (normalized around 60 minutes)
  const durationFactor = Math.min(durationMinutes / 60, 2.0);

  // Vulnerability factor based on user profile (age, asthma, sensitivity)
  let vulnerabilityMultiplier = 1.0;
  if (userProfile) {
    if (userProfile.age < 12 || userProfile.age > 60) vulnerabilityMultiplier += 0.25;
    if (
      userProfile.healthConditions &&
      userProfile.healthConditions.length > 0 &&
      userProfile.healthConditions.some((c) => c && c.trim().toLowerCase() !== 'none')
    ) {
      vulnerabilityMultiplier += 0.35;
    }
    if (userProfile.sensitivityLevel === 'high_risk') vulnerabilityMultiplier += 0.2;
    if (userProfile.sensitivityLevel === 'sensitive') vulnerabilityMultiplier += 0.1;
  }

  // AirGuard Demo Exposure Model Formula
  const rawScore = pollutionFactor * durationFactor * activityMultiplier * vulnerabilityMultiplier * 25;
  const score = Math.min(Math.round(rawScore), 100);

  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  let color = '#10b981';

  if (score > 75) {
    level = 'CRITICAL';
    color = '#ef4444';
  } else if (score > 55) {
    level = 'HIGH';
    color = '#f97316';
  } else if (score > 30) {
    level = 'MODERATE';
    color = '#f59e0b';
  } else {
    level = 'LOW';
    color = '#10b981';
  }

  const explanation = `${activity} for ${durationMinutes}m under AQI ${aqi} produces a ${level.toLowerCase()} estimated physiological intake.`;

  return {
    score,
    level,
    color,
    explanation,
  };
}
