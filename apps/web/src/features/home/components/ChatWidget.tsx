"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, MoreVertical, Trash2 } from "lucide-react";
import { getReply, type Rule } from "../../../data/chatbot";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: Rule["action"];
  timestamp: string;
}

const DEFAULT_CHIPS = ["Admissions", "Fees", "School timings", "Contact us", "Book a visit", "Location"];
const FALLBACK_REPLY = "Sorry, I didn't get that. Try asking about admissions, fees, timings, location, or contact details.";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chips, setChips] = useState<string[]>(DEFAULT_CHIPS);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize messages
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("radiant_chat");
      if (stored) {
        setMessages(JSON.parse(stored));
        setHasOpenedOnce(true);
      } else {
        setMessages([
          { id: "msg-1", sender: "bot", text: "Hi! I'm the Radiant School assistant. Ask me about admissions, fees, timings or contact details.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }
    } catch (e) {
      setMessages([
        { id: "msg-1", sender: "bot", text: "Hi! I'm the Radiant School assistant. Ask me about admissions, fees, timings or contact details.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }
    
    let shouldShowNudge = false;
    try { shouldShowNudge = !sessionStorage.getItem("radiant_chat_nudge"); } catch { /* Storage can be disabled on mobile. */ }
    if (shouldShowNudge) {
      const timer = setTimeout(() => {
        if (!isOpen && !hasOpenedOnce) {
          setShowNudge(true);
          try { sessionStorage.setItem("radiant_chat_nudge", "true"); } catch { /* Storage can be disabled on mobile. */ }
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      try {
        sessionStorage.setItem("radiant_chat", JSON.stringify(messages));
      } catch (e) {}
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasOpenedOnce(true);
      setShowNudge(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setChips([]);
    setIsTyping(true);
    
    setTimeout(() => {
      const rule = getReply(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: rule ? rule.reply : FALLBACK_REPLY,
        action: rule?.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
      setChips(rule?.followUps || DEFAULT_CHIPS);
      setIsTyping(false);
    }, Math.random() * 500 + 600);
  };

  const handleActionClick = (action: Rule["action"]) => {
    if (!action) return;
    if (action.type === 'scroll') {
      setIsOpen(false);
      const el = document.querySelector(action.value);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action.type === 'link') {
      window.open(action.value, '_blank', 'noopener,noreferrer');
    } else if (action.type === 'call') {
      window.location.href = action.value;
    }
  };

  const handleClear = () => {
    setMessages([{ id: Date.now().toString(), sender: "bot", text: "Hi! I'm the Radiant School assistant. Ask me about admissions, fees, timings or contact details.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChips(DEFAULT_CHIPS);
    setMenuOpen(false);
    try { sessionStorage.removeItem("radiant_chat"); } catch { /* Storage can be disabled on mobile. */ }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .chat-widget-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--color-ink, #1f1f1f);
          color: var(--color-cream, #FFF8EC);
          border-radius: 50px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
          z-index: 9999;
          transition: transform 0.2s, background 0.2s, padding 0.2s, width 0.2s, height 0.2s;
          cursor: pointer;
          border: none;
        }
        .chat-widget-btn:hover {
          transform: translateY(-2px);
          background: #333;
        }
        .chat-widget-btn.is-open {
          width: 56px;
          height: 56px;
          padding: 0;
          border-radius: 50%;
        }
        .chat-widget-btn.is-closed {
          padding: 11px 17px;
          gap: 9px;
        }
        
        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(224, 82, 40, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(224, 82, 40, 0); }
          100% { box-shadow: 0 0 0 0 rgba(224, 82, 40, 0); }
        }
        .unread-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background-color: #E05228;
          border-radius: 50%;
          border: 2px solid var(--color-cream, #FFF8EC);
          animation: pulseDot 2s infinite;
        }

        .chat-nudge {
          position: absolute;
          bottom: calc(100% + 16px);
          right: 0;
          background: var(--color-cream, #FFF8EC);
          border: 1.5px solid var(--color-ink, #1f1f1f);
          box-shadow: 4px 4px 0 var(--color-ink, #1f1f1f);
          padding: 12px 16px;
          border-radius: 16px 16px 4px 16px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink, #1f1f1f);
          width: 220px;
          text-align: left;
          animation: slideUpFade 0.3s ease-out;
        }
        .chat-nudge::after {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 24px;
          width: 10px;
          height: 10px;
          background: var(--color-cream, #FFF8EC);
          border-right: 1.5px solid var(--color-ink, #1f1f1f);
          border-bottom: 1.5px solid var(--color-ink, #1f1f1f);
          transform: rotate(45deg);
        }

        .chat-window {
          position: fixed;
          bottom: 84px;
          right: 20px;
          width: 380px;
          height: min(560px, 100svh - 120px);
          background: var(--color-cream, #FFF8EC);
          border: 1.5px solid var(--color-ink, #1f1f1f);
          box-shadow: 8px 8px 0 var(--color-ink, #1f1f1f);
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          z-index: 9998;
          overflow: hidden;
          transform-origin: bottom right;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.92) translateY(16px);
          transition: transform 220ms ease-out, opacity 220ms ease-out;
        }
        .chat-window.is-open {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1) translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-window {
            transition: none;
            transform: none !important;
          }
        }

        .chat-header {
          background: #E05228;
          color: #FFF8EC;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1.5px solid var(--color-ink, #1f1f1f);
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(30, 27, 22, 0.2);
          border-radius: 10px;
        }

        .chat-bubble {
          max-width: 85%;
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.4;
          position: relative;
        }
        .chat-bubble.bot {
          align-self: flex-start;
          background: #ffffff;
          color: var(--color-ink, #1f1f1f);
          border: 1.5px solid var(--color-ink, #1f1f1f);
          border-radius: 16px 16px 16px 4px;
        }
        .chat-bubble.user {
          align-self: flex-end;
          background: var(--color-sunflower, #F2B632);
          color: var(--color-ink, #1f1f1f);
          border-radius: 16px 16px 4px 16px;
        }

        .chat-time {
          font-size: 10px;
          opacity: 0.6;
          margin-top: 4px;
          text-align: right;
        }

        .chat-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .chat-chip {
          background: rgba(224, 82, 40, 0.1);
          color: #E05228;
          border: 1px solid rgba(224, 82, 40, 0.3);
          border-radius: 100px;
          padding: 6px 12px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chat-chip:hover {
          background: #E05228;
          color: #FFF8EC;
        }
        .chat-chip:focus-visible {
          outline: 2px solid var(--color-ink, #1f1f1f);
          outline-offset: 2px;
        }

        .chat-input-area {
          padding: 16px;
          border-top: 1.5px solid var(--color-ink, #1f1f1f);
          background: var(--color-cream, #FFF8EC);
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink, #1f1f1f);
        }
        .chat-input::placeholder {
          color: rgba(30, 27, 22, 0.5);
        }
        .chat-send {
          background: #E05228;
          color: #FFF8EC;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }
        .chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .chat-send:not(:disabled):hover {
          transform: scale(1.05);
        }
        .chat-send:focus-visible {
          outline: 2px solid var(--color-ink, #1f1f1f);
          outline-offset: 2px;
        }

        .chat-action-btn {
          margin-top: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-ink, #1f1f1f);
          color: var(--color-cream, #FFF8EC);
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          padding: 4px;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: rgba(30, 27, 22, 0.4);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .chat-window {
            right: 0;
            bottom: 0;
            width: 100%;
            height: 85svh;
            border-radius: 22px 22px 0 0;
            border-bottom: none;
            box-shadow: 0 -8px 24px rgba(0,0,0,0.15);
            transform-origin: bottom center;
          }
          .chat-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 9997;
            opacity: 0;
            pointer-events: none;
            transition: opacity 220ms;
          }
          .chat-backdrop.is-open {
            opacity: 1;
            pointer-events: auto;
          }
        }

        @media (max-width: 767px) {
          .chat-widget-btn.is-closed {
            right: calc(16px + env(safe-area-inset-right));
            bottom: calc(16px + env(safe-area-inset-bottom));
            width: 48px;
            height: 48px;
            border-radius: 50% !important;
            padding: 0;
            gap: 0;
            font-size: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
          }
          .chat-widget-btn.is-closed svg {
            width: 22px;
            height: 22px;
            margin: 0;
          }
          .unread-dot { top: 2px; right: 2px; }
        }
      `}} />

      {/* Backdrop for mobile */}
      <div className={`chat-backdrop ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(false)} />

      {/* Launcher Button */}
      <button 
        className={`chat-widget-btn ${isOpen ? 'is-open' : 'is-closed'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="chat-window"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {!isOpen && !hasOpenedOnce && <div className="unread-dot" />}
        {showNudge && (
          <div className="chat-nudge">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNudge(false); }} 
              style={{ position: 'absolute', top: '4px', right: '4px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5 }}
            >
              <X size={12} />
            </button>
            Hi! Questions about admissions? Ask me.
          </div>
        )}
        
        {isOpen ? <X size={24} /> : (
          <>
            <MessageCircle size={16} /> Chat with us
          </>
        )}
      </button>

      {/* Chat Window */}
      <div 
        id="chat-window"
        role="dialog"
        aria-label="Chat with Radiant Assistant"
        aria-modal="false"
        className={`chat-window ${isOpen ? 'is-open' : ''}`}
      >
        {/* Header */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: '#FFF8EC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E05228', fontWeight: 900, fontFamily: 'var(--font-serif)' }}>
              R
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, lineHeight: 1.1 }}>Radiant Assistant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', opacity: 0.9, fontFamily: 'var(--font-body)' }}>
                <div style={{ width: '6px', height: '6px', background: '#4ADE80', borderRadius: '50%' }} />
                Typically replies instantly
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'transparent', border: 'none', color: '#FFF8EC', cursor: 'pointer', padding: '4px' }}
              aria-label="Options"
            >
              <MoreVertical size={20} />
            </button>
            {menuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: '0', background: 'var(--color-cream, #FFF8EC)', border: '1.5px solid var(--color-ink, #1f1f1f)', borderRadius: '8px', padding: '4px', zIndex: 10, boxShadow: '4px 4px 0 #1f1f1f' }}>
                <button onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', color: 'var(--color-ink, #1f1f1f)', fontSize: '13px', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                  <Trash2 size={14} /> Clear chat
                </button>
              </div>
            )}
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#FFF8EC', cursor: 'pointer', padding: '4px' }}
              aria-label="Minimize"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((msg, idx) => (
            <div key={msg.id}>
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text}
                {msg.action && (
                  <button className="chat-action-btn" onClick={() => handleActionClick(msg.action)}>
                    {msg.action.label} &rarr;
                  </button>
                )}
                <div className="chat-time">{msg.timestamp}</div>
              </div>
              
              {/* Show chips after the LAST bot message */}
              {idx === messages.length - 1 && msg.sender === 'bot' && chips.length > 0 && (
                <div className="chat-chips">
                  {chips.map(chip => (
                    <button key={chip} className="chat-chip" onClick={() => handleSend(chip)}>
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-bubble bot">
              <div className="typing-dots">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div style={{ padding: '8px 16px', background: '#F5EBE1', fontSize: '10px', textAlign: 'center', color: 'rgba(30, 27, 22, 0.6)', fontFamily: 'var(--font-body)', borderTop: '1px solid rgba(30,27,22,0.05)' }}>
          Automated answers. For anything else, call us.
        </div>

        {/* Input */}
        <form className="chat-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}>
          <input 
            ref={inputRef}
            type="text" 
            className="chat-input"
            placeholder="Type your question..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            maxLength={200}
          />
          <button type="submit" className="chat-send" disabled={!inputValue.trim() || isTyping} aria-label="Send message">
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
};
