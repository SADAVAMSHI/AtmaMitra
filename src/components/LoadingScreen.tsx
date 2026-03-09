import React from 'react';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 4 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Flute Animation */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <div className="w-64 h-4 bg-amber-800 rounded-full relative shadow-lg shadow-amber-900/50">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full" style={{ left: `${20 + i * 12}%` }} />
            ))}
          </div>
        </motion.div>
      
         {/* Peacock Feather */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: -20 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="absolute -top-16 left-1/2 -translate-x-1/2"
        >
          <div className="w-20 h-32 bg-peacock-bright rounded-full relative overflow-hidden shadow-xl border-2 border-peacock-gold/30">
            <div className="absolute inset-2 bg-peacock-neck rounded-full flex items-center justify-center">
              <div className="w-8 h-12 bg-peacock-purple rounded-full border-2 border-peacock-gold/50" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-16 bg-peacock-gold/20" />
          </div>
        </motion.div>

        {/* Musical Notes */}
        <motion.div
          animate={{ 
            y: [-10, -30],
            x: [0, 20],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute top-0 right-0 text-peacock-gold"
        >
          <Music size={24} />
        </motion.div>

        {/* Lord Krishna Feature Silhouette/Animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-serif italic text-amber-200 tracking-widest mb-2">AtmaMitra</h1>
          <p className="text-amber-100/60 font-light tracking-widest uppercase text-sm">Friend Of The Soul</p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-12 flex items-center gap-2 text-amber-200/40"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Music size={16} />
        <span className="text-xs tracking-tighter uppercase">Divine Melodies Loading...</span>
      </motion.div>
    </motion.div>
  );
};
