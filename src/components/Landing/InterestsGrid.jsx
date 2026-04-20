import React from 'react';
import { motion } from 'framer-motion';

const INTERESTS = [
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'movies', label: 'Movies', emoji: '🎬' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'photography', label: 'Photo', emoji: '📷' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'coding', label: 'Coding', emoji: '👨‍💻' },
  { id: 'nature', label: 'Nature', emoji: '🌲' },
  { id: 'anime', label: 'Anime', emoji: '🎌' },
  { id: 'memes', label: 'Memes', emoji: '😂' },
  { id: 'crypto', label: 'Crypto', emoji: '₿' }
];

export default function InterestsGrid({ selectedInterests, onToggle }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
      {INTERESTS.map((interest) => {
        const isSelected = selectedInterests.includes(interest.id);
        return (
          <motion.button
            key={interest.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(interest.id)}
            className={`p-3 rounded-xl text-center transition-all ${
              isSelected 
                ? 'bg-neon-cyan/20 border-2 border-neon-cyan' 
                : 'bg-white/5 border-2 border-transparent hover:border-white/20'
            }`}
          >
            <div className="text-xl md:text-2xl mb-1">{interest.emoji}</div>
            <div className={`text-[10px] md:text-xs ${isSelected ? 'text-neon-cyan' : 'text-white/60'}`}>
              {interest.label}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}