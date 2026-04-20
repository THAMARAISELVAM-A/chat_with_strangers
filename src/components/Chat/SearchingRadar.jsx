import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HUDCard, CyberButton } from '../UI/DesignSystem';
import { Activity, Terminal, User, Hash, Zap, RefreshCw, Target, Shield } from 'lucide-react';

const STEPS = [
  { id: 'scan', label: 'Scanning', icon: Target },
  { id: 'find', label: 'Finding', icon: SearchIcon },
  { id: 'connect', label: 'Connecting', icon: Zap },
  { id: 'secure', label: 'Securing', icon: Shield }
];

function SearchIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function SearchingRadar({ profile, onFindMatch }) {
  const [dots, setDots] = useState('');
  const [connectionTime, setConnectionTime] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setConnectionTime(t => t + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const currentStepData = STEPS[1]; // Show "Finding" always for simplified UI

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Floating Orbs Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0, 15, 0],
            x: [0, 15, -10, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-72 h-72 rounded-full bg-neon-cyan"
          style={{ filter: 'blur(60px)', top: '15%', left: '10%', opacity: 0.15 }}
        />
        <motion.div
          animate={{ 
            y: [0, 25, 0, -20, 0],
            x: [0, -15, 10, -10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-96 h-96 rounded-full bg-purple-500"
          style={{ filter: 'blur(80px)', bottom: '10%', right: '5%', opacity: 0.12 }}
        />
        <motion.div
          animate={{ 
            y: [0, -15, 0, 10, 0],
            x: [0, 10, -5, 8, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-48 h-48 rounded-full bg-pink-400"
          style={{ filter: 'blur(50px)', top: '40%', right: '25%', opacity: 0.1 }}
        />
      </div>

      <div className="mesh-shader opacity-40" />

      {/* Radar Animation Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Radar sweep */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 245, 255, 0.3) 60deg, transparent 120deg)',
            boxShadow: '0 0 30px rgba(0, 245, 255, 0.2)'
          }}
        />
        
        {/* Concentric rings */}
        {[0.3, 0.5, 0.7, 0.9].map((scale, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.3, opacity: 0.4 }}
            animate={{ scale: [scale, scale * 1.05, scale], opacity: [0.4, 0.2, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
            className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full border"
            style={{
              borderColor: 'rgba(0, 245, 255, 0.15)',
              transform: `scale(${scale * 1.5})`
            }}
          />
        ))}
      </div>

      {/* Center Radar Core */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <HUDCard className="py-10 md:py-12 text-center">
          {/* Radar Core */}
          <div className="relative mb-8">
            <motion.div
              animate={{ 
                boxShadow: ['0 0 20px rgba(0, 245, 255, 0.3)', '0 0 50px rgba(0, 245, 255, 0.5)', '0 0 20px rgba(0, 245, 255, 0.3)']
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full flex items-center justify-center relative z-10"
              style={{
                background: 'rgba(0, 245, 255, 0.1)',
                border: '2px solid rgba(0, 245, 255, 0.5)',
                boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)'
              }}
            >
              <Terminal className="text-neon-cyan relative z-10" size={28} />
            </motion.div>
          </div>

          {/* Status Text */}
          <div className="space-y-2 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Finding someone{dots}
            </h2>
            <p className="text-white/50 text-sm">
              {connectionTime.toFixed(1)}s
            </p>
          </div>

          {/* Profile Info */}
          <div 
            className="flex items-center justify-center gap-6 mb-6 p-4 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="flex flex-col items-center">
              <User size={16} className="text-white/50 mb-1" />
              <span className="text-xs text-white/60 capitalize">{profile.gender}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <Hash size={16} className="text-white/50 mb-1" />
              <span className="text-xs text-white/60">{profile.age}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap size={12} className="text-neon-cyan" />
                <span className="text-[10px] text-white/50 uppercase">Online</span>
              </div>
              <div className="text-sm font-semibold text-white">12,453</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Activity size={12} className="text-success-emerald" />
                <span className="text-[10px] text-white/50 uppercase">Encrypted</span>
              </div>
              <div className="text-sm font-semibold text-success-emerald">256-bit</div>
            </motion.div>
          </div>

          <CyberButton 
            variant="secondary" 
            onClick={() => {}}
            className="w-full"
          >
            <RefreshCw size={16} className="mr-2" />
            Cancel
          </CyberButton>
        </HUDCard>
      </motion.div>
    </div>
  );
}