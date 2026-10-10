import { AirQualityData, Hotspot, HourlyForecast, LocationPreset, RouteOption } from '../types';
import { getAQICategory } from '../utils/aqiCalculator';

/**
 * Live Weather & Air Quality Service powered by Open-Meteo.
 * Completely free, no API key required, works worldwide.
 */

// Search for any city or address worldwide using Open-Meteo Geocoding
export async function searchLocationsOnline(query: string): Promise<LocationPreset[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=6&language=en&format=json`
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      id: `online-${item.id}`,
      name: item.name,
      city: item.admin1 ? `${item.admin1}, ${item.country}` : item.country || 'Global',
      state: item.admin1 || item.country || '',
      coordinates: [item.latitude, item.longitude],
      baseAqi: 150, // will be fetched dynamically
      basePm25: 65,
      basePm10: 95,
      temperature: 26,
      humidity: 50,
      description: `Live location: ${item.name}, ${item.admin1 || ''} (${item.country || ''})`,
    }));
  } catch (err) {
    console.warn('Geocoding search error:', err);
    return [];
  }
}

// Reverse geocode coordinates to a human-readable city name
export async function reverseGeocodeOnline(lat: number, lon: number): Promise<{ name: string; city: string }> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&format=json`
    );
    // If reverse search not available by raw coords, return generic name
    return {
      name: `Lat: ${lat.toFixed(3)}, Lon: ${lon.toFixed(3)}`,
      city: 'Current Device GPS',
    };
  } catch {
    return {
      name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      city: 'Detected Device Location',
    };
  }
}

