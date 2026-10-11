<p align="center">
  <img src="docs/diagrams/banner.svg" alt="AirGuard: personal air-quality intelligence" width="100%">
</p>

<h1 align="center">AirGuard · System Architecture & Feature Workflow</h1>

<p align="center">
  <b>How raw air-quality data becomes a personal decision.</b><br>
  Data pipelines, the exposure model, and a function reference for every module.
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-1e3f32?style=flat-square&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-1e3f32?style=flat-square&logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-build-1e3f32?style=flat-square&logo=vite&logoColor=white">
  <img alt="Leaflet" src="https://img.shields.io/badge/Leaflet-map-1e3f32?style=flat-square&logo=leaflet&logoColor=white">
  <img alt="Data" src="https://img.shields.io/badge/data-Open--Meteo-1e3f32?style=flat-square">
  <img alt="Privacy" src="https://img.shields.io/badge/privacy-local--first-15803d?style=flat-square">
  <img alt="Status" src="https://img.shields.io/badge/status-hackathon%20prototype-92580c?style=flat-square">
</p>

> **AQI tells you what the air is like. AirGuard tells you what to do about it.**

---

## Contents

1. [Vision](#1-vision)
2. [System architecture](#2-system-architecture)
3. [Onboarding and health profile](#3-onboarding-and-health-profile)
4. [Telemetry and sensor fusion](#4-telemetry-and-sensor-fusion)
5. [Personal exposure engine](#5-personal-exposure-engine)
6. [Clean-air smart routes](#6-clean-air-smart-routes)
7. [Best time planner](#7-best-time-planner)
8. [Activity risk simulator](#8-activity-risk-simulator)
9. [AI Guardian pipeline](#9-ai-guardian-pipeline)
10. [Pollution map and hotspots](#10-pollution-map-and-hotspots)
11. [Design system](#11-design-system)
12. [Function and symbol reference](#12-function-and-symbol-reference)
13. [AWS cloud roadmap](#13-aws-cloud-roadmap)
14. [Limitations and disclaimer](#14-limitations-and-disclaimer)

---

## 1. Vision

Regional AQI numbers come from a few distant stations and treat everyone the same. A runner breathing about 55 L/min and a person resting indoors at about 7 L/min are handed the same number.

AirGuard closes that gap in four moves:

| Step | What it does | Where it lives |
| :-- | :-- | :-- |
| **Sense** | Pulls local air and weather data, plus an optional ESP32 sensor stream | `weatherApi.ts` |
| **Personalize** | Weights the air by activity, duration, age, and health profile | `aqiCalculator.ts` |
| **Advise** | Turns the score into a route, a time window, and a plain-language answer | Route, planner, AI modules |
| **Act** | Shows one clear next step, not a dashboard of numbers | Dashboard |

```mermaid
flowchart LR
  A["Raw data<br/>PM2.5, PM10, gases"]:::raw --> B["AQI<br/>NAQI category"]:::raw
  B --> C["Personal exposure<br/>0 to 100"]:::core
  C --> D["AI advice<br/>plain language"]:::core
  D --> E["Action<br/>route, time, activity"]:::act
  classDef raw fill:#f6f5f3,stroke:#54524c,color:#111110,stroke-width:1.5px
  classDef core fill:#e9f1ec,stroke:#1e3f32,color:#111110,stroke-width:1.5px
  classDef act fill:#1e3f32,stroke:#1e3f32,color:#ffffff,stroke-width:1.5px
```

---

## 2. System architecture

<p align="center">
  <img src="docs/diagrams/system_architecture.svg" alt="AirGuard system architecture: ingest, normalize, personal exposure, client state, then five feature modules" width="100%">
</p>

*Figure 2.1. Four-stage pipeline feeding five feature modules. All computation runs in the browser.*

```mermaid
flowchart LR
  subgraph IN["1 · Ingest"]
    direction TB
    AQ["🛰️ Open-Meteo<br/>Air Quality"]
    WX["🌤️ Open-Meteo<br/>Weather"]
    HW["📡 ESP32 + PMS5003<br/>simulated in demo"]
  end
  subgraph NM["2 · Normalize"]
    direction TB
    N0["weatherApi.ts"]
    N1["Parallel fetch"]
    N2["NAQI mapper"]
    N3["Indoor model<br/>PM2.5 × 0.38"]
    N4["Hotspot generator"]
    N0 ~~~ N1
    N1 --> N2 --> N3 --> N4
  end
  subgraph EX["3 · Exposure"]
    direction TB
    E0["aqiCalculator.ts"]
    E1["Factors and multipliers"]
    E2["Score 0 to 100"]
    E3["Risk tier + guidance"]
    E0 ~~~ E1
    E1 --> E2 --> E3
  end
  subgraph CX["4 · Client state"]
    direction TB
    C0["AirGuardContext.tsx"]
    C1["Live telemetry + scenario"]
    C2["Profile in localStorage"]
    C0 ~~~ C1
    C1 ~~~ C2
  end
  subgraph UI["5 · Modules"]
    direction TB
    M1["Smart routes"]
    M2["AI Guardian"]
    M3["Pollution map"]
    M4["Best time"]
    M5["Activity risk"]
  end
  IN --> NM --> EX --> CX --> UI
  classDef src fill:#ffffff,stroke:#54524c,color:#111110
  classDef file fill:#1e3f32,stroke:#1e3f32,color:#ffffff
  classDef step fill:#e9f1ec,stroke:#1e3f32,color:#111110
  classDef mod fill:#ffffff,stroke:#1e3f32,color:#111110
  class AQ,WX,HW src
  class N0,E0,C0 file
  class N1,N2,N3,N4,E1,E2,E3,C1,C2 step
  class M1,M2,M3,M4,M5 mod
  style IN fill:#f6f5f3,stroke:#e2dfd7,color:#111110
  style NM fill:#f6f5f3,stroke:#e2dfd7,color:#111110
  style EX fill:#f6f5f3,stroke:#e2dfd7,color:#111110
  style CX fill:#f6f5f3,stroke:#e2dfd7,color:#111110
  style UI fill:#f6f5f3,stroke:#e2dfd7,color:#111110
```

---

## 3. Onboarding and health profile

Before it can weigh the air for a person, AirGuard needs a baseline. First-time visitors get a short guided setup. Returning visitors skip it because the profile is rehydrated from `localStorage`.

```mermaid
flowchart TD
  S(["User opens AirGuard"]) --> Q{"Profile in<br/>localStorage?"}
  Q -- "Yes" --> H["Hydrate state and<br/>apply saved profile"]
  Q -- "No" --> W["Welcome modal"]
  W --> D1["Demographics<br/>name, age bracket, commute mode"]
  D1 --> D2["Health conditions<br/>or None, baseline 1.0×"]
  D2 --> D3["Sensitivity<br/>Normal, Sensitive, High risk"]
  D3 --> P["Save profile to localStorage<br/>no network transmission"]
  P --> R["Recalculate exposure"]
  H --> R
  R --> UI(["Render dashboard"])
  classDef start fill:#1e3f32,stroke:#1e3f32,color:#ffffff
  classDef step fill:#ffffff,stroke:#1e3f32,color:#111110
  classDef dec fill:#fef3c7,stroke:#92580c,color:#111110
  classDef save fill:#e9f1ec,stroke:#15803d,color:#111110
  class S,UI start
  class W,D1,D2,D3,H,R step
  class Q dec
  class P save
```

| Choice | Options | Effect on the model |
| :-- | :-- | :-- |
| Age bracket | under 12, 12 to 60, over 60 | +0.25 vulnerability outside 12 to 60 |
| Conditions | None, mild or severe asthma, COPD, bronchitis, allergies, sinusitis, cardiovascular | +0.35 for respiratory conditions |
| Sensitivity | Normal, Sensitive, High risk | +0.10 Sensitive, +0.20 High risk |
| Commute mode | Walking, cycling, transit, car | Sets the default activity |

The **None** chip keeps the multiplier at 1.0×, so healthy adults are never shown false alarms.

> **Privacy.** The profile lives only in the browser. Nothing about health or conditions is sent to a server or third party.

---

## 4. Telemetry and sensor fusion

```mermaid
sequenceDiagram
  autonumber
  participant U as User / GPS
  participant W as weatherApi.ts
  participant AQ as Open-Meteo Air Quality
  participant WX as Open-Meteo Weather
  participant S as ESP32 stream
  participant C as AirGuardContext
  U->>W: fetchLiveAirQuality(lat, lon)
  par Parallel ingestion
    W->>AQ: PM2.5, PM10, NO₂, O₃, SO₂, CO, US AQI
    AQ-->>W: current + hourly
  and
    W->>WX: temperature, humidity, wind
    WX-->>W: current + hourly
  end
  W->>W: Map to NAQI category
  W->>W: Indoor PM2.5 = outdoor × 0.38
  W->>W: Slice 16-hour forecast
  loop every 3 seconds in demo mode
    S-->>C: PM2.5 reading with ±3 µg/m³ jitter
  end
  W-->>C: Normalized AirQualityData
  C-->>U: Gauge, map overlays, risk calculators update
```

### Sensor simulation

When no hardware is attached, a 3-second timer applies a bounded random walk to mimic the optical scatter of a laser particle sensor:

$$\text{PM2.5}_{t} = \max\left(15,\ \min\left(180,\ \text{PM2.5}_{t-1} + (\mathcal{R} - 0.48) \times 3\right)\right)$$

where $\mathcal{R}$ is uniform on $[0, 1)$. The listener has the same shape as the real ESP32 path, so swapping in hardware changes the data source, not the UI.

| Data | Source | Refresh |
| :-- | :-- | :-- |
| PM2.5, PM10, NO₂, O₃, SO₂, CO, US AQI | Open-Meteo Air Quality | On location change and manual refresh |
| Temperature, humidity, wind | Open-Meteo Weather | Same |
| Sensor PM2.5 | ESP32 + PMS5003, or the simulator | Every 3 s |
| Indoor PM2.5 | Derived: outdoor × 0.38 | Whenever outdoor changes |

---

## 5. Personal exposure engine

<p align="center">
  <img src="docs/diagrams/exposure_model.svg" alt="Exposure model: four factors multiplied by 25 and clamped to produce a 0 to 100 score" width="100%">
</p>

*Figure 5.1. Four factors multiply, scale by 25, and clamp to 0 to 100.*

Implemented in [`src/utils/aqiCalculator.ts`](src/utils/aqiCalculator.ts).

```mermaid
flowchart LR
  subgraph INP["Inputs"]
    direction TB
    I1["AQI 0 to 500"]
    I2["Duration 15 to 120 min"]
    I3["Activity"]
    I4["Age, condition, sensitivity"]
  end
  subgraph FAC["Factors"]
    direction TB
    F1["Pollution<br/>min(AQI ÷ 200, 2.5)"]
    F2["Duration<br/>min(t ÷ 60, 2.0)"]
    F3["Activity<br/>0.5× to 2.2×"]
    F4["Vulnerability<br/>1 + age + condition + sensitivity"]
  end
  I1 --> F1
  I2 --> F2
  I3 --> F3
  I4 --> F4
  F1 & F2 & F3 & F4 --> X["Multiply<br/>and × 25"]
  X --> CL["round, clamp to 100"]
  CL --> T1["0 to 30<br/>Low"]
  CL --> T2["31 to 55<br/>Moderate"]
  CL --> T3["56 to 75<br/>High"]
  CL --> T4["76 to 100<br/>Critical"]
  classDef inp fill:#ffffff,stroke:#54524c,color:#111110
  classDef fac fill:#e9f1ec,stroke:#1e3f32,color:#111110
  classDef mul fill:#1e3f32,stroke:#1e3f32,color:#ffffff
  classDef low fill:#d1fae5,stroke:#10b981,color:#064e3b
  classDef mod fill:#fef3c7,stroke:#f59e0b,color:#78350f
  classDef high fill:#ffedd5,stroke:#f97316,color:#7c2d12
  classDef crit fill:#fee2e2,stroke:#ef4444,color:#7f1d1d
  class I1,I2,I3,I4 inp
  class F1,F2,F3,F4 fac
  class X,CL mul
  class T1 low
  class T2 mod
  class T3 high
  class T4 crit
  style INP fill:#f6f5f3,stroke:#e2dfd7,color:#111110
  style FAC fill:#f6f5f3,stroke:#e2dfd7,color:#111110
```

### Formula

$$\text{Exposure} = \min\left(100,\ \text{round}\left(F_{\text{pollution}} \times F_{\text{duration}} \times M_{\text{activity}} \times M_{\text{vulnerability}} \times 25\right)\right)$$

| Symbol | Definition |
| :-- | :-- |
| $F_{\text{pollution}}$ | $\min(\text{AQI} / 200,\ 2.5)$ |
| $F_{\text{duration}}$ | $\min(t / 60,\ 2.0)$ |
| $M_{\text{activity}}$ | Sitting 0.5, walking 1.0, commuting 1.2, cycling 1.5, running 2.0, outdoor sports 2.2 |
| $M_{\text{vulnerability}}$ | $1 + \Delta_{\text{age}} + \Delta_{\text{condition}} + \Delta_{\text{sensitivity}}$ |
| $\Delta_{\text{age}}$ | +0.25 if age under 12 or over 60 |
| $\Delta_{\text{condition}}$ | +0.35 if a respiratory condition is present |
| $\Delta_{\text{sensitivity}}$ | +0.20 High risk, +0.10 Sensitive |

### Worked examples (AQI 276)

| Who and what | $F_p$ | $F_d$ | $M_a$ | $M_v$ | Raw | Score | Tier |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-- |
| Healthy adult, walking 20 min | 1.38 | 0.33 | 1.0 | 1.00 | 11.5 | **12** | 🟢 Low |
| Child with mild asthma, walking 60 min, Sensitive | 1.38 | 1.00 | 1.0 | 1.70 | 58.7 | **59** | 🟠 High |
| Healthy adult, running 60 min | 1.38 | 1.00 | 2.0 | 1.00 | 69.0 | **69** | 🟠 High |
| Adult with asthma, High risk, running 60 min | 1.38 | 1.00 | 2.0 | 1.55 | 107.0 | **100** | 🔴 Critical |

The tier colors are `#10b981` Low, `#f59e0b` Moderate, `#f97316` High, and `#ef4444` Critical.

---

## 6. Clean-air smart routes

Standard navigation optimizes only for time. AirGuard compares **two corridors** and shows what each costs in exposure, not just minutes.

<p align="center">
  <img src="docs/diagrams/clean_route_comparison.svg" alt="Route A, an expressway, scores 82 out of 100. Route B, a green canopy corridor, scores 42 out of 100 for 4 more minutes." width="100%">
</p>

*Figure 6.1. Route A (expressway) against Route B (green canopy). Four extra minutes cuts the exposure score by 49%.*

```mermaid
flowchart TD
  Q(["Origin to destination"]) --> S["Resolve both corridors against<br/>exhaust plumes and green buffers"]
  S --> A["<b>Route A · Expressway</b><br/>8.0 km · 20 min<br/>PM2.5 ≈ 185<br/>Exposure 82 · HIGH"]
  S --> B["<b>Route B · Green canopy</b><br/>7.5 km · 24 min<br/>PM2.5 ≈ 58<br/>Exposure 42 · LOW"]
  A --> T{"Trade-off:<br/>+4 min for 49% lower score"}
  B --> T
  T -- "Choose B" --> OB["Navigate the canopy corridor<br/>route drawn on the map"]
  T -- "Choose A" --> OA["High-exposure warning<br/>and N95 reminder"]
  classDef start fill:#1e3f32,stroke:#1e3f32,color:#ffffff
  classDef bad fill:#fee2e2,stroke:#ef4444,color:#7f1d1d
  classDef good fill:#d1fae5,stroke:#15803d,color:#064e3b
  classDef dec fill:#fef3c7,stroke:#92580c,color:#111110
  classDef out fill:#ffffff,stroke:#1e3f32,color:#111110
  class Q start
  class A,OA bad
  class B,OB good
  class T dec
  class S out
```

| | Route A · Expressway | Route B · Green canopy |
| :-- | :-: | :-: |
| Distance | 8.0 km | 7.5 km |
| Time | 20 min | 24 min (+4) |
| PM2.5 | about 185 µg/m³ | about 58 µg/m³ |
| Traffic | Heavy diesel | Light, tree-lined |
| Exposure score | 82 / 100 | 42 / 100 |

Interface notes: route cards use fluid heights so long descriptions never overflow, location badges truncate gracefully, and the layout flips from one column on mobile to two on desktop.

---

## 7. Best time planner

Pollution follows a daily rhythm. Overnight, a cold ground layer traps particulates. After sunrise the boundary layer expands and dilutes them, until rush-hour traffic pushes concentrations back up.

<p align="center">
  <img src="docs/diagrams/diurnal_window.svg" alt="AQI over 24 hours with the best outdoor window highlighted between 5:30 and 7:30 AM" width="100%">
</p>

*Figure 7.1. Illustrative diurnal pattern (demo data). The green band is the recommended window.*

```mermaid
flowchart LR
  A["🌙 12 to 5:30 AM<br/>Thermal inversion<br/>particulates pile up"]:::bad
  B["⭐ 5:30 to 7:30 AM<br/>Boundary layer expands<br/>AQI drops under 100"]:::good
  C["🚗 8 to 11 AM<br/>Rush-hour surge<br/>AQI 250 to 320"]:::bad
  D["☀️ 12 to 4 PM<br/>Convection<br/>moderate ventilation"]:::mid
  E["🌆 5 to 8:30 PM<br/>Evening commute<br/>second spike"]:::bad
  A --> B --> C --> D --> E
  classDef good fill:#d1fae5,stroke:#15803d,color:#064e3b,stroke-width:2px
  classDef bad fill:#fee2e2,stroke:#ef4444,color:#7f1d1d
  classDef mid fill:#fef3c7,stroke:#f59e0b,color:#78350f
```

**In `BestTimePlanner.tsx`:** the hourly forecast comes from Open-Meteo; a filter picks hours with AQI below 120 between 05:00 and 08:00; a Recharts area chart draws the curve and highlights the recommended band.

---

## 8. Activity risk simulator

Users test an activity before leaving home. Choose the effort, choose the duration, and read the score in the same 0 to 100 scale as everywhere else. Implemented in [`src/components/ActivityRiskCalculator.tsx`](src/components/ActivityRiskCalculator.tsx).

| Activity | Typical ventilation | Multiplier |
| :-- | :-: | :-: |
| Sitting | 7 L/min | 0.5× |
| Walking | 15 L/min | 1.0× |
| Commuting | 18 L/min | 1.2× |
| Cycling | 30 L/min | 1.5× |
| Running | 55 L/min | 2.0× |
| Outdoor sports | 65 L/min | 2.2× |

```mermaid
flowchart TD
  A(["Open calculator"]) --> B["Pick activity"]
  B --> C["Pick duration<br/>15, 30, 60 or 120 min"]
  C --> D["calculateExposureScore()<br/>AQI × duration × activity × profile"]
  D --> E{"Score"}
  E -- "0 to 30" --> L["🟢 Low<br/>Fine for outdoor exercise"]
  E -- "31 to 55" --> M["🟡 Moderate<br/>Sensitive profiles: shorten"]
  E -- "56 to 75" --> H["🟠 High<br/>Consider an N95 for cardio"]
  E -- "76 to 100" --> X["🔴 Critical<br/>Move indoors or wait for 6 AM"]
  classDef s fill:#1e3f32,stroke:#1e3f32,color:#ffffff
  classDef p fill:#ffffff,stroke:#1e3f32,color:#111110
  classDef d fill:#fef3c7,stroke:#92580c,color:#111110
  classDef low fill:#d1fae5,stroke:#10b981,color:#064e3b
  classDef mod fill:#fef3c7,stroke:#f59e0b,color:#78350f
  classDef high fill:#ffedd5,stroke:#f97316,color:#7c2d12
  classDef crit fill:#fee2e2,stroke:#ef4444,color:#7f1d1d
  class A s
  class B,C,D p
  class E d
  class L low
  class M mod
  class H high
  class X crit
```

---

## 9. AI Guardian pipeline

[`src/services/aiService.ts`](src/services/aiService.ts) answers in two layers. The cloud model gives richer answers; the rule engine means the assistant **always answers**, even with no key or no network.

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant C as AIGuardianChat.tsx
  participant S as aiService.ts
  participant G as Gemini Flash
  participant R as Rule engine
  U->>C: "Can I go running now?"
  C->>S: queryAIGuardian(prompt, AQI, profile, key?)
  S->>S: Build context snapshot<br/>location, AQI, PM, weather, profile
  alt API key present and reachable
    S->>G: Prompt with context and guidance rules
    G-->>S: Structured, friendly guidance
  else No key, API error, or offline
    S->>R: Match intent
    Note over R: Workout: AQI over 200 and asthma risk<br/>Commute: suggest Route B<br/>Mask: N95 against surgical<br/>School and kids: higher intake per minute<br/>Timing: the 6 AM window
    R-->>S: Deterministic answer
  end
  S-->>C: Markdown response
  C-->>U: Typing animation, then reply
```

| Intent | Rule-engine behavior |
| :-- | :-- |
| Workout or cardio | Checks AQI above 200 and the user's risk profile |
| Commute | Recommends the Route B green corridor |
| Masks | Compares N95 and surgical masks for particulate capture |
| School or children | Explains higher intake per minute for young lungs |
| Timing | Points to the 6 AM dispersion window |

---

## 10. Pollution map and hotspots

Built with **Leaflet** and **React-Leaflet** in [`src/components/InteractivePollutionMap.tsx`](src/components/InteractivePollutionMap.tsx).

```mermaid
flowchart TD
  A(["GPS center coordinates"]) --> B["Initialize Leaflet<br/>OpenStreetMap canvas"]
  B --> C["Render hotspot overlays"]
  C --> H1["🔴 Highway junction<br/>+25% PM2.5, diesel corridor"]
  C --> H2["🟠 Industrial zone<br/>+24% SO₂ and PM10"]
  C --> H3["🟡 Market street canyon<br/>+12% idling traffic"]
  C --> H4["🟢 Park canopy<br/>−45% PM2.5 clean buffer"]
  H1 & H2 & H3 & H4 --> D["Interactive inspection"]
  D --> D1["Click a marker for local concentration"]
  D --> D2["Tooltip pill with delta against regional baseline"]
  D --> D3["Toggle Route A and Route B overlays"]
  classDef s fill:#1e3f32,stroke:#1e3f32,color:#ffffff
  classDef p fill:#ffffff,stroke:#1e3f32,color:#111110
  classDef r fill:#fee2e2,stroke:#ef4444,color:#7f1d1d
  classDef o fill:#ffedd5,stroke:#f97316,color:#7c2d12
  classDef y fill:#fef3c7,stroke:#f59e0b,color:#78350f
  classDef g fill:#d1fae5,stroke:#15803d,color:#064e3b
  class A s
  class B,C,D,D1,D2,D3 p
  class H1 r
  class H2 o
  class H3 y
  class H4 g
```

---

## 11. Design system

Light and dark themes share one set of CSS variable tokens.

| Token | Light | Dark | Use |
| :-- | :-- | :-- | :-- |
| `--bg` | `#f6f5f3` | `#0f1011` | Page canvas |
| `--card` | `#ffffff` | `#18191b` | Card surface |
| `--ink` | `#111110` | `#fdfcf9` | Primary text |
| `--mut` | `#54524c` | `#a9a7a0` | Secondary text |
| `--line` | `#e2dfd7` | `#292a2e` | Borders and dividers |
| `--ac` | `#1e3f32` | `#4ade80` | Primary accent |
| `--ac2` | `#92580c` | `#fbbf24` | Moderate tier |
| `--ok` | `#15803d` | `#34d399` | Healthy tier |

**Measured contrast on the page background:** body text, muted text, and the primary accent reach AAA (7:1 or better) in both themes. In light mode, `--ac2` (5.3:1) and `--ok` (4.6:1) meet AA, so use them for large text, icons, and badges rather than small body copy.

### Elevated cards (`.card-3d`)

Layered shadows plus a thin top highlight give cards a tactile lift.

```css
/* light */
box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px -4px rgba(20,20,20,.07), inset 0 1px 0 rgba(255,255,255,.9);
/* dark */
box-shadow: 0 2px 6px rgba(0,0,0,.5), 0 14px 34px -6px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.08);
```

On hover the card lifts 2 px and its shadow widens.

---

## 12. Function and symbol reference

<details open>
<summary><b><code>src/utils/aqiCalculator.ts</code></b></summary>

| Symbol | Purpose |
| :-- | :-- |
| `getAQICategory(aqi)` | Returns the NAQI category (`good`, `satisfactory`, `moderate`, `poor`, `verypoor`, `severe`), its color, and a description |
| `calculateExposureScore(aqi, durationMinutes, activity, userProfile)` | Computes the 0 to 100 personal exposure index |
| `ACTIVITY_MULTIPLIERS` | Maps each activity to its intake multiplier |

</details>

<details>
<summary><b><code>src/services/weatherApi.ts</code></b></summary>

| Symbol | Purpose |
| :-- | :-- |
| `fetchLiveAirQuality(lat, lon, locationName)` | Queries both Open-Meteo endpoints in parallel and returns normalized `AirQualityData` |
| `searchLocationsOnline(query)` | Forward geocoding: text to city coordinates |
| `reverseGeocodeOnline(lat, lon)` | GPS coordinates to a readable place name |

</details>

<details>
<summary><b><code>src/services/aiService.ts</code></b></summary>

| Symbol | Purpose |
| :-- | :-- |
| `queryAIGuardian(prompt, currentAQI, userProfile, apiKey?)` | Tries Gemini first, falls back to the deterministic rule engine |

</details>

<details>
<summary><b><code>src/context/AirGuardContext.tsx</code> and <code>src/hooks/useTheme.ts</code></b></summary>

| Symbol | Purpose |
| :-- | :-- |
| `AirGuardProvider` | Root provider: location, live telemetry, sensor noise, profile, scenarios, active tab |
| `useAirGuard()` | Hook giving any component access to state and actions |
| `useTheme()` | Syncs `data-theme="dark\|light"` and the `.dark` class with `localStorage` |

</details>

---

## 13. AWS cloud roadmap

> **Status: planned, not yet built.** The prototype runs fully in the browser. This is the path to a hosted, multi-user version, and it fits the existing `services/` layer without UI changes.

```mermaid
flowchart LR
  U(["👤 Browser"]) --> AMP["AWS Amplify Hosting<br/>React app + CDN"]
  AMP --> APIGW["Amazon API Gateway"]
  APIGW --> LAM["AWS Lambda<br/>Graviton arm64"]
  LAM --> DDB[("Amazon DynamoDB<br/>readings cache, history, streaks")]
  LAM --> BR["Amazon Bedrock<br/>AI Guardian"]
  LAM --> LOC["Amazon Location Service<br/>geocoding and routes"]
  LAM --> EXT["Open-Meteo and OpenAQ<br/>real air data"]
  LAM --> SNS["Amazon SNS<br/>AQI alerts"]
  SM["Secrets Manager"] -.-> LAM
  CW["CloudWatch"] -.-> LAM
  classDef aws fill:#fff7ed,stroke:#92580c,color:#111110
  classDef ext fill:#ffffff,stroke:#54524c,color:#111110
  classDef user fill:#1e3f32,stroke:#1e3f32,color:#ffffff
  class AMP,APIGW,LAM,DDB,BR,LOC,SNS,SM,CW aws
  class EXT ext
  class U user
```

| Today | Planned on AWS | Why |
| :-- | :-- | :-- |
| Gemini key in the browser | **Bedrock** behind Lambda | Keys stay server-side |
| Leaflet + OpenStreetMap | **Amazon Location Service** | Managed routes and geocoding |
| `localStorage` profile | **DynamoDB** (opt-in sync) | Multi-device history |
| Static demo scenarios | **DynamoDB** scenarios table | Editable without redeploy |
| None | **SNS** alerts | Notify when AQI crosses 250 |
| Local dev server | **Amplify Hosting** | Auto-deploy from git, HTTPS, CDN |

---

## 14. Limitations and disclaimer

> **AirGuard is a hackathon prototype. Exposure scores are informational estimates, not medical advice.** The model is a transparent demo formula, not a clinically validated one. Talk to a doctor about health decisions.

| Area | Current state | Next step |
| :-- | :-- | :-- |
| Exposure model | Simple multiplicative demo model | Calibrate against published dose-response studies |
| Sensor | Simulated unless an ESP32 is attached | Validate with a real PMS5003 |
| Hotspots and route scores | Generated around the user from rules | Use real traffic and land-use data |
| AI key | Stored in browser `localStorage` | Proxy through a backend |
| Forecast | Open-Meteo model output | Add local station calibration |
| AI model ID | A specific Gemini Flash version | Confirm the version is still served before demo day |

---

<p align="center"><sub>AirGuard · Hackathon engineering documentation · v1.3.0</sub></p>
