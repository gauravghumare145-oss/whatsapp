import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  X,
  Phone,
  Video,
  Lock,
  Star,
  Bell,
  VolumeX,
  Trash2,
  Users,
  Image as ImageIcon,
  FileText,
  Clock,
} from 'lucide-react';

export const ContactInfoDrawer: React.FC = () => {
  const {
    activeChat,
    isContactInfoOpen,
    setIsContactInfoOpen,
    activeMessages,
    startCall,
    muteChat,
    deleteChat,
    clearChatMessages,
  } = useWhatsApp();

  if (!isContactInfoOpen || !activeChat) return null;

  // Extract shared media
  const sharedMedia = activeMessages.filter(
    (m) => m.type === 'image' && m.mediaUrl
  );
  const sharedDocs = activeMessages.filter((m) => m.type === 'file');
  const starredMessages = activeMessages.filter((m) => m.starred);

  return (
    <div className="w-full sm:w-80 lg:w-96 border-l border-neutral-200 dark:border-neutral-800 bg-[#f0f2f5] dark:bg-[#111b21] h-full flex flex-col shrink-0 overflow-y-auto animate-in slide-in-from-right duration-200 z-20">
      {/* Header */}
      <div className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 select-none">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {activeChat.isGroup ? 'Group Info' : 'Contact Info'}
        </h3>
        <button
          onClick={() => setIsContactInfoOpen(false)}
          className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#202c33] rounded-2xl p-5 text-center shadow-2xs border border-neutral-100 dark:border-neutral-800 flex flex-col items-center">
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            className="w-24 h-24 rounded-full object-cover shadow-md mb-3 border-2 border-emerald-500"
          />
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-0.5">
            {activeChat.name}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            {activeChat.isGroup ? `${activeChat.participants.length} participants` : 'Online'}
          </p>

          {/* Call action buttons */}
          <div className="flex items-center justify-center gap-4 w-full">
            <button
              onClick={() => startCall(activeChat.id, 'audio')}
              className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-700/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-[#00a884] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone size={15} />
              <span>Audio</span>
            </button>
            <button
              onClick={() => startCall(activeChat.id, 'video')}
              className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-700/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-[#00a884] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Video size={16} />
              <span>Video</span>
            </button>
          </div>
        </div>

        {/* Description or About */}
        <div className="bg-white dark:bg-[#202c33] rounded-2xl p-4 shadow-2xs border border-neutral-100 dark:border-neutral-800 space-y-1">
          <span className="text-3xs font-bold uppercase tracking-wider text-neutral-400">
            {activeChat.isGroup ? 'Group Description' : 'About'}
          </span>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {activeChat.description || 'Hey there! I am using WhatsApp.'}
          </p>
        </div>

        {/* Shared Media Section */}
        {sharedMedia.length > 0 && (
          <div className="bg-white dark:bg-[#202c33] rounded-2xl p-4 shadow-2xs border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <span className="flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#00a884]" />
                <span>Media & Docs ({sharedMedia.length + sharedDocs.length})</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {sharedMedia.slice(0, 6).map((m) => (
                <img
                  key={m.id}
                  src={m.mediaUrl}
                  alt="Shared"
                  className="w-full h-16 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Starred Messages Section */}
        {starredMessages.length > 0 && (
          <div className="bg-white dark:bg-[#202c33] rounded-2xl p-4 shadow-2xs border border-neutral-100 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>Starred Messages ({starredMessages.length})</span>
            </div>
            <div className="space-y-1.5 pt-1 text-xs text-neutral-600 dark:text-neutral-300">
              {starredMessages.slice(0, 3).map((sm) => (
                <div key={sm.id} className="p-2 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg truncate">
                  {sm.content}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encryption info */}
        <div className="bg-white dark:bg-[#202c33] rounded-2xl p-4 shadow-2xs border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
          <Lock size={18} className="text-[#00a884] shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Encryption
            </h4>
            <p className="text-3xs text-neutral-500 dark:text-neutral-400">
              Messages and calls are end-to-end encrypted. Tap to verify.
            </p>
          </div>
        </div>

        {/* Settings actions */}
        <div className="bg-white dark:bg-[#202c33] rounded-2xl shadow-2xs border border-neutral-100 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          <button
            onClick={() => muteChat(activeChat.id)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/40 text-neutral-800 dark:text-neutral-200"
          >
            <div className="flex items-center gap-2.5">
              <Bell size={16} />
              <span>Mute notifications</span>
            </div>
            {activeChat.muted && <VolumeX size={15} className="text-[#00a884]" />}
          </button>

          <button
            onClick={() => clearChatMessages(activeChat.id)}
            className="w-full p-3.5 flex items-center gap-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700/40 text-neutral-800 dark:text-neutral-200"
          >
            <Trash2 size={16} />
            <span>Clear messages</span>
          </button>

          <button
            onClick={() => {
              deleteChat(activeChat.id);
              setIsContactInfoOpen(false);
            }}
            className="w-full p-3.5 flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"
          >
            <Trash2 size={16} />
            <span>Delete chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
