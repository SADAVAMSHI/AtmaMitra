import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RotateCcw, Award, Flame } from 'lucide-react';

const TIMERS = [2, 5, 10, 15];

export const Meditation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedTime, setSelectedTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedStreak = localStorage.getItem('meditation_streak') || '0';
    setStreak(parseInt(savedStreak));
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('meditation_last_date');
    if (lastDate !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('meditation_streak', newStreak.toString());
      localStorage.setItem('meditation_last_date', today);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(selectedTime * 60);
    setIsComplete(false);
  };

  const handleTimeSelect = (t: number) => {
    setSelectedTime(t);
    setTimeLeft(t * 60);
    setIsActive(false);
    setIsComplete(false);
  };

  const appreciations = [
    "Your inner light shines brighter with every breath.",
    "Tranquility is the true nature of the soul.",
    "In silence, you find the strength of the universe.",
    "Peace is not a destination, but the path you walk today."
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-slate-950 border border-blue-900/50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-serif italic text-blue-100">Zen Meditation</h2>
            <div className="flex items-center gap-1 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-sm">
              <Flame size={14} />
              <span className="font-bold">{streak}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-blue-400 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-12 flex flex-col items-center">
          {isComplete ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                <Award className="text-amber-400" size={40} />
              </div>
              <h3 className="text-2xl font-serif text-amber-200">Session Complete</h3>
              <p className="text-blue-200 italic leading-relaxed">
                "{appreciations[Math.floor(Math.random() * appreciations.length)]}"
              </p>
              <button 
                onClick={reset}
                className="bg-blue-700 text-white px-8 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Meditate Again
              </button>
            </motion.div>
          ) : (
            <>
              {/* Timer Display */}
              <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-blue-900/20"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="754"
                    animate={{ strokeDashoffset: 754 * (1 - timeLeft / (selectedTime * 60)) }}
                    className="text-blue-500"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-5xl font-mono text-blue-100">{formatTime(timeLeft)}</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500 mt-2">Remaining</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-6 mb-12">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className="w-16 h-16 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all shadow-lg shadow-blue-900/40"
                >
                  {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>
                <button 
                  onClick={reset}
                  className="w-16 h-16 bg-slate-900 border border-blue-900/30 rounded-full flex items-center justify-center text-blue-400 hover:text-white transition-all"
                >
                  <RotateCcw size={24} />
                </button>
              </div>

              {/* Time Selection */}
              <div className="flex gap-3">
                {TIMERS.map(t => (
                  <button
                    key={t}
                    onClick={() => handleTimeSelect(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedTime === t 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-950/30 text-blue-400 border border-blue-900/20 hover:border-blue-500'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
