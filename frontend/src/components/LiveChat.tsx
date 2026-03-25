import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, ChevronLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PostGameRating from './PostGameRating';

// Mock chat messages
const MOCK_MESSAGES = [
  { id: '1', senderId: 'o1', text: 'Hey everyone, excited for the game tomorrow!', timestamp: '2:30 PM' },
  { id: '2', senderId: 'u1', text: 'Me too. Are we still meeting at the south courts?', timestamp: '2:35 PM' },
  { id: '3', senderId: 'o1', text: 'Yep, south courts. See you there.', timestamp: '2:40 PM' },
];

const PRESET_MESSAGES = ['On my way!', 'Running 5 mins late', 'Can\'t make it anymore'];

interface LiveChatProps {
  eventId: number;
  currentUser: { id: string | number; name: string };
}

const LiveChat: React.FC<LiveChatProps> = ({ eventId, currentUser }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showRoster, setShowRoster] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id.toString(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handlePresetMessage = (text: string) => {
    setInputText(text);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const TriggerRatingButton = () => (
     <button 
        onClick={() => setShowRating(true)}
        className="fixed top-20 right-4 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-lg z-50 text-sm animate-pulse"
      >
        Simulate Match End
      </button>
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative pb-16">
       <TriggerRatingButton />

      {/* Sticky Header */}
      <div className="bg-white px-4 py-4 shadow-sm border-b border-slate-100 flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">Locker Room</h1>
            <p className="text-sm font-bold text-blue-600">Basketball • Tomorrow</p>
          </div>
        </div>
        <button 
          onClick={() => setShowRoster(!showRoster)}
          className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
        >
          <Users className="w-5 h-5" />
        </button>
      </div>

      {/* Roster Drawer (Overlay) */}
      <AnimatePresence>
        {showRoster && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/20 z-30" 
               onClick={() => setShowRoster(false)} 
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl z-40 border-l border-slate-100 p-6 overscroll-y-auto"
            >
              <h2 className="text-xl font-black text-slate-900 mb-6 flex justify-between items-center">
                 Roster <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">7/10</span>
              </h2>
              <div className="space-y-4">
                 {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" className="w-10 h-10 rounded-full shadow-sm" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">Player {i}</p>
                        {i === 1 && <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Organizer</p>}
                      </div>
                    </div>
                 ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-6">
        {/* Date Divider */}
        <div className="flex justify-center my-4">
           <span className="bg-slate-200 text-slate-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id.toString();
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col w-full max-w-[85%] ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'}`}
            >
              {!isMe && (
                 <span className="text-xs font-bold text-slate-400 mb-1 ml-2">Player Name</span>
              )}
              <div 
                className={`p-3.5 rounded-2xl shadow-sm text-[15px] font-medium leading-relaxed
                  ${isMe 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                  }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 mx-2">{msg.timestamp}</span>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Footer / Input Area */}
      <div className="bg-white border-t border-slate-100 p-4 space-y-3 sticky bottom-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] pb-safe">
         
         {/* Suggested Replies */}
         <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {PRESET_MESSAGES.map((text, idx) => (
               <button 
                 key={idx}
                 onClick={() => handlePresetMessage(text)}
                 className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full transition-colors"
               >
                 {text}
               </button>
            ))}
         </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          {/* Action Button (e.g., share location) */}
          <button type="button" className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-200 hover:text-blue-500 hover:border-blue-200 transition-colors">
            <MapPin className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-3 rounded-xl flex items-center justify-center transition-all ${
              inputText.trim() 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 active:scale-95' 
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Rating Modal Triggered by Button */}
      {showRating && <PostGameRating onClose={() => setShowRating(false)} />}
    </div>
  );
};

export default LiveChat;
