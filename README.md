# AirGuard 🛡️ — Personal Air Pollution & Respiratory Exposure Guardian

[![Version](https://img.shields.io/badge/version-1.1.0-emerald.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **"AQI tells you what the air is like. AirGuard tells you what to do about it."**

AirGuard is an AI-augmented personal environmental health system built for individual decision support. Rather than displaying passive city-wide averages from distant rooftop stations, AirGuard calculates individualized physiological particulate inhalation load and delivers real-time, context-aware commute and outdoor activity guidance.

---

## 📑 Table of Contents

- [Problem Statement & Vision](#-problem-statement--vision)
- [Key Features](#-key-features)
- [The Science: Physiological Exposure Model](#-the-science-physiological-exposure-model)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Technology Stack](#-technology-stack)
- [License](#-license)

---

## 🎯 Problem Statement & Vision

Traditional weather and air-monitoring applications suffer from three critical blind spots:
1. **Sedentary Fallacy**: A marathon runner breathing 80 L/min of air inhales 10× more particulate matter than someone sitting on a bench, yet apps show them the identical AQI value.
2. **Geographic Generalization**: Macro-scale city averages mask hyperlocal toxic spikes occurring near major highway corridors, industrial discharge plumes, and idling traffic intersections.
3. **Clinical Disconnect**: Raw PM2.5 or AQI digits fail to translate into actionable decisions for vulnerable individuals (asthmatics, children, elderly) versus standard healthy adults.

**AirGuard bridges this gap** by combining live Open-Meteo atmospheric telemetry, IoT hardware streams, personalized clinical profiles, and AI-driven route optimization into a unified respiratory intelligence copilot.

---

## 🌟 Key Features

### 1. Ambient Air Quality Monitor (NAQI Standards)
- Real-time atmospheric telemetry covering **PM2.5, PM10, NO₂, O₃, SO₂, and CO**.
- Calibrated to Indian National Air Quality Index (NAQI) breakpoints (*Good, Satisfactory, Moderate, Poor, Very Poor, Severe*).
- Integrated live weather metrics: ambient temperature, humidity, wind speed, and atmospheric dispersal conditions.

### 2. Personalized Inhalation Exposure Score (0–100)
- Computes personal inhalation load dynamically using user age, minute-ventilation rate, activity type, and health background.
- Tailored risk categories (*Low, Moderate, High, Critical*) with visual gauge metrics and comparative baselines.

### 3. Automated User Profile Onboarding & Health Selector
- **General User Onboarding**: Welcomes first-time visitors with an interactive profile configuration dialog.
- **Dedicated "None" Option**: Quick selection for users without pre-existing respiratory issues, automatically setting standard healthy adult baselines.
- **Condition Presets**: Fast-select chips for *None*, *Mild Asthma*, *Severe Asthma*, *Allergies / Hay Fever*, *Bronchitis*, *Sinusitis*, *Cardiovascular*, and *COPD*.
- **Vulnerability Sensitivity**: Calibrate between *Normal (Standard healthy adult)*, *Sensitive (Prone to irritation)*, and *High Risk (Asthmatic, cardiovascular, elderly)*.
- **Client-Side Persistence**: Saves user profiles and API credentials securely in browser `localStorage`.

### 4. Interactive Geospatial Pollution Heatmap (Leaflet)
- High-resolution interactive geospatial mapping of urban microclimates and pollution hotspots.
- Live spatial layers covering residential zones, congested highway corridors, industrial sectors, and botanical green buffers.
- Interactive point-of-interest inspection with localized PM2.5/PM10 readings.

### 5. Clean-Air Smart Route Comparison
- Side-by-side commute evaluation:
  - **Route A (Fastest Highway Corridor)**: Shorter travel time, but heavy diesel exhaust and severe PM2.5 lung exposure (~185 µg/m³).
  - **Route B (Low-Exposure Canopy Corridor)**: Adds ~4 minutes of travel time while cutting particulate lung intake by **48%**.
- Inhalation toxicity breakdown and exposure score comparison.

### 6. AI Guardian Assistant (Google Gemini Copilot)
- Context-aware atmospheric intelligence assistant powered by Google Gemini (with built-in autonomous heuristic fallback engine).
- Analyzes current telemetry, user profile, and question intent to answer queries such as:
  - *"Can I run outdoors right now?"*
  - *"What is the safest time window today for travel?"*
  - *"Which route minimizes PM2.5 inhalation?"*
  - *"Safety advice for asthmatic or sensitive profiles."*

### 7. Diurnal Best Time Outdoor Planner
- Atmospheric planetary boundary layer simulation predicting diurnal particulate buildup and clearance.
- Automatically highlights optimal outdoor workout windows (e.g., **6:00 AM – 7:30 AM**) versus peak thermal inversion accumulation periods.

### 8. Dynamic Activity Risk Calculator
- Real-time simulation comparing exertion activities (*Sitting, Walking, Cycling, Running, Outdoor Sports*) across durations from 15 minutes to 2 hours.
- Translates minute ventilation rates into clinical risk guidance and mask recommendations (N95 respirators).

### 9. Live ESP32 Hardware IoT Stream
- Simulated Plantower PMS5003 laser particulate sensor stream with realistic atmospheric noise and telemetry jitter.
- Tracks indoor vs. outdoor air quality differentials to verify indoor air purifier efficacy.

### 10. Atmospheric Scenario Simulator
- Instant 1-click scenario switching:
  - 🌿 *Normal Ambient Air*
  - ⚠️ *Winter Smog Alert*
  - 🚗 *Peak Highway Traffic*
  - 🏫 *Campus Safety Warning*
  - 🏭 *Industrial Plume Spike*

---

## 🔬 The Science: Physiological Exposure Model

AirGuard implements a specialized multi-factor exposure model to calculate personal inhalation intake:

$$\text{Exposure Score} = \min\left(100, \text{Pollution Factor} \times \text{Duration Factor} \times \text{Activity Multiplier} \times \text{Vulnerability Factor} \times 25\right)$$

### Factor Breakdown

| Variable | Description | Calibration Formula |
| :--- | :--- | :--- |
| **Pollution Factor** | Normalized ambient particulate density | $\min\left(\frac{\text{AQI}}{200}, 2.5\right)$ |
| **Duration Factor** | Time-weighted outdoor exposure | $\min\left(\frac{\text{Duration (min)}}{60}, 2.0\right)$ |
| **Activity Multiplier** | Minute ventilation air intake ratio | Sitting: `0.5×`, Walking: `1.0×`, Cycling: `1.5×`, Running: `2.0×`, Sports: `2.2×` |
| **Vulnerability Factor** | Age, sensitivity, and clinical history | Base `1.0×` (+`0.25` for age <12 / >60; +`0.35` for active respiratory disease; +`0.1`–`0.2` for sensitivity) |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Data Sources
        API["Open-Meteo European & Indian NAQI API"]
        IOT["ESP32 + PMS5003 Hardware IoT Node"]
        GEO["Open-Meteo Geocoding Pipeline"]
    end

    subgraph Core Engine
        CTX["AirGuard Context State Engine"]
        EXP["Physiological Exposure Calculator"]
        AI["Google Gemini 1.5 Pro / Heuristic Synthesis"]
    end

    subgraph Client UI
        LAND["Landing Experience & Onboarding Modal"]
        DASH["Live Atmospheric Command Center"]
        MAP["Leaflet Geospatial Pollution Heatmap"]
        CHAT["AI Guardian Realtime Assistant"]
    end

    API --> CTX
    IOT --> CTX
    GEO --> CTX
    CTX --> EXP
    CTX --> AI
    EXP --> DASH
    AI --> CHAT
    CTX --> LAND
    CTX --> DASH
    CTX --> MAP
```

---

## 📁 Project Structure

```text
AirGuard-AWS-Hackathon-Project/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI widgets & functional views
│   │   ├── ui/             # Radix UI + Tailwind design tokens (Button, Card, Badge, etc.)
│   │   ├── ActivityRiskCalculator.tsx   # Exertion risk modeling
│   │   ├── AIGuardianChat.tsx           # Gemini copilot interface
│   │   ├── AIRecommendationCard.tsx     # Context-aware activity cards
│   │   ├── BestTimePlanner.tsx          # Diurnal forecast planner
│   │   ├── Header.tsx                   # Sticky top-bar with telemetry status
│   │   ├── InsightsHistory.tsx          # Historical trend analytics
│   │   ├── InteractivePollutionMap.tsx  # Leaflet microclimate map
│   │   ├── LandingHero.tsx              # Interactive landing showcase
│   │   ├── LiveSensorMonitor.tsx        # ESP32 hardware IoT telemetry
│   │   ├── LocationModal.tsx            # Global city search & presets
│   │   ├── MainAQICard.tsx              # Primary NAQI gauge card
│   │   ├── PersonalExposureCard.tsx     # Dynamic physiological score
│   │   ├── SettingsModal.tsx            # Profile onboarding & health selector
│   │   ├── Sidebar.tsx                  # Collapsible navigation drawer
│   │   └── SmartRouteComparison.tsx     # Clean route optimization
│   ├── context/
│   │   └── AirGuardContext.tsx          # Central application state & persistence
│   ├── data/
│   │   └── mockData.ts                  # Presets, hotspots, scenarios, defaults
│   ├── hooks/
│   │   └── useTheme.ts                  # Light/Dark mode state hook
│   ├── pages/
│   │   └── MainDashboard.tsx            # Main operations dashboard layout
│   ├── services/
│   │   ├── aiService.ts                 # Google Gemini API & heuristic fallback
│   │   └── weatherApi.ts                # Open-Meteo live air quality fetching
│   ├── types/
│   │   └── index.ts                     # TypeScript domain interfaces
│   ├── utils/
│   │   ├── aqiCalculator.ts             # Exposure algorithms & NAQI scales
│   │   ├── exportUtils.ts              # Report export utilities
│   │   ├── geoUtils.ts                 # Distance & coordinates utilities
│   │   └── telemetryValidator.ts        # Sensor data validation
│   ├── App.tsx                          # Root application component
│   ├── index.css                        # Design system & CSS variables
│   └── main.tsx                         # React entry point
├── package.json                         # Dependencies & scripts
├── tailwind.config.js                   # Tailwind design system configuration
├── tsconfig.json                        # TypeScript configuration
└── vite.config.ts                       # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js (v18.0.0 or higher)** and **npm** installed on your machine.

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ritiktyagiai/AirGuard-AWS-Hackathon-Project.git
   cd AirGuard-AWS-Hackathon-Project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🔑 Environment Variables

AirGuard functions fully out of the box with zero required configuration. To enable live cloud-powered Google Gemini reasoning, create a `.env` file in the root directory:

```env
# Optional: Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** If no Gemini API key is configured, AirGuard automatically employs its onboard autonomous rule-synthesis engine for instant, zero-latency clinical responses. Users can also enter their Gemini key directly via the in-app **Settings Modal**.

---

## 🛠️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with hot-module reloading |
| `npm run build` | Runs TypeScript compiler check (`tsc -b`) and bundles production assets via Vite |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs `oxlint` fast linter across the entire TypeScript and React codebase |

---

## 💻 Technology Stack

- **Core Framework**: [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), [Vite 8](https://vitejs.dev/)
- **Styling & Design Tokens**: [Tailwind CSS 3.4](https://tailwindcss.com/) with MeetMind warm aesthetic and dark/light mode CSS variables
- **Geospatial Mapping**: [Leaflet](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/), [CountUp](https://github.com/glennreyes/react-countup)
- **UI Primitives & Icons**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **External Atmospheric APIs**: [Open-Meteo Air Quality REST API](https://open-meteo.com/en/docs/air-quality-api)
- **AI Intelligence**: [Google Gemini 1.5](https://deepmind.google/technologies/gemini/) with offline autonomous heuristic fallback

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
