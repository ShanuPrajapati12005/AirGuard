import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  AlertOctagon,
  Navigation,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Custom leaflet icon helper
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        border-radius: 9999px;
        padding: 3px 8px;
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
        font-family: 'Instrument Sans', system-ui, sans-serif;
      ">
        <span>📍</span> ${label}
      </div>
    `,
    iconSize: [0, 0],
  });
};

// Component to smoothly pan the map when location changes
const MapViewUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
};

export const InteractivePollutionMap: React.FC = () => {
  const {
    currentLocation,
    hotspots,
    selectedHotspot,
    setSelectedHotspot,
    selectedRoute,
  } = useAirGuard();

  const centerCoords: [number, number] = currentLocation.coordinates || [28.629, 77.368];

  const getHotspotColor = (aqi: number) => {
    if (aqi > 300) return '#ef4444'; // Severe
    if (aqi > 200) return '#f97316'; // Poor
    if (aqi > 100) return '#a8741f'; // Moderate
    return '#13a56b'; // Good
  };

  return (
    <div className="card p-3.5 sm:p-5 border border-[var(--line)] shadow-[var(--sh)]">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--ac)]/10 text-[var(--ac)] flex items-center justify-center border border-[var(--ac)]/20 shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-display text-base font-medium text-[var(--ink)]">
              Geospatial Pollution Heatmap
            </h3>
          </div>
          <p className="text-xs text-[var(--mut)] mt-1 font-normal">
            Microclimate satellite telemetry, vegetative corridors & traffic emission plumes
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 bg-[var(--bg)] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[var(--line)] text-[10px] sm:text-xs shadow-2xs">
          <span className="text-[9px] sm:text-[10px] text-[var(--mut)] uppercase font-semibold">Scale:</span>
          <span className="flex items-center gap-1 text-[var(--ok)] font-medium">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--ok)]"></span> Good
          </span>
          <span className="flex items-center gap-1 text-[var(--ac2)] font-medium">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--ac2)]"></span> Mod
          </span>
          <span className="flex items-center gap-1 text-orange-600 font-medium">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500"></span> Poor
          </span>
          <span className="flex items-center gap-1 text-rose-600 font-medium">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500"></span> Severe
          </span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[320px] sm:h-[400px] rounded-[12px] overflow-hidden mt-3 sm:mt-4 border border-[var(--line)]">
        <MapContainer
          center={centerCoords}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <MapViewUpdater center={centerCoords} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Current Location Pin */}
          <Marker
            position={centerCoords}
            icon={createCustomIcon('var(--ac)', currentLocation.name)}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <div className="font-semibold text-[var(--ac)]">📍 Active Telemetry Station</div>
                <div className="font-medium text-[var(--ink)] mt-0.5">{currentLocation.name}</div>
                <div className="text-[11px] text-[var(--mut)]">{currentLocation.city}</div>
              </div>
            </Popup>
          </Marker>

          {/* Hotspots Heatmap Circles & Markers */}
          {hotspots.map((h) => {
            const color = getHotspotColor(h.aqi);
            return (
              <React.Fragment key={h.id}>
                <Circle
                  center={h.coordinates}
                  radius={h.type === 'highway' ? 850 : 600}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.25,
                    stroke: true,
                    color: color,
                    weight: 1.5,
                  }}
                />
                <Marker
                  position={h.coordinates}
                  icon={createCustomIcon(color, `${h.name.split(' ')[0]} ${h.aqi}`)}
                  eventHandlers={{
                    click: () => setSelectedHotspot(h),
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs">
                      <div className="font-semibold text-[var(--ink)]">{h.name}</div>
                      <div className="font-medium mt-0.5" style={{ color }}>
                        AQI {h.aqi} • {h.deltaText}
                      </div>
                      <div className="text-[10px] text-[var(--mut)] mt-1">{h.description}</div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Active Route Overlay */}
          <Polyline
            positions={selectedRoute.coordinates}
            pathOptions={{
              color: selectedRoute.exposureColor,
              weight: 5,
              opacity: 0.9,
              dashArray: selectedRoute.id === 'route-clean' ? '8, 8' : undefined,
            }}
          />
        </MapContainer>

        {/* Floating Active Route Badge */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 max-w-[calc(100%-1.5rem)] sm:max-w-xs card bg-[var(--card)]/90 backdrop-blur-md p-2 sm:p-3 rounded-[9px] border border-[var(--line)] shadow-md z-[1000] text-[10px] sm:text-xs">
          <div className="font-medium text-[var(--ink)] flex items-center gap-1.5 sm:gap-2 truncate">
            <Navigation className="w-3.5 h-3.5 text-[var(--ac)] shrink-0" />
            <span className="truncate">Active: {selectedRoute.tag}</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[var(--mut)] mt-0.5 font-mono truncate">
            {selectedRoute.durationMinutes} min • Score: {selectedRoute.exposureScore}/100
          </div>
        </div>
      </div>

      {/* Hotspots Quick Cards Strip */}
      <div className="mt-4 sm:mt-5">
        <h4 className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[var(--mut)] mb-2 flex items-center gap-1.5 ml-1">
          <AlertOctagon className="w-3.5 h-3.5 text-[var(--ac2)]" />
          <span>Local Microclimate Hotspots</span>
        </h4>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {hotspots.slice(0, 4).map((h) => {
            const color = getHotspotColor(h.aqi);
            const isChosen = selectedHotspot?.id === h.id;
            return (
              <div
                key={h.id}
                onClick={() => setSelectedHotspot(h)}
                className={cn(
                  "card p-3 transition-all cursor-pointer shadow-2xs",
                  isChosen
                    ? "border-[var(--ac)] bg-[var(--ac)]/5"
                    : "border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--card)] hover:border-[var(--line)]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-medium text-[var(--ink)] truncate mr-2">
                    {h.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold px-2 py-0.2"
                    style={{ backgroundColor: `${color}15`, color, borderColor: `${color}35` }}
                  >
                    AQI {h.aqi}
                  </Badge>
                </div>
                <div className="text-[11px] text-[var(--mut)] mt-1.5">
                  {h.deltaText}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
