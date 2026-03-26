import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/apiMethods';
import type { UserProfile } from '../types';
import BottomNav from '../components/BottomNav';

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Basic check for token
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    userApi.getMyProfile()
      .then(setProfile)
      .catch((err) => {
        console.error(err);
      });
  }, [navigate]);

  if (!profile) {
    return <div className="h-screen bg-white"></div>; // Loading
  }

  // Activity logic if added later. Mocking zero logic for pure empty state:
  const statActivities = 0;
  const statLevel = 1;
  const statXP = 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 font-sans">
      {/* Header section w/ Avatar */}
      <div className="bg-white px-4 pt-12 pb-6 flex items-center gap-4 shadow-sm relative">
        <div className="w-20 h-20 rounded-full border-2 border-[#FC5200] overflow-hidden bg-gray-100 flex-shrink-0">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#242428]">
            {profile.displayName} <span className="text-sm font-normal text-gray-500">@{profile.displayName}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Player LV. {statLevel}</p>
        </div>
        
        {/* Settings cog */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-t border-gray-100 flex text-center">
        <div className="flex-1 py-3 border-r border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Activities</p>
          <p className="font-semibold text-lg">{statActivities}</p>
        </div>
        <div className="flex-1 py-3 border-r border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Level</p>
          <p className="font-semibold text-lg">{statLevel}</p>
        </div>
        <div className="flex-1 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">XP</p>
          <p className="font-semibold text-lg">{statXP}</p>
        </div>
      </div>

      {/* Feed area wrapper */}
      <div className="mt-4 px-4 space-y-4">
        <div className="bg-white rounded p-6 shadow-sm flex items-center justify-center min-h-[160px] text-center">
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              You haven't completed any events lately. <br />
              <span className="font-semibold text-[#FC5200] cursor-pointer" onClick={() => navigate('/events')}>Find an event</span> to get started.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}