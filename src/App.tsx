import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoadingScreen } from './components/LoadingScreen';
import { SpotlightBackground } from './components/SpotlightBackground';
import { Chatbot } from './components/Chatbot';
import { Flashcards } from './components/Flashcards';
import { Diary } from './components/Diary';
import { Meditation } from './components/Meditation';
import { AudioBooks } from './components/AudioBooks';
import { getDailySloka } from './services/gemini';
import { Sparkles, Flame, Sun, Moon } from 'lucide-react';

interface Sloka {
  sanskrit: string;
  english: string;
  chapter: number;
  verse: number;
  explanation: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dailySloka, setDailySloka] = useState<Sloka | null>(null);
  const [activeFeature, setActiveFeature] = useState<'flashcards' | 'diary' | 'meditation' | 'audiobooks' | null>(null);
  const [streaks, setStreaks] = useState({ cards: 0, med: 0 });
// 1. Fetch the Sloka ONLY ONCE when the app first loads
  useEffect(() => {
    const fetchSloka = async () => {
      try {
        const data = await getDailySloka();
        setDailySloka(data);
      } catch (e) {
        console.error("Sloka fetch error:", e);
      }
    };
    fetchSloka();
  }, []); // Empty brackets = "Run once and never again"

  // 2. Sync streaks whenever the user switches features
  useEffect(() => {
    const updateStreaks = () => {
      setStreaks({
        cards: parseInt(localStorage.getItem('flashcard_streak') || '0'),
        med: parseInt(localStorage.getItem('meditation_streak') || '0')
      });
    };

    updateStreaks();
    window.addEventListener('storage', updateStreaks);
    
    return () => {
      window.removeEventListener('storage', updateStreaks);
    };
  }, [activeFeature]); // Runs every time activeFeature changes

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <SpotlightBackground>
          <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
            {/* Header */}
            <header className="flex justify-between items-center mb-24">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <Sparkles className="text-amber-400" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-serif italic text-blue-100 tracking-tight">AtmaMitra</h1>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-medium">Friend Of The Soul.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Flame size={18} />
                    <span className="text-xl font-bold">{streaks.cards}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-blue-600">Card Streak</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Flame size={18} />
                    <span className="text-xl font-bold">{streaks.med}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-blue-600">Zen Streak</span>
                </div>
              </motion.div>
            </header>

            {/* Daily Wisdom Section */}
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/30 border border-blue-900/20 text-blue-400 text-xs font-medium uppercase tracking-widest">
                  <Sun size={14} />
                  Daily Wisdom
                </div>
                
                {dailySloka ? (
                  <div className="space-y-6">
                    <h2 className="text-5xl font-serif italic text-blue-100 leading-tight">
                      {dailySloka.sanskrit}
                    </h2>
                    <div className="w-24 h-1 bg-amber-500/50 rounded-full" />
                    <p className="text-xl text-blue-200/80 font-light leading-relaxed max-w-xl">
                      "{dailySloka.english}"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-blue-500 font-medium">
                      <span>Chapter {dailySloka.chapter}</span>
                      <div className="w-1 h-1 bg-blue-900 rounded-full" />
                      <span>Verse {dailySloka.verse}</span>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-blue-900/20 rounded-xl w-3/4" />
                    <div className="h-12 bg-blue-900/20 rounded-xl w-1/2" />
                    <div className="h-6 bg-blue-900/20 rounded-xl w-full" />
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative aspect-square max-w-md mx-auto"
              >
                <div className="absolute inset-0 bg-blue-900/20 rounded-full blur-3xl" />
                <div className="relative z-10 w-full h-full border border-blue-900/20 rounded-full p-12 flex items-center justify-center text-center">
                  <div className="space-y-4">
                    <Moon className="text-amber-200 mx-auto" size={32} />
                    <p className="text-sm text-blue-300 italic leading-relaxed">
                      {dailySloka?.explanation || "Loading divine insights..."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </main>

            {/* Chatbot & Features */}
            <Chatbot 
              dailySloka={dailySloka?.english || ""} 
              onOpenFeature={setActiveFeature} 
            />

            <AnimatePresence>
              {activeFeature === 'flashcards' && <Flashcards onClose={() => setActiveFeature(null)} />}
              {activeFeature === 'diary' && <Diary onClose={() => setActiveFeature(null)} />}
              {activeFeature === 'meditation' && <Meditation onClose={() => setActiveFeature(null)} />}
              {activeFeature === 'audiobooks' && <AudioBooks onClose={() => setActiveFeature(null)} />}
            </AnimatePresence>
          </div>
        </SpotlightBackground>
      )}
    </div>
  );
}
