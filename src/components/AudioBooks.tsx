import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, BookOpen, ChevronLeft, ChevronRight, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { getAudioBookContent, generateSpeech } from '../services/gemini';

const TOPICS = [
  "The Nature of Self",
  "The Path of Action",
  "Divine Wisdom",
  "The Yoga of Devotion",
  "The Field and the Knower",
  "The Three Gunas",
  "The Supreme Person",
  "Divine and Demonic Natures",
  "The Yoga of Renunciation",
  "The Vision of the Universal Form"
];

export const AudioBooks: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const cardStreak = parseInt(localStorage.getItem('flashcard_streak') || '0');
    const medStreak = parseInt(localStorage.getItem('meditation_streak') || '0');
    
    // Unlock logic: 1 book per 20 card streaks OR 30 med streaks
    const unlocked = Math.floor(cardStreak / 20) + Math.floor(medStreak / 30);
    setUnlockedCount(Math.min(unlocked, TOPICS.length));
  }, []);

  const handleTopicSelect = async (topic: string, index: number) => {
    if (index >= unlockedCount) return;
    
    setLoading(true);
    setSelectedTopic(topic);
    setCurrentPage(0);
    setAudioData(null);
    setIsPlaying(false);

    try {
      const content = await getAudioBookContent(topic);
      setPages(content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioData) {
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }

    setLoading(true);
    try {
      const base64 = await generateSpeech(pages[currentPage]);
      if (base64) {
        setAudioData(base64);
        setIsPlaying(true);
      }
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
      <div className="bg-slate-950 border border-blue-900/50 rounded-3xl w-full max-w-4xl h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-blue-900/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-400" size={20} />
            <h2 className="text-xl font-serif italic text-blue-100">Divine Audio Library</h2>
          </div>
          <button onClick={onClose} className="text-blue-400 hover:text-white"><X size={24} /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Topics */}
          <div className="w-1/3 border-r border-blue-900/20 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {TOPICS.map((topic, i) => {
              const isLocked = i >= unlockedCount;
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicSelect(topic, i)}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between group ${
                    selectedTopic === topic 
                      ? 'bg-blue-700 text-white' 
                      : isLocked 
                        ? 'opacity-40 cursor-not-allowed' 
                        : 'bg-blue-950/20 text-blue-300 hover:bg-blue-900/30'
                  }`}
                >
                  <span className="text-sm font-medium">{topic}</span>
                  {isLocked ? <Lock size={14} /> : <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              );
            })}
            <div className="p-4 mt-4 bg-blue-900/10 rounded-2xl border border-blue-900/20">
              <p className="text-[10px] uppercase tracking-widest text-blue-500 mb-2">How to Unlock</p>
              <p className="text-[10px] text-blue-300/60 leading-relaxed">
                Complete 20 Flashcard streaks or 30 Meditation streaks to unlock new wisdom topics.
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-slate-900/50 p-8 flex flex-col">
            {!selectedTopic ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-950 rounded-full flex items-center justify-center">
                  <BookOpen className="text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-serif text-blue-100">Select a Topic</h3>
                <p className="text-blue-400 text-sm max-w-xs">Explore the depths of the Bhagavad Gita through our curated audio books.</p>
              </div>
            ) : loading ? (
              <div className="flex-1 flex items-center justify-center">
                <RefreshCw className="animate-spin text-blue-500" size={40} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-serif text-amber-200">{selectedTopic}</h3>
                  <button 
                    onClick={playAudio}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-full text-xs font-bold transition-all"
                  >
                    {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    {isPlaying ? 'Stop Audio' : 'Listen Page'}
                  </button>
                </div>

                <div className="flex-1 bg-blue-950/10 border border-blue-900/10 rounded-3xl p-8 overflow-y-auto scrollbar-hide">
                  <motion.p 
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-blue-100 leading-loose text-lg font-light italic"
                  >
                    {pages[currentPage]}
                  </motion.p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-blue-500 text-xs uppercase tracking-widest">Page {currentPage + 1} of {pages.length}</span>
                  <div className="flex gap-4">
                    <button 
                      disabled={currentPage === 0}
                      onClick={() => { setCurrentPage(p => p - 1); setAudioData(null); setIsPlaying(false); }}
                      className="p-2 rounded-full border border-blue-900/30 text-blue-400 disabled:opacity-20"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      disabled={currentPage === pages.length - 1}
                      onClick={() => { setCurrentPage(p => p + 1); setAudioData(null); setIsPlaying(false); }}
                      className="p-2 rounded-full border border-blue-900/30 text-blue-400 disabled:opacity-20"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {audioData && (
          <audio 
            ref={audioRef}
            src={`data:audio/mp3;base64,${audioData}`}
            onEnded={() => setIsPlaying(false)}
            autoPlay
          />
        )}
      </div>
    </motion.div>
  );
};
