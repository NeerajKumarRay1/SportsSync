import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit2, Star, Shield, LogOut, Settings } from 'lucide-react';
import { userApi } from '../services/apiMethods';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock User State
  const [user, setUser] = useState({
    name: 'Alex D.',
    bio: 'Casual hooper, weekend soccer warrior.',
    primarySport: 'Basketball',
    reputation: '4.8',
    reliability: '98%',
    gamesPlayed: 42,
    gamesOrganized: 12
  });
  
  // Mock Settings State
  const [settings, setSettings] = useState({
    maxRadius: 10,
    radarAlerts: true,
    skillLevel: 'Intermediate',
    pushNotifications: true,
    darkMode: false,
  });


const handleSaveProfile = async () => {
    try {
      await userApi.updateProfile({
        primarySport: user.primarySport,
        // The user form didn't capture skillLevel but adding default/dummy
        bio: user.bio,
      });
      setIsEditing(false);
      // Let parent know to refetch
    } catch (err) {
      console.error('Failed to save profile', err);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 relative pb-24">
      {/* Header Profile Area (Always Visible) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-16 pb-12 rounded-b-[40px] shadow-lg relative text-white">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <img 
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-xl" 
            />
            {/* Reputation Badge */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-3 py-1 rounded-full font-black text-sm shadow-lg flex items-center gap-1 ring-2 ring-slate-800">
              <Star className="w-3 h-3 fill-current" /> {user.reputation}
            </div>
          </div>
          
          {isEditing ? (
            <input 
              type="text" 
              value={user.name} 
              onChange={e => setUser({...user, name: e.target.value})}
              className="mt-4 bg-slate-700 text-white font-black text-2xl text-center rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          ) : (
            <h1 className="mt-4 text-3xl font-black tracking-tight">{user.name}</h1>
          )}
          
          <div className="flex items-center gap-2 mt-2 bg-slate-800/50 px-3 py-1 rounded-full text-slate-300 font-medium text-sm border border-slate-700">
            <Shield className="w-4 h-4 text-emerald-400" /> Verified Player
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6">
          {activeTab === 'profile' && (
             <button 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              >
                {isEditing ? <Check className="w-5 h-5 text-emerald-400" /> : <Edit2 className="w-5 h-5" />}
             </button>
          )}
        </div>
      </div>

       {/* Dynamic Tabs */}
       <div className="flex justify-center -mt-6 relative z-20 px-6">
        <div className="flex bg-white p-1.5 rounded-full shadow-lg border border-slate-100 w-full max-w-sm">
          <motion.div 
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-900 rounded-full shadow-sm"
            initial={false}
            animate={{ 
              x: activeTab === 'profile' ? 0 : '100%' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Stats
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="p-6 mt-4">
        {activeTab === 'profile' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Bio */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">About</h3>
              {isEditing ? (
                <textarea 
                  value={user.bio}
                  onChange={e => setUser({...user, bio: e.target.value})}
                  className="w-full bg-slate-50 text-slate-800 rounded-xl p-3 font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                />
              ) : (
                <p className="text-slate-800 font-medium text-sm leading-relaxed">{user.bio}</p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Games Played</span>
                <span className="text-3xl font-black text-slate-900">{user.gamesPlayed}</span>
              </div>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Organized</span>
                <span className="text-3xl font-black text-slate-900">{user.gamesOrganized}</span>
              </div>
              <div className="bg-blue-600 rounded-3xl p-5 shadow-lg shadow-blue-500/20 text-white flex flex-col justify-center">
                <span className="text-blue-200 font-bold text-xs uppercase tracking-wider mb-1">Primary Sport</span>
                <span className="text-xl font-black">{user.primarySport}</span>
              </div>
              <div className="bg-emerald-50 rounded-3xl p-5 shadow-sm border border-emerald-100 flex flex-col justify-center">
                <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">Reliability</span>
                <span className="text-3xl font-black text-emerald-700">{user.reliability}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             {/* Discovery Settings */}
             <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-6">
                <div>
                  <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                     <Settings className="w-4 h-4" /> Discovery Preferences
                  </h3>
                  
                  {/* Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between font-bold text-sm">
                      <span className="text-slate-800">Max Distance</span>
                      <span className="text-blue-600">{settings.maxRadius} miles</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={settings.maxRadius}
                      onChange={(e) => setSettings({...settings, maxRadius: parseInt(e.target.value)})}
                      className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex justify-between items-center py-2 border-t border-slate-100">
                   <span className="font-bold text-sm text-slate-800">Matchmaking Radar Alerts</span>
                   <button 
                    onClick={() => setSettings({...settings, radarAlerts: !settings.radarAlerts})}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.radarAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                   >
                     <motion.div 
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: settings.radarAlerts ? 24 : 0 }}
                     />
                   </button>
                </div>
             </div>

             {/* Account Actions */}
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <button className="w-full p-5 text-left font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100">
                  Update Password
                </button>
                <button className="w-full p-5 text-left font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100">
                  Help & Support
                </button>
                <button className="w-full p-5 text-left font-bold text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
