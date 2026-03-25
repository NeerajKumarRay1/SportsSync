import { useState } from 'react';
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

      <BottomNav active="schedule" />
    </div>
  );
}

function ScheduleCard({ event }: { event: ScheduleEvent }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
      {/* Sport icon badge */}
      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
        {SPORT_ICON[event.sport] ?? '🏅'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{event.sport}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
          {formatEventDate(event.eventDate)}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400 flex-shrink-0">
            <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7 6 11 6 11C6 11 9.5 7 9.5 4.5C9.5 2.567 7.933 1 6 1Z"
              stroke="currentColor" strokeWidth="1" fill="none"/>
          </svg>
          <span className="text-xs text-gray-500 truncate">{event.locationName}</span>
        </div>
      </div>

      {/* Chevron */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300 flex-shrink-0">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
