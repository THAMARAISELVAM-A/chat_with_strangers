import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const ALL_INTERESTS = [
  { id: 'gaming', label: 'Gaming', emoji: '🎮', color: '#8b5cf6' },
  { id: 'music', label: 'Music', emoji: '🎵', color: '#ec4899' },
  { id: 'movies', label: 'Movies', emoji: '🎬', color: '#f59e0b' },
  { id: 'tech', label: 'Tech', emoji: '💻', color: '#06b6d4' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: '#10b981' },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: '#3b82f6' },
  { id: 'food', label: 'Food', emoji: '🍕', color: '#f97316' },
  { id: 'art', label: 'Art', emoji: '🎨', color: '#d946ef' },
  { id: 'books', label: 'Books', emoji: '📚', color: '#8b5cf6' },
  { id: 'science', label: 'Science', emoji: '🔬', color: '#14b8a6' },
  { id: 'fashion', label: 'Fashion', emoji: '👗', color: '#f472b6' },
  { id: 'photography', label: 'Photo', emoji: '📷', color: '#06b6d4' },
  { id: 'fitness', label: 'Fitness', emoji: '💪', color: '#ef4444' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳', color: '#f59e0b' },
  { id: 'coding', label: 'Coding', emoji: '👨‍💻', color: '#22d3ee' },
  { id: 'nature', label: 'Nature', emoji: '🌲', color: '#22c55e' },
  { id: 'anime', label: 'Anime', emoji: '🎌', color: '#e879f9' },
  { id: 'memes', label: 'Memes', emoji: '😂', color: '#fbbf24' },
  { id: 'crypto', label: 'Crypto', emoji: '₿', color: '#f97316' }
];

export default function InterestsGrid({ selectedInterests, onToggle }) {
  const [search, setSearch] = useState('');
  const [hovered, setHovered] = useState(null);

  const filteredInterests = useMemo(() => {
    if (!search.trim()) return ALL_INTERESTS;
    const query = search.toLowerCase();
    return ALL_INTERESTS.filter(i => 
      i.label.toLowerCase().includes(query) || 
      i.id.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="relative">
      {/* Search Input with better styling */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search interests..."
          className="w-full rounded-xl py-3 px-10 text-sm text-white placeholder:text-white/25 focus:outline-none transition-all"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        />
        {search ? (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} className="text-white/50 hover:text-white" />
          </button>
        ) : (
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
        )}
      </div>

      {/* Floating orbs background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <motion.div
          animate={{ y: [0, -15, 0, 10, 0], x: [0, 10, -5, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, #00f5ff, transparent)', filter: 'blur(40px)', top: '0%', left: '10%' }}
        />
        <motion.div
          animate={{ y: [0, 20, 0, -15, 0], x: [0, -10, 5, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(50px)', bottom: '10%', right: '5%' }}
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 relative z-10">
        <AnimatePresence mode="pop">
          {filteredInterests.map((interest, index) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <motion.button
                key={interest.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.02 }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(interest.id)}
                onMouseEnter={() => setHovered(interest.id)}
                onMouseLeave={() => setHovered(null)}
                className="p-3 rounded-xl text-center relative overflow-hidden transition-all duration-300"
                style={{
                  background: isSelected ? `${interest.color}20` : 'rgba(255, 255, 255, 0.03)',
                  border: `2px solid ${isSelected ? interest.color : hovered === interest.id ? 'rgba(255,255,255,0.2)' : 'transparent'}`,
                  boxShadow: isSelected ? `0 0 25px ${interest.color}40` : 'none'
                }}
              >
                {/* Selection glow */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(circle at center, ${interest.color}20 0%, transparent 70%)` }}
                  />
                )}
                
                {/* Hover glow */}
                {hovered === interest.id && !isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
                  />
                )}
                
                <motion.div
                  animate={{ 
                    scale: isSelected ? [1, 1.2, 1] : 1,
                    rotate: isSelected ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ repeat: isSelected ? Infinity : 0, duration: 0.5 }}
                  className="text-2xl md:text-2xl mb-1 relative z-10"
                >
                  {interest.emoji}
                </motion.div>
                <div 
                  className={`text-[10px] md:text-xs relative z-10 transition-colors duration-300`}
                  style={{
                    color: isSelected ? interest.color : '#ffffff80',
                    textShadow: isSelected ? `0 0 10px ${interest.color}` : 'none'
                  }}
                >
                  {interest.label}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredInterests.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No interests found for "{search}"
        </div>
      )}

      {/* Selection counter */}
      <motion.div 
        className="mt-4 text-center text-sm text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedInterests.length > 0 ? 1 : 0.5 }}
      >
        {selectedInterests.length}/5 selected
      </motion.div>
    </div>
  );
}