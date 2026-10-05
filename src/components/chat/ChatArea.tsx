import React, { useRef, useEffect, useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Lock,
  ArrowLeft,
  X,
  VolumeX,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';

interface ChatAreaProps {
  onBack?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onBack }) => {
  const {
    activeChat,
    activeMessages,
    isContactTyping,
    startCall,
    clearChatMessages,
    deleteChat,
    muteChat,
    setIsContactInfoOpen,
    wallpaper,
  } = useWhatsApp();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isContactTyping]);

  if (!activeChat) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#222e35] p-8 text-center border-b-[6px] border-[#00a884]">
        <div className="w-64 h-64 mb-6 opacity-80 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-[#00a884]">
            <svg viewBox="0 0 32 32" className="w-20 h-20 fill-currentColor">
              <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.4 1.2 1.2-4.3-.3-.5a11.6 11.6 0 1 1 9.8 5.5zm6.4-8.6c-.3-.2-2-.9-2.3-1s-.5-.2-.8.2-.9 1-1.1 1.2-.4.2-.7 0a9.2 9.2 0 0 1-2.7-1.7 10.2 10.2 0 0 1-1.9-2.3c-.2-.3 0-.5.2-.7s.4-.4.5-.6.2-.4.3-.6 0-.4 0-.6-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7a1.4 1.4 0 0 0-1 .5 4.3 4.3 0 0 0-1.3 3.2 7.6 7.6 0 0 0 1.6 4 17.5 17.5 0 0 0 6.7 5.9c2.8 1.2 3.4 1 4 1a3.4 3.4 0 0 0 2.3-1.6 2.8 2.8 0 0 0 .2-1.6c-.2-.2-.5-.3-.9-.5z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-light text-neutral-800 dark:text-neutral-100 mb-2">
          WhatsApp Web
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
          Send and receive messages without keeping your phone online. Use WhatsApp on your computer with email or phone number.
        </p>
        <div className="mt-8 flex items-center gap-1.5 text-xs text-neutral-400">
          <Lock size={12} />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    );
  }

  // Filter messages by in-chat search if active
  const displayedMessages = chatSearchQuery.trim()
    ? activeMessages.filter((m) =>
        m.content.toLowerCase().includes(chatSearchQuery.toLowerCase())
      )
    : activeMessages;

  // Wallpaper style selection
  const getWallpaperClass = () => {
    switch (wallpaper) {
      case 'dark':
        return 'bg-[#0b141a]';
      case 'emerald':
        return 'bg-[#062e24]';
      case 'purple':
        return 'bg-[#1e1329]';
      case 'sky':
        return 'bg-[#0e2433]';
      case 'plain':
        return 'bg-[#efeae2] dark:bg-[#0b141a]';
      case 'doodle':
      default:
        return 'bg-[#efeae2] dark:bg-[#0b141a] bg-blend-soft-light';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#111b21]">
      {/* Chat Header */}
      <div className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 select-none z-10">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 -ml-1 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div
            onClick={() => setIsContactInfoOpen(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={activeChat.avatar}
                alt={activeChat.name}
                className="w-10 h-10 rounded-full object-cover shadow-2xs"
              />
              {!activeChat.isGroup && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#202c33]" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-[#00a884] transition-colors">
                {activeChat.name}
              </h2>
              <p className="text-2xs truncate">
                {isContactTyping ? (
                  <span className="text-[#00a884] dark:text-[#25d366] font-medium animate-pulse">
                    typing...
                  </span>
                ) : activeChat.isGroup ? (
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {activeChat.description || 'Group conversation'}
                  </span>
                ) : (
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Online
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
          <button
            onClick={() => startCall(activeChat.id, 'video')}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Video call"
          >
            <Video size={20} />
          </button>

          <button
            onClick={() => startCall(activeChat.id, 'audio')}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Voice call"
          >
            <Phone size={19} />
          </button>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Search inside chat"
          >
            <Search size={19} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="More options"
            >
              <MoreVertical size={19} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-30 w-52 bg-white dark:bg-[#233138] rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-1.5 text-xs text-neutral-700 dark:text-neutral-200"
                onClick={() => setShowMenu(false)}
              >
                <button
                  onClick={() => setIsContactInfoOpen(true)}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  {activeChat.isGroup ? 'Group info' : 'Contact info'}
                </button>
                <button
                  onClick={() => muteChat(activeChat.id)}
                  className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <span>Mute notifications</span>
                  {activeChat.muted && <VolumeX size={14} className="text-[#00a884]" />}
                </button>
                <button
                  onClick={() => clearChatMessages(activeChat.id)}
                  className="w-full px-4 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  Clear messages
                </button>
                <button
                  onClick={() => deleteChat(activeChat.id)}
                  className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Delete chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search overlay inside chat */}
      {showSearch && (
        <div className="px-4 py-2 bg-neutral-100 dark:bg-[#182229] border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
          <Search size={16} className="text-neutral-400" />
          <input
            type="text"
            value={chatSearchQuery}
            onChange={(e) => setChatSearchQuery(e.target.value)}
            placeholder="Search in chat..."
            className="flex-1 bg-transparent text-xs text-neutral-800 dark:text-neutral-200 outline-hidden"
            autoFocus
          />
          {chatSearchQuery && (
            <button
              onClick={() => setChatSearchQuery('')}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={() => {
              setShowSearch(false);
              setChatSearchQuery('');
            }}
            className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium px-2 py-1"
          >
            Close
          </button>
        </div>
      )}

      {/* Chat Message Stream */}
      <div
        className={`flex-1 overflow-y-auto p-4 md:px-12 relative ${getWallpaperClass()}`}
        style={{
          backgroundImage:
            wallpaper === 'doodle'
              ? `radial-gradient(circle at 50% 50%, rgba(0, 168, 132, 0.03) 0%, transparent 60%)`
              : undefined,
        }}
      >
        {/* Encryption banner */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#ffeecd] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-2xs py-1.5 px-3 rounded-lg shadow-2xs flex items-center gap-1.5 max-w-sm text-center">
            <Lock size={12} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
            </span>
          </div>
        </div>

        {/* Date divider badge */}
        <div className="flex justify-center mb-3">
          <span className="bg-white/80 dark:bg-[#182229]/80 backdrop-blur-xs text-neutral-600 dark:text-neutral-300 text-3xs font-semibold px-3 py-1 rounded-md shadow-2xs uppercase tracking-wider">
            Today
          </span>
        </div>

        {/* Messages */}
        {displayedMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isGroup={activeChat.isGroup}
          />
        ))}

        {/* Bottom anchor for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Chat Input */}
      <ChatInput />
    </div>
  );
};
