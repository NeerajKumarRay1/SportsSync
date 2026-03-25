import { useState } from 'react';
import { userApi } from '../services/apiMethods';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

const SKILL_LABELS = ['', 'Beginner', 'Beginner+', 'Intermediate', 'Advanced', 'Elite'];

export default function PlayerDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');

  const { data: profile, isLoading, error, refetch } = useApi(
    () => userApi.getMyProfile(),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-500">{error}</p>
        <button onClick={refetch} className="text-sm text-blue-600 font-medium">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header card */}
      <div className="bg-gray-900 pt-14 pb-8 px-5 relative">
        {/* Edit button */}
        <button className="absolute top-12 right-5 text-gray-400 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gray-600 overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.displayName?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>
            {/* Rating badge */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900
              text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
              ★ {profile?.reputationScore?.toFixed(1) ?? '—'}
            </div>
          </div>

          <h2 className="text-white font-bold text-xl mt-2">{profile?.displayName}</h2>

          {profile?.verified && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-gray-300 text-sm">Verified Player</span>
            </div>
          )}
        </div>

        {/* Tab toggle */}
        <div className="bg-gray-800 rounded-full p-1 flex mt-5">
          {(['stats', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                activeTab === t ? 'bg-white text-gray-900' : 'text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-3">
        {activeTab === 'stats' && profile && (
          <>
            {/* Bio */}
            {profile.bio && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">About</p>
                <p className="text-sm text-gray-700">{profile.bio}</p>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Games played" value={profile.gamesPlayed} />
              <StatCard label="Organized" value={profile.gamesOrganized} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-600 rounded-2xl p-4 shadow-sm">
                <p className="text-blue-200 text-xs uppercase tracking-wide mb-1">Primary sport</p>
                <p className="text-white font-bold text-base">{profile.primarySport ?? '—'}</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 shadow-sm">
                <p className="text-green-700 text-xs uppercase tracking-wide mb-1">Reliability</p>
                <p className="text-green-700 font-bold text-2xl">{profile.reliabilityPct}%</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Skill level</p>
              <p className="text-sm font-semibold text-gray-800">
                {SKILL_LABELS[profile.skillLevel] ?? `Level ${profile.skillLevel}`}
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(profile.skillLevel / 5) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-3">
            <SettingsRow label="Edit profile" />
            <SettingsRow label="Notification preferences" />
            <SettingsRow label="Privacy settings" />
            <SettingsRow label="Blocked users" />
            <button
              onClick={logout}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left text-red-500 text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      <BottomNav active="profile" />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SettingsRow({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
      <span className="text-sm text-gray-700">{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
