import { useNavigate, useLocation } from 'react-router-dom';
import type { SportEvent } from '../types';

// ─── Bottom navigation bar ───────────────────────────────────────────────────
type NavTab = 'home' | 'schedule' | 'chat' | 'profile';

interface BottomNavProps {
  active: NavTab;
}

export function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();

  const tabs: { id: NavTab; path: string; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home', path: '/', label: 'Home',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 9.5L11 3L19 9.5V19H14V14H8V19H3V9.5Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
    },
    {
      id: 'schedule', path: '/schedule', label: 'Schedule',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M7 2V5M15 2V5M3 9H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'chat', path: '/chat', label: 'Chat',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 4H18C18.6 4 19 4.4 19 5V14C19 14.6 18.6 15 18 15H7L3 19V5C3 4.4 3.4 4 4 4Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      ),
    },
    {
      id: 'profile', path: '/profile', label: 'Profile',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-40">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
              active === tab.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;

// ─── Event card (used in list view) ─────────────────────────────────────────
interface EventCardProps {
  event: SportEvent;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const spotsLeft = event.maxPlayers - event.currentPlayers;
  const isFull = spotsLeft <= 0;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm text-left flex gap-4 items-center"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {event.sport}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isFull
              ? 'bg-red-50 text-red-600'
              : 'bg-green-50 text-green-700'
          }`}>
            {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 truncate">{event.locationName}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date(event.eventDate).toLocaleString([], {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>{event.currentPlayers}/{event.maxPlayers} players</span>
          <span>·</span>
          <span>{event.requiredSkill}</span>
          <span>·</span>
          <span>by {event.organizerName}</span>
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300 flex-shrink-0">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
