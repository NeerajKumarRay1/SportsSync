import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventsApi } from '../services/apiMethods';
import { useGeolocation } from '../hooks/useGeolocation';
import type { SportType, SkillLevel, CreateEventPayload } from '../types';

const SPORTS: SportType[] = ['Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Golf', 'Pickleball'];
const SKILLS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

type Step = 'details' | 'location';

interface FormState {
  sport: SportType;
  date: string;
  time: string;
  maxPlayers: number;
  requiredSkill: SkillLevel;
  latitude: number | null;
  longitude: number | null;
  locationName: string;
}

const INITIAL: FormState = {
  sport: 'Basketball',
  date: '',
  time: '',
  maxPlayers: 10,
  requiredSkill: 'Intermediate',
  latitude: null,
  longitude: null,
  locationName: '',
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const { coords } = useGeolocation();

  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<FormState>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Map refs ────────────────────────────────────────────────────────────────
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const pinMarker = useRef<L.Marker | null>(null);

  // ── Init location picker map ─────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'location' || !mapRef.current || mapInstance.current) return;

    const center: [number, number] = coords
      ? [coords.latitude, coords.longitude]
      : [37.7749, -122.4194];

    mapInstance.current = L.map(mapRef.current, { center, zoom: 14, zoomControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: 'Leaflet | © CartoDB',
    }).addTo(mapInstance.current);

    // Draggable pin
    pinMarker.current = L.marker(center, { draggable: true }).addTo(mapInstance.current);
    pinMarker.current.on('dragend', async () => {
      const pos = pinMarker.current!.getLatLng();
      setForm((f) => ({ ...f, latitude: pos.lat, longitude: pos.lng }));
      // Reverse geocode via Nominatim (free, no key needed)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`,
        );
        const data = await res.json();
        setForm((f) => ({ ...f, locationName: data.display_name?.split(',').slice(0, 2).join(', ') ?? '' }));
      } catch {
        // ignore reverse geocode errors
      }
    });

    // Tap to move pin
    mapInstance.current.on('click', async (e) => {
      pinMarker.current?.setLatLng(e.latlng);
      setForm((f) => ({ ...f, latitude: e.latlng.lat, longitude: e.latlng.lng }));
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`,
        );
        const data = await res.json();
        setForm((f) => ({ ...f, locationName: data.display_name?.split(',').slice(0, 2).join(', ') ?? '' }));
      } catch { /* ignore */ }
    });

    // Set initial coords from geolocation
    if (coords) {
      setForm((f) => ({
        ...f,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    }
  }, [step, coords]);

  const handleSubmit = async () => {
    setError(null);
    if (!form.latitude || !form.longitude) {
      setError('Please pick a location on the map.');
      return;
    }
    if (!form.date || !form.time) {
      setError('Date and time are required.');
      return;
    }

    const eventDate = new Date(`${form.date}T${form.time}`);
    if (eventDate <= new Date()) {
      setError('Event must be scheduled in the future.');
      return;
    }

    const payload: CreateEventPayload = {
      sport: form.sport,
      eventDate: eventDate.toISOString(),
      maxPlayers: form.maxPlayers,
      requiredSkill: form.requiredSkill,
      latitude: form.latitude,
      longitude: form.longitude,
      locationName: form.locationName,
    };

    setIsSubmitting(true);
    try {
      await eventsApi.create(payload);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Today's date string for min attribute ────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 border-b border-gray-100">
        <button
          onClick={() => (step === 'location' ? setStep('details') : navigate(-1))}
          className="text-gray-600"
        >
          {step === 'location' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          {step === 'details' ? 'Event Details' : 'Select Location'}
        </h1>
      </div>

      {/* ── Step 1: Details ─────────────────────────────────────────────────── */}
      {step === 'details' && (
        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-6">
          {/* Sport */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Sport
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, sport: s }))}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    form.sport === s
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Max players */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Max Players
            </label>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
              <button
                onClick={() => setForm((f) => ({ ...f, maxPlayers: Math.max(2, f.maxPlayers - 1) }))}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 font-bold text-lg"
              >
                −
              </button>
              <span className="flex-1 text-center text-xl font-bold text-gray-900">
                {form.maxPlayers}
              </span>
              <button
                onClick={() => setForm((f) => ({ ...f, maxPlayers: Math.min(50, f.maxPlayers + 1) }))}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Skill level */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Required Skill
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SKILLS.map((s) => (
                <button
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, requiredSkill: s }))}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    form.requiredSkill === s
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Location picker ─────────────────────────────────────────── */}
      {step === 'location' && (
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: '60vh' }} />
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            <p className="text-xs text-gray-400 mb-1">Selected location</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {form.locationName || 'Tap or drag pin to set location'}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-5 pb-2">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4">
        {step === 'details' ? (
          <button
            onClick={() => setStep('location')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            Select Location
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !form.latitude}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-2xl text-sm transition-colors"
          >
            {isSubmitting ? 'Creating…' : 'Create Event'}
          </button>
        )}
      </div>
    </div>
  );
}
