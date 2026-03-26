import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventsApi } from '../services/apiMethods';
import { useGeolocation } from '../hooks/useGeolocation';
import type { SportEvent, SportType } from '../types';
import BottomNav from '../components/BottomNav';

const SPORT_FILTERS: SportType[] = [
  'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Golf', 'Pickleball',
];

// Custom orange SVG marker
const orangeIcon = L.divIcon({
  className: '',
  html: `<svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z" fill="#FC4C02"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
  </svg>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

export default function DiscoveryHome() {
  const navigate = useNavigate();
  const { coords } = useGeolocation();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);

  useEffect(() => {
    if (!coords) return;
    eventsApi
      .getNearby({
        lat: coords.latitude,
        lng: coords.longitude,
        radius: 10,
        sport: selectedSport ?? undefined,
      })
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, [coords, selectedSport]);

  const userLat = coords?.latitude ?? 37.7749;
  const userLng = coords?.longitude ?? -122.4194;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Search bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex gap-2">
        <div className="flex-1 bg-white rounded-2xl shadow-md flex items-center px-4 py-3 gap-2">
          <input
            className="flex-1 text-sm outline-none placeholder-gray-400 bg-transparent"
            placeholder="Search sports, locations..."
          />
        </div>
      </div>

      <div className="absolute top-20 left-0 w-full overflow-x-auto no-scrollbar z-[400] px-4 pb-2">
        <div className="flex gap-2 min-w-max">
          {SPORT_FILTERS.map((srt) => (
            <button
              key={srt}
              onClick={() => setSelectedSport(selectedSport === srt ? null : srt)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: selectedSport === srt ? 'none' : '1px solid #E8E8EE',
                background: selectedSport === srt ? '#FC5200' : '#FFFFFF',
                color:      selectedSport === srt ? '#FFFFFF' : '#242428',
                fontWeight: selectedSport === srt ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {srt}
            </button>
          ))}
        </div>
      </div>

      <MapContainer
        center={[userLat, userLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <MapUpdater center={[userLat, userLng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => (
          <Marker key={event.eventId} position={[event.latitude, event.longitude]} icon={orangeIcon}>
            <Popup>
              <strong>{event.title}</strong><br />
              {event.locationName}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <button
        onClick={() => navigate('/create-event')}
        style={{
          position: 'absolute', bottom: 90, right: 20,
          width: 52, height: 52,
          borderRadius: '50%',
          background: '#FC4C02',
          border: 'none',
          color: '#fff',
          fontSize: 28,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(252,76,2,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
          zIndex: 400,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#CC4200')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#FC4C02')}
      >
        +
      </button>

      <BottomNav />
    </div>
  );
}
