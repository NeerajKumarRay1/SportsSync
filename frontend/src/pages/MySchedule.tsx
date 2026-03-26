import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleApi } from '../services/apiMethods';
import { useApi } from '../hooks/useApi';
import type { ScheduleEvent, SportType } from '../types';
import BottomNav from '../components/BottomNav';

const SPORT_ICON: Record<SportType, string> = {
  Basketball: '🏀', Soccer: '⚽', Tennis: '🎾',
  Volleyball: '🏐', Golf: '⛳', Pickleball: '🏓',
};

function formatEventDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) + `, ${time}`;
}

export default function MySchedule() {
  const [tab, setTab] = useState<'PLAYING' | 'ORGANIZING'>('PLAYING');
  const { data: events, isLoading, error, refetch } = useApi(() => scheduleApi.getMyEvents());

  const filtered = (events ?? []).filter((e) => e.role === tab);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Schedule</h1>

        {/* Tab toggle */}
        <div className="bg-gray-100 rounded-full p-1 flex">
          {(['PLAYING', 'ORGANIZING'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-3">
        {isLoading && (
          <div className="flex justify-center pt-16">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center pt-10">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button
              onClick={refetch}
              className="text-sm text-blue-600 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center pt-16">
            <p className="text-gray-400 text-sm">
              {tab === 'PLAYING'
                ? 'No upcoming games. Find one on the map!'
                : 'You haven\'t organized any events yet.'}
            </p>
          </div>
        )}

        {filtered.map((evt) => (
          <ScheduleCard key={evt.eventId} event={evt} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function ScheduleCard({ event }: { event: ScheduleEvent }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/chat/${event.eventId}`)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        background: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #F0F0F5',
        cursor: 'pointer',
        transition: 'background 0.15s',
        marginBottom: 8,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F5')}
      onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
    >
      {/* Sport icon */}
      <div style={{
        width: 44, height: 44,
        borderRadius: 10,
        background: '#FFF0EA',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 22 }}>{SPORT_ICON[event.sport] ?? '🏃'}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, color: '#242428', marginBottom: 2 }}>{event.sport} Game</p>
        <p style={{ fontSize: 12, color: '#FC5200', fontWeight: 500, marginBottom: 2 }}>
          {formatEventDate(event.eventDate)}
        </p>
        <p style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 4 }}>
          📍 {event.locationName}
        </p>
      </div>

      <span style={{ color: '#999', fontSize: 18 }}>›</span>
    </div>
  );
}
