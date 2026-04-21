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
  X,
  Check,
  CheckCheck
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
  onReport,
  messages = [],
  onSendMessage,
  onTyping,
  isPartnerTyping = false
}) {
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    onTyping?.(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    onTyping?.(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTyping?.(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReport = () => {
    if (reportReason && onReport) {
      onReport(reportReason);
      setShowReport(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const partnerInitial = partnerNick?.charAt(0).toUpperCase() || 'S';

  return (
    <div className="chat-container fade-in">
      {/* Header */}
      <div className="chat-header glass">
        <div className="chat-header-left">
          <div className="chat-avatar">{partnerInitial}</div>
          <div className="chat-header-info">
            <h3>{partnerNick}</h3>
            <span className="online-indicator">
              <span className="dot" /> Active
            </span>
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
            <div className="menu-dropdown" onClick={() => setShowMenu(false)}>
              <div className="menu-item" onClick={onSkip}>
                <SkipForward size={16} />
                Skip to next
              </div>
              <div className="menu-item danger" onClick={() => setShowReport(true)}>
                <Shield size={16} />
                Report User
              </div>
              <div className="menu-item danger" onClick={onLeave}>
                <LogOut size={16} />
                Leave chat
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages custom-scrollbar">
        {messages.length === 0 && (
          <div className="empty-chat">
            <p>You are now connected with {partnerNick}! 👋</p>
            <span>Messages are anonymous and secure.</span>
          </div>
        )}
        
        {messages.map((msg, i) => {
          const isMine = msg.sender_session_id === mySessionId;
          return (
            <div 
              key={msg.id || i} 
              className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}
            >
              <div className={`message-bubble ${isMine ? 'message-sent' : 'message-received'}`}>
                <p>{msg.content}</p>
                <div className="message-meta">
                  <span className="message-time">{formatTime(msg.created_at)}</span>
                  {isMine && (
                    <span className={`status-tick ${msg.status || 'sent'}`}>
                      {msg.status === 'delivered' ? <CheckCheck size={14} /> : <Check size={14} />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isPartnerTyping && (
          <div className="message-wrapper theirs">
            <div className="typing-indicator-wrapper">
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <span className="typing-text">{partnerNick} is typing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-wrapper glass">
        <div className="chat-input-container">
          <button className="btn btn-ghost btn-icon" title="Attach">
            <Paperclip size={20} />
          </button>
          
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message here..."
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          
          <button className="btn btn-ghost btn-icon" title="Emoji">
            <Smile size={20} />
          </button>
          
          <button 
            className="btn btn-primary btn-icon send-button"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="modal-overlay" onClick={() => setShowReport(false)}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report {partnerNick}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowReport(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p>Why are you reporting this user?</p>
              <select
                className="input"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="inappropriate">Inappropriate behavior</option>
                <option value="harassment">Harassment</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
              
              <button
                className="btn btn-primary"
                onClick={handleReport}
                disabled={!reportReason}
                style={{ width: '100%', marginTop: 20 }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
