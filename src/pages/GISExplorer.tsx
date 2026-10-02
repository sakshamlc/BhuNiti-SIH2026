import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useData } from '../context/DataContext';
import { District } from '../types';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  MapPin,
  Satellite,
  Compass,
  Filter,
  Info,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  TreePine,
  Building2,
  Scale,
} from 'lucide-react';

type GISLayerType = 'climate' | 'digitization' | 'urban' | 'ndvi' | 'disputes' | 'landuse';

// Component to dynamically re-center map when state or district is selected
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const GISExplorer: React.FC = () => {
  const { districts, language } = useData();
  const navigate = useNavigate();

  const [activeLayer, setActiveLayer] = useState<GISLayerType>('climate');
  const [basemap, setBasemap] = useState<'osm' | 'satellite'>('osm');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Filter districts by state
  const filteredDistricts = useMemo(() => {
    if (selectedState === 'all') return districts;
    return districts.filter(d => d.state === selectedState);
  }, [districts, selectedState]);

  // Unique states
  const statesList = useMemo(() => {
    return Array.from(new Set(districts.map(d => d.state))).sort();
  }, [districts]);

  // Map center logic
  const mapCenter: [number, number] = useMemo(() => {
    if (selectedDistrict) {
      return [selectedDistrict.lat, selectedDistrict.lng];
    }
    if (selectedState !== 'all') {
      const match = districts.find(d => d.state === selectedState);
      if (match) return [match.lat, match.lng];
    }
    return [22.5, 82.0]; // Geographic center of India
  }, [selectedDistrict, selectedState, districts]);

  const mapZoom = selectedDistrict ? 8 : selectedState !== 'all' ? 6 : 5;

  // Layer details configuration
  const layerMeta: Record<
    GISLayerType,
    {
      title: string;
      description: string;
      colorScale: string;
      getValue: (d: District) => number | string;
      format: (val: number | string) => string;
      legendMin: string;
      legendMax: string;
      getColor: (d: District) => string;
      getRadius: (d: District) => number;
    }
  > = {
    climate: {
      title: 'Climate Vulnerability Index',
      description: 'Hazard susceptibility score combining flood inundation, coastal erosion & soil degradation.',
      colorScale: 'Green (Low: 40) → Red (Critical: 90)',
      getValue: d => d.climateVulnerabilityIndex,
      format: v => `${v} / 100`,
      legendMin: '40 (Low)',
      legendMax: '90 (Critical Hazard)',
      getColor: d => {
        const v = d.climateVulnerabilityIndex;
        if (v > 75) return '#ef4444'; // Red
        if (v > 60) return '#f97316'; // Orange
        if (v > 50) return '#eab308'; // Yellow
        return '#10b981'; // Green
      },
      getRadius: d => Math.max(10, (d.climateVulnerabilityIndex || 50) / 4),
    },
    digitization: {
      title: 'Cadastral Vectorization %',
      description: 'Percentage of revenue village cadastre maps digitized and integrated with RoR.',
      colorScale: 'Yellow (80%) → Emerald (99%+)',
      getValue: d => d.digitizedRecordsPct,
      format: v => `${v}%`,
      legendMin: '80%',
      legendMax: '99.8%',
      getColor: d => {
        const v = d.digitizedRecordsPct;
        if (v >= 98) return '#059669';
        if (v >= 92) return '#10b981';
        if (v >= 85) return '#3b82f6';
        return '#f59e0b';
      },
      getRadius: d => Math.max(10, ((d.digitizedRecordsPct || 70) - 70) / 1.8),
    },
    urban: {
      title: 'Urban Expansion & Fringe Growth',
      description: 'Annual rate of agricultural to non-agricultural conversion in peri-urban corridors.',
      colorScale: 'Blue (3%) → Deep Violet (11%)',
      getValue: d => d.urbanExpansionRate,
      format: v => `${v}% / yr`,
      legendMin: '3.5%',
      legendMax: '11.2%',
      getColor: d => {
        const v = d.urbanExpansionRate;
        if (v > 9) return '#7c3aed';
        if (v > 7) return '#6366f1';
        if (v > 5) return '#0284c7';
        return '#0d9488';
      },
      getRadius: d => Math.max(10, (d.urbanExpansionRate || 4) * 2.2),
    },
    ndvi: {
      title: 'NDVI Vegetation Greenness Index',
      description: 'Multi-spectral satellite vegetation vitality derived from Sentinel-2 & Resourcesat.',
      colorScale: 'Ochre (0.28) → Lush Green (0.84)',
      getValue: d => d.ndviScore,
      format: v => `${v}`,
      legendMin: '0.28 (Arid/Built)',
      legendMax: '0.84 (Dense Forest/Canopy)',
      getColor: d => {
        const v = d.ndviScore;
        if (v >= 0.7) return '#15803d';
        if (v >= 0.55) return '#22c55e';
        if (v >= 0.4) return '#84cc16';
        return '#eab308';
      },
      getRadius: d => Math.max(10, (d.ndviScore || 0.5) * 24),
    },
    disputes: {
      title: 'Pending Land Litigation Volume',
      description: 'Active revenue court and title demarcation disputes awaiting adjudication.',
      colorScale: 'Green (2k) → Crimson (9k cases)',
      getValue: d => d.disputes?.pending ?? 0,
      format: v => `${Number(v).toLocaleString()} cases`,
      legendMin: '1,900',
      legendMax: '9,000+',
      getColor: d => {
        const v = d.disputes?.pending ?? 0;
        if (v > 6500) return '#dc2626';
        if (v > 4500) return '#ea580c';
        if (v > 3000) return '#f59e0b';
        return '#10b981';
      },
      getRadius: d => Math.max(10, (d.disputes?.pending ?? 2000) / 400),
    },
    landuse: {
      title: 'Dominant Land-Use Zone',
      description: 'Primary territorial classification across surveyed taluks.',
      colorScale: 'Green (Agri) | Emerald (Forest) | Violet (Urban)',
      getValue: d => d.landUse?.urban ?? 0,
      format: v => `Urban ${v}%`,
      legendMin: 'Rural Agri Dominant',
      legendMax: 'Metropolitan Urban Core',
      getColor: d => {
        if ((d.landUse?.urban ?? 0) > 40) return '#6366f1';
        if ((d.landUse?.forest ?? 0) > 30) return '#059669';
        return '#10b981';
      },
      getRadius: () => 14,
    },
  };

  const currentMeta = layerMeta[activeLayer];

  // Top 5 ranking for current layer
  const topRanked = useMemo(() => {
    return [...filteredDistricts]
      .sort((a, b) => {
        const valA = Number(currentMeta.getValue(a)) || 0;
        const valB = Number(currentMeta.getValue(b)) || 0;
        return valB - valA;
      })
      .slice(0, 5);
  }, [filteredDistricts, currentMeta]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              Item 10: GIS Visualization & Geospatial Intelligence
            </span>
            <span className="text-xs text-slate-500">• 6 Dynamic Layers • OpenStreetMap & Esri Satellite</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            National Cadastral & Land Use GIS Explorer
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Interactive spatial visualization of 40 pilot districts across 15 states, correlating cadastral boundaries with climate risk, urban expansion, and litigation hotspots.
          </p>
        </div>

        {/* Basemap Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setBasemap('osm')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              basemap === 'osm'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Standard OSM
          </button>
          <button
            onClick={() => setBasemap('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              basemap === 'satellite'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            Esri World Imagery
          </button>
        </div>
      </div>

      {/* Layer Toggle Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layer:
          </span>

          {(
            [
              { id: 'climate', label: '1. Climate Vulnerability', icon: ShieldAlert },
              { id: 'digitization', label: '2. Cadastral Digitization %', icon: Building2 },
              { id: 'urban', label: '3. Urban Expansion', icon: TrendingUp },
              { id: 'ndvi', label: '4. NDVI Greenness', icon: TreePine },
              { id: 'disputes', label: '5. Litigation Volume', icon: Scale },
              { id: 'landuse', label: '6. Dominant Land Use', icon: MapPin },
            ] as { id: GISLayerType; label: string; icon: React.ComponentType<{ className?: string }> }[]
          ).map(layer => {
            const Icon = layer.icon;
            const active = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  active
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {layer.label}
              </button>
            );
          })}
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedState}
            onChange={e => {
              setSelectedState(e.target.value);
              setSelectedDistrict(null);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All States ({statesList.length} States)</option>
            {statesList.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map & Side Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Leaflet Interactive Map View (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[650px] relative">
          <div className="flex-1 w-full h-full relative z-0">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              className="w-full h-full"
              style={{ background: '#f8fafc' }}
            >
              <MapUpdater center={mapCenter} zoom={mapZoom} />

              {/* Basemap switch */}
              {basemap === 'osm' ? (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              ) : (
                <TileLayer
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              )}

              {/* Render District Circle Markers */}
              {filteredDistricts.map(district => {
                const color = currentMeta.getColor(district);
                const radius = currentMeta.getRadius(district);
                const isSelected = selectedDistrict?.id === district.id;

                return (
                  <CircleMarker
                    key={district.id}
                    center={[district.lat, district.lng]}
                    radius={isSelected ? radius + 4 : radius}
                    pathOptions={{
                      fillColor: color,
                      fillOpacity: isSelected ? 0.9 : 0.75,
                      color: isSelected ? '#ffffff' : '#1e293b',
                      weight: isSelected ? 3 : 1.5,
                    }}
                    eventHandlers={{
                      click: () => setSelectedDistrict(district),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <span className="font-bold text-xs">{district.name}</span>
                      <br />
                      <span className="text-[10px] text-slate-500">
                        {currentMeta.title}: <strong>{currentMeta.format(currentMeta.getValue(district))}</strong>
                      </span>
                    </Tooltip>

                    <Popup>
                      <div className="p-2 space-y-2 text-xs max-w-xs font-sans">
                        <div className="border-b border-slate-100 pb-1.5">
                          <h3 className="font-bold text-slate-900 text-sm">{district.name}</h3>
                          <p className="text-[11px] text-slate-500">{district.state} • {(district.totalParcels || 0).toLocaleString()} Parcels</p>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Digitized Records:</span>
                            <span className="font-bold text-emerald-700">{district.digitizedRecordsPct}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">ULPIN Coverage:</span>
                            <span className="font-bold text-indigo-700">{district.ulpinCoveragePct}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Climate Hazard Index:</span>
                            <span className="font-bold text-amber-700">{district.climateVulnerabilityIndex} / 100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Pending Litigation:</span>
                            <span className="font-bold text-rose-700">{(district.disputes?.pending ?? 0).toLocaleString()} cases</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex gap-2">
                          <button
                            onClick={() => navigate(`/records?district=${encodeURIComponent(district.name)}`)}
                            className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs"
                          >
                            <span>Inspect Parcels</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Floating On-Map Active Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 shadow-lg text-xs max-w-xs">
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
              {currentMeta.title}
            </p>
            <p className="text-[10px] text-slate-500 mb-2 leading-tight">
              {currentMeta.description}
            </p>

            <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600 mb-1" />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>{currentMeta.legendMin}</span>
              <span>{currentMeta.legendMax}</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Selected District & Top Rankings (1 col) */}
        <div className="space-y-4">
          {/* Selected District Card */}
          {selectedDistrict ? (
            <div className="bg-white rounded-2xl border border-emerald-300 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Selected District
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{selectedDistrict.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">State:</span>
                  <span className="font-semibold text-slate-800">{selectedDistrict.state}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Total Surveyed Parcels:</span>
                  <span className="font-mono font-bold text-slate-800">{(selectedDistrict.totalParcels || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Bhu-Aadhaar Coverage:</span>
                  <span className="font-bold text-emerald-700">{selectedDistrict.ulpinCoveragePct}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Pending Litigation:</span>
                  <span className="font-bold text-rose-700">{(selectedDistrict.disputes?.pending ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Avg Resolution Speed:</span>
                  <span className="font-bold text-amber-700">{selectedDistrict.disputes?.avgResolutionDays ?? 'N/A'} days</span>
                </div>
              </div>

              {/* Land Use mini breakdown */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Land Use Composition
                </span>
                <div className="h-3 w-full rounded-md overflow-hidden flex text-[8px] font-bold text-white text-center">
                  <div style={{ width: `${selectedDistrict.landUse?.agri ?? 50}%` }} className="bg-emerald-600" title={`Agri: ${selectedDistrict.landUse?.agri ?? 50}%`}>
                    A
                  </div>
                  <div style={{ width: `${selectedDistrict.landUse?.forest ?? 20}%` }} className="bg-teal-700" title={`Forest: ${selectedDistrict.landUse?.forest ?? 20}%`}>
                    F
                  </div>
                  <div style={{ width: `${selectedDistrict.landUse?.urban ?? 20}%` }} className="bg-indigo-600" title={`Urban: ${selectedDistrict.landUse?.urban ?? 20}%`}>
                    U
                  </div>
                  <div style={{ width: `${selectedDistrict.landUse?.barren ?? 10}%` }} className="bg-amber-500" title={`Barren: ${selectedDistrict.landUse?.barren ?? 10}%`}>
                    B
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Agri: {selectedDistrict.landUse?.agri ?? 0}%</span>
                  <span>Urban: {selectedDistrict.landUse?.urban ?? 0}%</span>
                  <span>Forest: {selectedDistrict.landUse?.forest ?? 0}%</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/records?district=${encodeURIComponent(selectedDistrict.name)}`)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <span>Drill down to Cadastral Parcels</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center space-y-2">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Click Any District Marker</p>
              <p className="text-[11px] text-slate-500">
                Inspect cadastral polygon metrics, disputes, and drill down to village parcels.
              </p>
            </div>
          )}

          {/* Top-5 Ranking for Active Layer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                Top Districts: {currentMeta.title}
              </h3>
              <p className="text-[11px] text-slate-500">Ranked by current metric value</p>
            </div>

            <div className="space-y-2">
              {topRanked.map((d, index) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDistrict(d)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-4 text-[11px] font-bold text-slate-400 font-mono">#{index + 1}</span>
                    <span className="font-semibold text-slate-800 truncate">{d.name}</span>
                    <span className="text-[10px] text-slate-400 truncate">({d.state.slice(0, 10)})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 shrink-0 text-right">
                    {currentMeta.format(currentMeta.getValue(d))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProvenanceFooter
        source="Survey of India / Bhuvan ISRO LISS-IV / State Cadastral GIS Vector Portal"
        version="v2026.08 (OGC WMS / EPSG:4326)"
        assumptions="District circle positions anchored to administrative district headquarters coordinates."
      />
    </div>
  );
};
