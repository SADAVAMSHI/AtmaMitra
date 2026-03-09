import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Sparkles, Book } from 'lucide-react';
import { getDiaryFeedback } from '../services/gemini';

export const Diary: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [entry, setEntry] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedEntries, setSavedEntries] = useState<{ date: string, content: string, feedback: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('diary_entries');
    if (saved) setSavedEntries(JSON.parse(saved));
  }, []);

  const handleFeedback = async () => {
    if (!entry.trim() || loading) return;
    setLoading(true);
    try {
      const result = await getDiaryFeedback(entry);
      setFeedback(result || "Reflecting on your journey...");
      
      const newEntry = {
        date: new Date().toLocaleString(),
        content: entry,
        feedback: result || ""
      };
      
      const updated = [newEntry, ...savedEntries].slice(0, 10);
      setSavedEntries(updated);
      localStorage.setItem('diary_entries', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-slate-950 border border-blue-900/50 rounded-3xl w-full max-w-2xl h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Book className="text-blue-400" size={20} />
            <h2 className="text-xl font-serif italic text-blue-100">Reflective Diary</h2>
          </div>
          <button onClick={onClose} className="text-blue-400 hover:text-white"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-blue-500 font-medium">Today's Reflection</label>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your thoughts, actions, or dilemmas here..."
              className="w-full h-48 bg-blue-950/20 border border-blue-900/30 rounded-2xl p-6 text-blue-100 focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
            <button
              onClick={handleFeedback}
              disabled={!entry.trim() || loading}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-blue-900/50 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
              Seek Divine Feedback
            </button>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-amber-900/30 rounded-2xl p-6 relative"
              >
                <div className="absolute -top-3 left-6 bg-amber-900 text-amber-100 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">AtmaMitra's Guidance</div>
                <p className="text-blue-100 italic leading-relaxed whitespace-pre-wrap">{feedback}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {savedEntries.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-blue-500 font-medium">Past Reflections</h3>
              <div className="space-y-4">
                {savedEntries.map((item, i) => (
                  <div key={i} className="p-4 bg-blue-950/10 border border-blue-900/10 rounded-xl">
                    <p className="text-[10px] text-blue-600 mb-2">{item.date}</p>
                    <p className="text-sm text-blue-200 line-clamp-2 mb-2">{item.content}</p>
                    <div className="h-px bg-blue-900/10 mb-2" />
                    <p className="text-xs text-amber-200/60 italic line-clamp-2">{item.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
