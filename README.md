# 🌫️ AirGuard — Personal Air Pollution Guardian

> **"AQI tells you what the air is like. AirGuard tells you what to do about it."**

AirGuard is an AI-powered personal environmental health guardian. Rather than simply displaying ambient Air Quality Index (AQI) values, AirGuard estimates an individual user's physiological pollution intake and delivers personalized, context-aware decisions for their day.

---

## 🌟 Key Features

1. **Ambient Air Quality Monitor (NAQI Standards)**
   - Real-time AQI gauge with fine particulate telemetry (PM2.5, PM10, NO₂, O₃, SO₂, CO).
   - Categorized according to the Indian National Air Quality Index (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).

2. **Personal Physiological Exposure Score (0–100)**
   - Calculates personalized exposure using the **AirGuard Exposure Model**:
     $$\text{Exposure Score} = \text{Pollution Factor} \times \text{Duration Factor} \times \text{Activity Multiplier} \times \text{Vulnerability Factor}$$
   - Personalizes for user age, pre-existing conditions (e.g., Asthma), and sensitivity levels.

3. **Interactive Pollution Heatmap (Leaflet)**
   - Real-time geospatial rendering of pollution zones (Residential, Market, School, Highway, Industrial).
   - Interactive hotspot drilldown: NH-91 Highway Junction, Industrial Zone Phase-III, Main Market, Campus Zone, and Botanical Sanctuary.

4. **Smart Route Comparison (Exposure vs. Travel Time)**
   - Compare **Route A (Fastest highway route)** vs. **Route B (Low-exposure botanical canopy route)**.
   - Demonstrates that a mere 4-minute difference cuts personal PM2.5 inhalation by **48%**.

5. **Diurnal Best Time Outdoor Planner**
   - High-resolution area forecast modeling atmospheric planetary boundary layer dissipation.
   - Highlights the recommended morning clean window: **6:00 AM – 7:30 AM**.

6. **Activity Risk Calculator**
   - Dynamic simulation comparing walking, running, cycling, sitting, and outdoor sports across variable durations (15m, 30m, 1h, 2h).

7. **AI Guardian Assistant (Google Gemini / LangChain Architecture)**
   - Pre-populated decision prompts: *"Can I go running now?"*, *"What's the safest time?"*, *"Which route should I take?"*, *"Campus safety check"*.
   - Connects to Google Gemini API or runs with built-in zero-latency rule intelligence for hackathon stage demos.

8. **Live ESP32 Hardware IoT Stream**
   - Simulated telemetry stream representing an ESP32 + Plantower PMS5003 laser sensor node.
   - Dynamic indoor vs. outdoor particulate differential calculation.

9. **Scenario Selector & Hackathon Demo Mode**
   - 1-click presets: *Normal Day*, *High Pollution Day*, *Traffic Rush Hour*, *School Safety Alert*, *Industrial Pollution*.
   - **🎬 Hackathon Demo Mode**: Guided auto-advancing 8-step demo tour designed for 2–3 minute presentations.

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠 Tech Stack

- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Visuals & Charts**: Recharts, Lucide React
- **Geospatial Maps**: Leaflet, React-Leaflet
- **AI Engine**: Google Gemini API / LangChain architecture with fallback logic
