import React from 'react';
import { X, Search } from 'lucide-react';

/**
 * Matching Screen - Animated Orb Design
 */
export default function Matching({ nickname, onCancel, onMatched }) {
  // This would typically connect to Supabase for real matching
  // For now, it's a placeholder that waits for demo
  
  return (
    <div className="screen matching fade-in">
      <div className="matching-orb">
        <div className="orb-core" />
        <div className="orb-ring" />
        <div className="orb-ring" />
      </div>

      <h2 className="matching-text">Finding a stranger...</h2>
      <p className="matching-subtext">
        Someone cool is waiting to chat with you
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          <X size={18} />
          Cancel
        </button>
      </div>
    </div>
  );
}