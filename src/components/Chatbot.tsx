import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, MessageCircle, Sparkles, BookOpen, PenTool, Timer, Headphones } from 'lucide-react';
import { getChatResponse } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const Chatbot: React.FC<{ 
  dailySloka: string;
  onOpenFeature: (feature: 'flashcards' | 'diary' | 'meditation' | 'audiobooks') => void;
}> = ({ dailySloka, onOpenFeature }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: "Radhe Radhe! I am AtmaMitra. How can I assist you on your spiritual journey today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(input, messages);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response || "I am reflecting on your words..." }] }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-blue-900 text-white p-4 rounded-full shadow-2xl border border-blue-700/50"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-8 z-40 w-[400px] h-[600px] bg-slate-950 border border-blue-900/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-950 p-4 flex justify-between items-center border-b border-blue-900/30">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                <span className="font-serif italic text-blue-100">AtmaMitra</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-blue-300 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Daily Sloka Banner */}
            <div className="bg-blue-900/20 p-3 text-center border-b border-blue-900/10">
              <p className="text-[10px] uppercase tracking-widest text-blue-400 mb-1">Wisdom of the Day</p>
              <p className="text-xs italic text-blue-100 line-clamp-2">"{dailySloka}"</p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-700 text-white rounded-tr-none' 
                      : 'bg-slate-900 text-blue-100 border border-blue-900/30 rounded-tl-none'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 p-3 rounded-2xl rounded-tl-none border border-blue-900/30">
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex gap-1"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-950 border-t border-blue-900/20">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for guidance..."
                  className="flex-1 bg-slate-900 border border-blue-900/30 rounded-full px-4 py-2 text-sm text-blue-100 focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={handleSend}
                  className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>

              {/* Feature Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <FeatureBtn icon={<BookOpen size={16} />} label="Cards" onClick={() => onOpenFeature('flashcards')} />
                <FeatureBtn icon={<PenTool size={16} />} label="Diary" onClick={() => onOpenFeature('diary')} />
                <FeatureBtn icon={<Timer size={16} />} label="Zen" onClick={() => onOpenFeature('meditation')} />
                <FeatureBtn icon={<Headphones size={16} />} label="Audio" onClick={() => onOpenFeature('audiobooks')} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const FeatureBtn = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-blue-950/50 border border-blue-900/20 hover:bg-blue-900/50 transition-all group"
  >
    <div className="text-blue-400 group-hover:text-amber-400 transition-colors">{icon}</div>
    <span className="text-[10px] text-blue-300 uppercase tracking-tighter">{label}</span>
  </button>
);
