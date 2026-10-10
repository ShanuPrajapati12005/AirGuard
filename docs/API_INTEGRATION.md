# AirGuard API Integration Specifications

## 1. Open-Meteo Air Quality REST Endpoint
- **URL**: \https://air-quality-api.open-meteo.com/v1/air-quality\
- **Parameters**:
  - \latitude\, \longitude\
  - \current=pm10,pm2_5,nitrogen_dioxide,ozone,european_aqi,us_aqi\
  - \hourly=pm2_5,pm10,us_aqi\
  - \orecast_days=3\

## 2. Google Gemini 1.5 Pro Telemetry Prompt
- User profile variables: Age, Pre-existing respiratory conditions, Exertion activity.
- System Prompt: Encodes NAQI clinical advisories into actionable real-time guidance.
