# AirGuard System Architecture & Engineering Overview

## 1. Executive Summary
AirGuard is an atmospheric intelligence and individualized respiratory exposure guardian.
It converts raw particulate readings (PM2.5, PM10, NO2, O3) into individualized inhalation load metrics.

## 2. Technical Stack
- **Frontend Framework**: React 19 + TypeScript + Vite 8
- **Styling Architecture**: TailwindCSS + MeetMind Design System (CSS Variables)
- **Design Tokens**: Warm Stone (#f5f4f2), Deep Charcoal (#121211), Forest Green (#2c4a3e)
- **Typography**: Fraunces (Display Serif) + Instrument Sans (UI Body)
- **GIS Mapping**: Leaflet + React-Leaflet + OpenStreetMap
- **Data Visualizations**: Recharts Area & Bar Charts
- **AI Synthesis**: Google Gemini 1.5 Pro via LangChain / REST
- **Meteorological Pipeline**: Open-Meteo European & Indian NAQI Telemetry API

## 3. Core Exposure Model
Exposure Index = f(Ambient_AQI, Active_Ventilation_Rate, Duration_Minutes, Physiological_Sensitivity)
