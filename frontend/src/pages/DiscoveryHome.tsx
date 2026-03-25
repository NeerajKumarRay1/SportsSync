import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventsApi } from '../services/apiMethods';
import { useGeolocation } from '../hooks/useGeolocation';
import type { SportEvent, SportType } from '../types';
import BottomNav from '../components/BottomNav';
import EventCard from '../components/EventCard';

const SPORT_FILTERS: SportType[] = [
  'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Golf', 'Pickleball',
];

// Custom blue pin marker
const pinIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:40px;height:40px;background:#2563eb;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);border:3px solid #fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.25);
    display:flex;align-items:center;justify-content:center;">
    <svg style="transform:rotate(45deg)" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5C5.5 2.5 3.5 4.5 3.5 7C3.5 10.5 8 13.5 8 13.5C8 13.5 12.5 10.5 12.5 7C12.5 4.5 10.5 2.5 8 2.5Z" fill="white" opacity="0.9"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function DiscoveryHome() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const { coords, error: geoError } = useGeolocation();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeSport, setActiveSport] = useState<SportType | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);

  // ── Init Leaflet map ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current, {
      center: [coords?.latitude ?? 37.7749, coords?.longitude ?? -122.4194],
      zoom: 13,
      zoomControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: 'Leaflet | © CartoDB',
    }).addTo(mapInstance.current);
    markersLayer.current = L.layerGroup().addTo(mapInstance.current);
  }, []);

  // ── Fly to user location once available ────────────────────────────────────
  useEffect(() => {
    if (coords && mapInstance.current) {
      mapInstance.current.flyTo([coords.latitude, coords.longitude], 13, {
        animate: true,
        duration: 1,
      });
    }
  }, [coords]);

  // ── Fetch events whenever location or sport filter changes ─────────────────
  useEffect(() => {
    if (!coords) return;
    setIsLoading(true);
    setApiError(null);
    eventsApi
      .getNearby({
        lat: coords.latitude,
        lng: coords.longitude,
        radius: 10,
        sport: activeSport ?? undefined,
      })
      .then((data) => {
        setEvents(data);
        renderMarkers(data);
      })
      .catch((err) => {
        setApiError(err?.response?.data?.message ?? 'Failed to load events.');
      })
      .finally(() => setIsLoading(false));
  }, [coords, activeSport]);

  const renderMarkers = (evts: SportEvent[]) => {
    markersLayer.current?.clearLayers();
    evts.forEach((evt) => {
      const marker = L.marker([evt.latitude, evt.longitude], { icon: pinIcon });
      marker.on('click', () => setSelectedEvent(evt));
      markersLayer.current?.addLayer(marker);
    });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Search bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
        <div className="flex-1 bg-white rounded-2xl shadow-md flex items-center px-4 py-3 gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="flex-1 text-sm outline-none placeholder-gray-400 bg-transparent"
            placeholder="Search sports, locations..."
          />
        </div>
        <button
          onClick={() => setViewMode((v) => (v === 'map' ? 'list' : 'map'))}
          className="bg-white shadow-md rounded-2xl w-11 h-11 flex items-center justify-center text-gray-600"
        >
          {viewMode === 'map' ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="4" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="8" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="1" y="12" width="16" height="2" rx="1" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 9L6 2L11 6L16 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M1 15L6 10L11 13L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          )}
        </button>
      </div>

      {/* Sport filter pills */}
      <div className="absolute top-20 left-0 right-0 z-20 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2" style={{ width: 'max-content' }}>
          <button
            onClick={() => setActiveSport(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeSport === null
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            All
          </button>
          {SPORT_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSport(activeSport === s ? null : s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSport === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Map view */}
      {viewMode === 'map' && (
        <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="absolute inset-0 overflow-y-auto pt-28 pb-24 px-4 z-10 bg-gray-50">
          {isLoading && (
            <div className="flex justify-center pt-10">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {apiError && (
            <p className="text-center text-sm text-red-500 mt-6">{apiError}</p>
          )}
          {!isLoading && events.length === 0 && !apiError && (
            <p className="text-center text-sm text-gray-400 mt-10">
              No events found nearby. Be the first to create one!
            </p>
          )}
          <div className="space-y-3">
            {events.map((evt) => (
              <EventCard key={evt.eventId} event={evt} onClick={() => setSelectedEvent(evt)} />
            ))}
          </div>
        </div>
      )}

      {/* Loading overlay on map */}
      {viewMode === 'map' && isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600">Finding games…</span>
        </div>
      )}

      {/* FAB — create event */}
      <button
        onClick={() => navigate('/create-event')}
        className="absolute bottom-24 right-4 z-20 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Bottom sheet — selected event */}
      {selectedEvent && (
        <div className="absolute bottom-16 left-4 right-4 z-30 bg-white rounded-2xl shadow-xl p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                {selectedEvent.sport}
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-0.5">
                {selectedEvent.locationName}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(selectedEvent.eventDate).toLocaleString([], {
                  weekday: 'short', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="flex gap-3 text-sm text-gray-600 mb-4">
            <span>{selectedEvent.currentPlayers}/{selectedEvent.maxPlayers} players</span>
            <span>·</span>
            <span>{selectedEvent.requiredSkill}</span>
            <span>·</span>
            <span className={`font-medium ${selectedEvent.status === 'OPEN' ? 'text-green-600' : 'text-red-500'}`}>
              {selectedEvent.status}
            </span>
          </div>
          {selectedEvent.status === 'OPEN' && (
            <button
              onClick={() => eventsApi.join(selectedEvent.eventId).then(() => setSelectedEvent(null))}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Join game
            </button>
          )}
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