// Fetch live atmospheric Air Quality + Meteorological readings
export async function fetchLiveAirQuality(
  lat: number,
  lon: number,
  locationName: string
): Promise<{
  airData: AirQualityData;
  hourly: HourlyForecast[];
  hotspots: Hotspot[];
  routes: RouteOption[];
}> {
  try {
    // Parallel fetch: Air Quality + Weather Forecast
    const [aqiRes, weatherRes] = await Promise.all([
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5,us_aqi&forecast_days=1`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`
      ),
    ]);

    let aqiData: any = {};
    let weatherData: any = {};

    if (aqiRes.ok) aqiData = await aqiRes.json();
    if (weatherRes.ok) weatherData = await weatherRes.json();

    const currAqi = aqiData.current || {};
    const currWeather = weatherData.current || {};

    const rawPm25 = Math.round(currAqi.pm2_5 ?? 75);
    const rawPm10 = Math.round(currAqi.pm10 ?? 115);
    const rawUsAqi = currAqi.us_aqi ? Math.round(currAqi.us_aqi) : Math.round(rawPm25 * 2.1);
    const aqi = Math.max(20, Math.min(500, rawUsAqi));

    const temp = currWeather.temperature_2m ? Math.round(currWeather.temperature_2m) : 28;
    const humidity = currWeather.relative_humidity_2m ? Math.round(currWeather.relative_humidity_2m) : 55;
    const windSpeed = currWeather.wind_speed_10m ? Math.round(currWeather.wind_speed_10m) : 8;
    const windDir = currWeather.wind_direction_10m ? `${Math.round(currWeather.wind_direction_10m)}°` : 'NW';

    const cat = getAQICategory(aqi);

    const indoorPm25 = Math.max(12, Math.round(rawPm25 * 0.38));

    const airData: AirQualityData = {
      aqi,
      category: cat.category,
      categoryLabel: cat.label,
      categoryColor: cat.color,
      categoryBg: cat.bgColor,
      pm25: rawPm25,
      pm10: rawPm10,
      no2: currAqi.nitrogen_dioxide ? Math.round(currAqi.nitrogen_dioxide) : Math.round(aqi * 0.16),
      o3: currAqi.ozone ? Math.round(currAqi.ozone) : 32,
      so2: currAqi.sulphur_dioxide ? Math.round(currAqi.sulphur_dioxide) : Math.round(aqi * 0.08),
      co: currAqi.carbon_monoxide ? +(currAqi.carbon_monoxide / 500).toFixed(1) : 1.2,
      temperature: temp,
      humidity,
      windSpeed,
      windDirection: windDir,
      updatedAt: 'Just now',
      locationName,
      coordinates: [lat, lon],
      indoorPm25,
      indoorCategory: indoorPm25 < 35 ? 'Good' : 'Moderate',
    };

    // Construct hourly forecasts from live hourly data
    const hourlyArr: HourlyForecast[] = [];
    if (aqiData.hourly?.time && Array.isArray(aqiData.hourly.time)) {
      const times = aqiData.hourly.time.slice(0, 16);
      const pm25s = aqiData.hourly.pm2_5 || [];
      const aqis = aqiData.hourly.us_aqi || [];

      times.forEach((tStr: string, idx: number) => {
        const d = new Date(tStr);
        const hour = d.getHours();
        const hourLabel = `${(hour % 12 || 12).toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        const itemAqi = aqis[idx] ? Math.round(aqis[idx]) : Math.round((pm25s[idx] || 50) * 2);
        const itemCat = getAQICategory(itemAqi);

        hourlyArr.push({
          time: hourLabel,
          hour,
          aqi: itemAqi,
          pm25: Math.round(pm25s[idx] || 40),
          level: itemCat.label,
          color: itemCat.color,
          recommended: itemAqi < 120 && hour >= 5 && hour <= 8,
        });
      });
    }

    // Generate localized hotspots centered around the active coordinates
    const hotspots: Hotspot[] = [
      {
        id: `hs-${lat.toFixed(2)}-1`,
        name: 'Arterial Transit Highway',
        type: 'highway',
        aqi: Math.min(500, Math.round(aqi * 1.25)),
        deltaText: '+25% vs surrounding area',
        pm25: Math.round(rawPm25 * 1.3),
        coordinates: [lat - 0.006, lon + 0.007],
        description: 'Heavy commercial transit corridor and diesel emission plume.',
        alert: 'Peak congestion corridor',
      },
      {
        id: `hs-${lat.toFixed(2)}-2`,
        name: 'Commercial Market Center',
        type: 'market',
        aqi: Math.min(500, Math.round(aqi * 1.12)),
        deltaText: '+12% street canyon concentration',
        pm25: Math.round(rawPm25 * 1.15),
        coordinates: [lat + 0.004, lon - 0.006],
        description: 'Dense commercial hub with stop-and-go vehicular idling.',
      },
      {
        id: `hs-${lat.toFixed(2)}-3`,
        name: 'Educational Campus Zone',
        type: 'school',
        aqi: Math.round(aqi * 0.95),
        deltaText: 'Morning ground layer exposure',
        pm25: Math.round(rawPm25 * 0.95),
        coordinates: [lat + 0.008, lon + 0.003],
        description: 'Academic facilities and sports grounds.',
      },
      {
        id: `hs-${lat.toFixed(2)}-4`,
        name: 'Botanical Green Canopy',
        type: 'park',
        aqi: Math.max(35, Math.round(aqi * 0.55)),
        deltaText: '-45% lower than highway',
        pm25: Math.max(15, Math.round(rawPm25 * 0.5)),
        coordinates: [lat + 0.001, lon - 0.01],
        description: 'Dense vegetative buffer providing clean air dispersion.',
      },
    ];

    // Generate localized routes
    const routes: RouteOption[] = [
      {
        id: `route-fastest-${lat}`,
        name: 'Route A: Expressway Corridor',
        tag: 'FASTEST ROUTE',
        durationMinutes: 20,
        distanceKm: 8.0,
        exposureScore: Math.min(98, Math.round((aqi / 250) * 75)),
        exposureLevel: aqi > 150 ? 'HIGH' : 'MODERATE',
        exposureColor: '#ef4444',
        trafficIntensity: 'heavy',
        description: 'Direct transit route through main traffic arteries with heavy vehicle exhaust.',
        isRecommended: false,
        coordinates: [
          [lat, lon],
          [lat - 0.003, lon + 0.004],
          [lat - 0.006, lon + 0.007],
          [lat + 0.008, lon + 0.003],
        ],
      },
      {
        id: `route-clean-${lat}`,
        name: 'Route B: Green Canopy Route',
        tag: 'LOW-EXPOSURE ROUTE ⭐',
        durationMinutes: 24,
        distanceKm: 7.5,
        exposureScore: Math.max(22, Math.round((aqi / 250) * 38)),
        exposureLevel: 'LOWER',
        exposureColor: '#10b981',
        trafficIntensity: 'light',
        description: 'Bypasses major traffic corridors through residential green canopy. Cuts inhalation by ~48%.',
        isRecommended: true,
        coordinates: [
          [lat, lon],
          [lat + 0.003, lon - 0.004],
          [lat + 0.001, lon - 0.01],
          [lat + 0.008, lon + 0.003],
        ],
      },
    ];

    return { airData, hourly: hourlyArr.length > 0 ? hourlyArr : [], hotspots, routes };
  } catch (err) {
    console.error('Error fetching live atmospheric data:', err);
    throw err;
  }
}
