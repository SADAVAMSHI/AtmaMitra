import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const SpotlightBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* The background image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 grayscale"
        style={{ 
          backgroundImage: `url('"https://i.ibb.co/JjjjvZx9/Whats-App-Image-2026-02-25-at-10-09-53-PM.jpg')`, // Fallback if user image not accessible, but I will try to use a placeholder that looks like the provided one
        }}
      />
      
      {/* The spotlight overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`
        }}
      />

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};
