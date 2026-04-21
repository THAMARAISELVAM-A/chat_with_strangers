import React, { useState, useEffect, useCallback } from 'react';
import Landing from './components/Landing/Landing';
import Matching from './components/Matching/Matching';
import Chat from './components/Chat/Chat';
import './index.css';

// Generate unique session ID
function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Load or create session
function getSession() {
  const key = 'stranger_chat_session';
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000) {
        return parsed;
      }
    }
  } catch (e) {}
  
  const session = {
    id: generateSessionId(),
    nickname: '',
    createdAt: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(session));
  return session;
}

export default function App() {
  const [stage, setStage] = useState('landing'); // landing | matching | chat
  const [session, setSession] = useState(null);
  const [nickname, setNickname] = useState('');
  const [messages, setMessages] = useState([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // Initialize session
  useEffect(() => {
    const sess = getSession();
    setSession(sess);
  }, []);

  const handleStart = useCallback((nickname) => {
    setNickname(nickname);
    setStage('matching');
    
    // Update session with nickname
    const newSession = { ...session, nickname };
    setSession(newSession);
    localStorage.setItem('stranger_chat_session', JSON.stringify(newSession));
  }, [session]);

  const handleMatched = useCallback((roomId, partnerSession, partnerNick) => {
    setStage('chat');
  }, []);

  const handleCancel = useCallback(() => {
    setStage('landing');
    setNickname('');
  }, []);

  const handleSkip = useCallback(() => {
    setStage('matching');
    setMessages([]);
  }, []);

  const handleLeave = useCallback(() => {
    setStage('landing');
    setNickname('');
    setMessages([]);
  }, []);

  const handleSendMessage = useCallback((content) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      sender_session_id: session?.id,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  }, [session]);

  // If session not loaded yet
  if (!session) {
    return (
      <div className="app-container">
        <div className="screen">
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {stage === 'landing' && (
        <Landing onStart={handleStart} />
      )}

      {stage === 'matching' && (
        <Matching 
          nickname={nickname}
          onCancel={handleCancel}
          onMatched={handleMatched}
        />
      )}

      {stage === 'chat' && (
        <Chat
          roomId={session?.id}
          mySessionId={session?.id}
          partnerSession="partner-123"
          partnerNick="Stranger"
          myNickname={nickname}
          onSkip={handleSkip}
          onLeave={handleLeave}
          messages={messages}
          onSendMessage={handleSendMessage}
          isPartnerTyping={isPartnerTyping}
        />
      )}
    </div>
  );
}