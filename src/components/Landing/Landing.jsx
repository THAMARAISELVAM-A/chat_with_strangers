import React, { useState } from 'react';
import { Users, Shield, MessageCircle, Zap, ArrowRight } from 'lucide-react';

/**
 * Landing Screen - Clean Modern Design
 */
export default function Landing({ onStart }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateNickname = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return 'At least 2 characters';
    if (trimmed.length > 20) return 'Max 20 characters';
    const blocked = ['admin', 'moderator', 'support', 'system', 'null', 'undefined'];
    if (blocked.includes(trimmed.toLowerCase())) return 'Username taken';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateNickname(nickname);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 300));
    onStart(nickname.trim());
  };

  return (
    <div className="screen landing fade-in">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{ marginBottom: 48 }}>
        <Zap size={64} color="#6366f1" style={{ marginBottom: 24 }} />
        <h1 className="landing-title">Stranger Chat</h1>
        <p className="landing-subtitle">
          Connect instantly with random strangers.<br />No accounts. No limits. Just chat.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="nickname-input-wrapper">
          <input
            type="text"
            className="input"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setError('');
            }}
            maxLength={20}
            autoFocus
          />
          {error && <p className="error-text">{error}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !nickname.trim()}
          style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Starting...' : 'Start Chatting'}
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="online-count">
        <span className="online-dot" />
        <span>1,247 strangers online</span>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 24, 
        marginTop: 48, 
        color: 'var(--text-muted)',
        fontSize: 13 
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={14} /> Anonymous
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MessageCircle size={14} /> Free
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Users size={14} /> Random
        </span>
      </div>
    </div>
  );
}