import React, { useState, useEffect } from 'react';
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
  Flame,
  Layers,
  Info,
  Maximize2,
  Navigation,
} from 'lucide-react';
import { useAirGuard } from '../context/AirGuardContext';
import { Hotspot } from '../types';

// Custom leaflet icon helper
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        border-radius: 9999px;
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        <span style="font-size: 10px;">📍</span> ${label}
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

  const [activeLayer, setActiveLayer] = useState<'all' | 'hotspots' | 'routes'>('all');

  const centerCoords: [number, number] = currentLocation.coordinates || [28.629, 77.368];

  const getHotspotColor = (aqi: number) => {
    if (aqi > 300) return '#ef4444'; // Very poor / severe
    if (aqi > 200) return '#f97316'; // Poor
    if (aqi > 100) return '#f59e0b'; // Moderate
    return '#10b981'; // Good
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Interactive Pollution Heatmap & Zones
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial particulate telemetry, canopy microclimates & congestion plumes
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <span className="text-[11px] text-slate-400 uppercase font-bold">AQI Legend:</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Good
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate
          </span>
          <span className="flex items-center gap-1 text-orange-700">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Poor
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Severe
          </span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[380px] rounded-xl overflow-hidden mt-4 border border-slate-200 shadow-inner">
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
            icon={createCustomIcon('#3b82f6', currentLocation.name)}
          >
            <Popup>
              <div className="p-1 font-sans">
                <div className="font-bold text-xs text-blue-600">📍 Active Location</div>
                <div className="text-[11px] text-slate-800 font-semibold mt-0.5">{currentLocation.name}</div>
                <div className="text-[10px] text-slate-500">{currentLocation.city}</div>
              </div>
            </Popup>
          </Marker>

          {/* Hotspots Heatmap Circles & Markers */}
          {hotspots.map((h) => {
            const color = getHotspotColor(h.aqi);
            return (
              <React.Fragment key={h.id}>
                {/* Simulated pollution dispersion radius */}
                <Circle
                  center={h.coordinates}
                  radius={h.type === 'highway' ? 850 : 600}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.28,
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
                    <div className="p-1 font-sans">
                      <div className="font-bold text-xs text-slate-800">{h.name}</div>
                      <div className="text-[11px] font-bold mt-1" style={{ color }}>
                        AQI {h.aqi} • {h.deltaText}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{h.description}</div>
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
              opacity: 0.85,
              dashArray: selectedRoute.id === 'route-clean' ? '8, 8' : undefined,
            }}
          />
        </MapContainer>

        {/* Floating Active Route Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-md z-[1000] text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Overlay: {selectedRoute.tag}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {selectedRoute.durationMinutes} min • Exposure: {selectedRoute.exposureScore}/100
          </div>
        </div>
      </div>

      {/* Hotspots Quick Cards Strip */}
      <div className="mt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
          <span>Nearby Pollution Hotspots (Click to inspect)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hotspots.slice(0, 4).map((h) => {
            const color = getHotspotColor(h.aqi);
            const isChosen = selectedHotspot?.id === h.id;
            return (
              <div
                key={h.id}
                onClick={() => setSelectedHotspot(h)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isChosen
                    ? 'border-indigo-500 bg-indigo-50/20 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate mr-2">
                    {h.name}
                  </span>
                  <span
                    className="text-xs font-black px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    AQI {h.aqi}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-1">
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
