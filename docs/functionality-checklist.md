# AirGuard Functionality Checklist

This is the regression reference for the UI/UX upgrade. **No logic, data, or behavior should change.**

## Global / Layout
- [ ] Sidebar Navigation: Clicking each tab (`dashboard`, `live-air`, `exposure`, `map`, `routes`, `best-time`, `ai-guardian`, `sensor`, `insights`) updates the view correctly.
- [ ] Sidebar Streak Widget: Displays the 5-day streak correctly.
- [ ] Header Location Button: Opens the location modal.
- [ ] Header Settings Button: Opens the profile/API settings modal.
- [ ] Header Refresh Button: Triggers data refresh (spins while refreshing).
- [ ] Header Scenario Selector: Dropdown successfully changes the active scenario, updating the UI context.
- [ ] Responsive Layout: Sidebar collapses or changes on mobile, layout adjusts to screen size.

## Dashboard Components
- [ ] **MainAQICard**: Displays AQI, category, and sub-metrics (PM2.5, PM10, NO2, O3).
- [ ] **PersonalExposureCard**: Displays exposure score, risk level, and a button to view detailed exposure.
- [ ] **AIRecommendationCard**: Displays AI text recommendation and a button to ask AirGuard.
- [ ] **BestTimePlanner**: Displays the timeline chart of AQI across hours.
- [ ] **SmartRouteComparison**: Shows two route options, calculates exposure differences.
- [ ] **InteractivePollutionMap**: Renders a map with pollution hotspots and legends.
- [ ] **ActivityRiskCalculator**: Allows selecting activity type and duration, calculates risk score.
- [ ] **LiveSensorMonitor**: Displays simulated hardware sensor data updating in real-time.
- [ ] **InsightsHistory**: Displays historical charts and metrics.
- [ ] **AIGuardianChat**: Chat interface, suggested questions, simulated responses.

## Modals & Contexts
- [ ] **LocationModal**: Input for changing location.
- [ ] **SettingsModal**: Form for user profile and settings.
- [ ] **Demo Mode**: Triggers a sequence of demo updates.
