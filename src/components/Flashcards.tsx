import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, RefreshCw } from 'lucide-react';
import { getFlashcards } from '../services/gemini';

interface Flashcard {
  sanskrit: string;
  meaning: string;
  example: string;
}

export const Flashcards: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    const savedStreak = localStorage.getItem('flashcard_streak') || '0';
    const lastDate = localStorage.getItem('flashcard_last_date');
    const today = new Date().toDateString();

    setStreak(parseInt(savedStreak));
    if (lastDate === today) {
      setCompletedToday(true);
    }

    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const data = await getFlashcards();
      setCards(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Completed all for today
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem('flashcard_last_date');
      
      if (lastDate !== today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('flashcard_streak', newStreak.toString());
        localStorage.setItem('flashcard_last_date', today);
        setCompletedToday(true);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-slate-950 border border-blue-900/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-serif italic text-blue-100">Daily Flashcards</h2>
            <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full text-sm">
              <Flame size={14} />
              <span className="font-bold">{streak}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-blue-400 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-8 flex flex-col items-center min-h-[400px] justify-center">
          {loading ? (
            <RefreshCw className="animate-spin text-blue-500" size={40} />
          ) : completedToday && currentIndex === cards.length - 1 && isFlipped ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">✨</div>
              <h3 className="text-2xl font-serif text-amber-200">Dharma Fulfilled!</h3>
              <p className="text-blue-300">You've completed today's wisdom cards. Your streak is safe.</p>
              <button onClick={onClose} className="bg-blue-700 text-white px-8 py-2 rounded-full">Return Home</button>
            </div>
          ) : (
            <>
              <div 
                className="relative w-full h-64 perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-transform duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-blue-950/50 border border-blue-800/30 rounded-2xl flex items-center justify-center p-8 text-center">
                    <p className="text-xl font-serif text-blue-100 leading-relaxed">
                      {cards[currentIndex]?.sanskrit}
                    </p>
                    <div className="absolute bottom-4 text-[10px] uppercase tracking-widest text-blue-500">Tap to Reveal Meaning</div>
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 backface-hidden bg-slate-900 border border-amber-900/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center rotate-y-180"
                  >
                    <h4 className="text-amber-200 font-medium mb-4">"{cards[currentIndex]?.meaning}"</h4>
                    <div className="w-12 h-0.5 bg-amber-900/30 mb-4" />
                    <p className="text-sm text-blue-200/80 italic leading-relaxed">
                      {cards[currentIndex]?.example}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-blue-500 text-xs uppercase tracking-widest">Card {currentIndex + 1} of {cards.length}</span>
                {isFlipped && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleNext}
                    className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {currentIndex === cards.length - 1 ? 'Finish' : 'Next Card'}
                  </motion.button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
