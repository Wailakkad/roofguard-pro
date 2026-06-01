import React, { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi 👋 How can we help you today?", isUser: false },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMsg, isUser: true }]);
    setInputValue('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for reaching out! One of our roofing specialists will get back to you shortly. For immediate assistance, please call us at 1-800-ROOF-GUARD.",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="fixed flex flex-col overflow-hidden z-[9999]"
          style={{
            bottom: '100px',
            right: '24px',
            width: '340px',
            maxWidth: 'calc(100% - 32px)',
            height: '460px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            animation: 'chatFadeIn 0.3s ease',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: '#f97316',
              color: '#ffffff',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '14px' }}>RoofGuard Support</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
              }}
              className="hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              background: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                  background: msg.isUser ? '#f97316' : '#ffffff',
                  color: msg.isUser ? '#ffffff' : '#1a1a1a',
                  padding: '10px 14px',
                  borderRadius: msg.isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  fontSize: '13px',
                  maxWidth: '80%',
                  lineHeight: 1.5,
                  boxShadow: msg.isUser ? '0 2px 8px rgba(249,115,22,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div
            style={{
              borderTop: '1px solid #eee',
              padding: '12px',
              display: 'flex',
              gap: '8px',
              background: '#ffffff',
            }}
          >
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '50px',
                border: '1px solid #ddd',
                fontSize: '13px',
                outline: 'none',
              }}
              className="focus:border-orange-400 transition-colors"
            />
            <button
              onClick={handleSend}
              style={{
                background: '#f97316',
                color: '#ffffff',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              className="hover:bg-orange-600 transition-colors"
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#f97316',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          boxShadow: '0 10px 25px rgba(249,115,22,0.4)',
          transition: 'transform 0.2s ease',
        }}
        className="hover:scale-105"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <style>{`
        @media (max-width: 768px) {
          div[style*="bottom: 100px"][style*="right: 24px"][style*="width: 340px"] {
            width: calc(100% - 20px) !important;
            right: 10px !important;
            bottom: 90px !important;
            height: 70vh !important;
          }
          button[style*="bottom: 24px"][style*="right: 24px"][style*="width: 60px"] {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
