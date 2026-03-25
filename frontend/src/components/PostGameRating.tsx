import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const MOCK_PLAYERS = [
  { id: '1', name: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: '2', name: 'James T.', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '3', name: 'Elena R.', avatar: 'https://i.pravatar.cc/150?u=2' },
];

const TAGS = ['On Time', 'Great Teammate', 'No Show', ' MVP '];

const PostGameRating = ({ onClose }: { onClose: () => void }) => {
  const [ratings, setRatings] = useState<Record<string, { stars: number; tags: string[] }>>({});
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatePlayer = (playerId: string, stars: number) => {
    setRatings(prev => ({
      ...prev,
      [playerId]: { ...prev[playerId], stars: stars, tags: prev[playerId]?.tags || [] }
    }));
  };

  const toggleTag = (playerId: string, tag: string) => {
    setRatings(prev => {
      const currentTags = prev[playerId]?.tags || [];
      const newTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag) 
        : [...currentTags, tag];
      return { ...prev, [playerId]: { ...prev[playerId], tags: newTags } };
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const allRated = MOCK_PLAYERS.every(player => ratings[player.id]?.stars > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="ratings"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center text-white">
              <h2 className="text-3xl font-black mb-2 tracking-tight">How was the game?</h2>
              <p className="text-white/80 font-medium">Rate your teammates to boost their rep.</p>
            </div>

            {/* Player List */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {MOCK_PLAYERS.map(player => {
                const isSelected = selectedPlayerId === player.id;
                const playerRating = ratings[player.id];

                return (
                  <motion.div 
                    key={player.id}
                    layout
                    onClick={() => setSelectedPlayerId(isSelected ? null : player.id)}
                    className={`bg-slate-50 border transition-colors rounded-2xl p-4 cursor-pointer overflow-hidden ${
                      isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full shadow-sm" />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-lg">{player.name}</h3>
                        {/* Summary Stars if unexpanded and rated */}
                        {!isSelected && playerRating?.stars && (
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-3 h-3 ${star <= playerRating.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expandable Rating Area */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pt-6"
                        >
                          <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={(e) => { e.stopPropagation(); handleRatePlayer(player.id, star); }}
                                className="p-2 transition-transform hover:scale-125 focus:outline-none"
                              >
                                <Star 
                                  className={`w-8 h-8 transition-colors ${
                                    (playerRating?.stars >= star) 
                                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                                      : 'text-slate-300'
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                          
                          {/* Tags */}
                          {(playerRating?.stars || 0) > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 pb-2">
                              {TAGS.map(tag => (
                                <button
                                  key={tag}
                                  onClick={(e) => { e.stopPropagation(); toggleTag(player.id, tag); }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                    playerRating?.tags?.includes(tag)
                                      ? 'bg-indigo-100 ring-1 ring-indigo-500 text-indigo-700'
                                      : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Submit Button Container */}
            <div className="p-6 bg-white border-t border-slate-100">
              <button 
                onClick={handleSubmit}
                disabled={!allRated}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                  allRated 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Ratings
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center space-y-4 max-w-sm w-full"
          >
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 text-center">Ratings Submitted!</h3>
            <p className="text-slate-500 text-center font-medium">
              You earned +5 Rep for reviewing your teammates.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostGameRating;
