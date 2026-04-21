import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Smile, 
  Send, 
  SkipForward, 
  LogOut, 
  MoreVertical,
  Image,
  AlertTriangle,
  Shield,
  X
} from 'lucide-react';

/**
 * Chat Screen - Clean Modern Design
 */
export default function Chat({ 
  roomId, 
  mySessionId, 
  partnerSession, 
  partnerNick = 'Stranger',
  myNickname, 
  onSkip, 
  onLeave,
  messages = [],
  onSendMessage,
  isPartnerTyping = false
}) {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const myInitial = myNickname?.charAt(0).toUpperCase() || 'Y';
  const partnerInitial = partnerNick?.charAt(0).toUpperCase() || 'S';

  return (
    <div className="chat-container fade-in">
      {/* Header */}
      <div className="chat-header glass">
        <div className="chat-header-left">
          <div className="chat-avatar">{partnerInitial}</div>
          <div className="chat-header-info">
            <h3>{partnerNick}</h3>
            <span>Online</span>
          </div>
        </div>
        
        <div className="menu-container">
          <button 
            className="btn btn-ghost btn-icon"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="menu-dropdown">
              <div className="menu-item" onClick={onSkip}>
                <SkipForward size={16} />
                Skip to next
              </div>
              <div className="menu-item" onClick={onLeave} style={{ color: 'var(--error)' }}>
                <LogOut size={16} />
                Leave chat
              </div>
              <div className="menu-item" style={{ color: 'var(--error)' }}>
                <Shield size={16} />
                Report
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages custom-scrollbar">
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-muted)',
            padding: '40px 0'
          }}>
            <p>Say hi to {partnerNick}! 👋</p>
          </div>
        )}
        
        {messages.map((msg, i) => {
          const isMine = msg.sender_session_id === mySessionId;
          return (
            <div 
              key={msg.id || i} 
              className={`message ${isMine ? 'message-sent' : 'message-received'}`}
            >
              <p>{msg.content}</p>
              {msg.created_at && (
                <span className="message-time">{formatTime(msg.created_at)}</span>
              )}
            </div>
          );
        })}
        
        {isPartnerTyping && (
          <div className="typing-indicator">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <button className="btn btn-ghost btn-icon">
          <Paperclip size={20} />
        </button>
        
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <button className="btn btn-ghost btn-icon">
          <Smile size={20} />
        </button>
        
        <button 
          className="btn btn-primary btn-icon"
          onClick={handleSend}
          disabled={!inputText.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}