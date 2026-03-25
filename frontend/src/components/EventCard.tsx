import type { SportEvent } from '../types';

interface EventCardProps {
  event: SportEvent;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
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