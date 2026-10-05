import React from 'react';
import { Chat } from '../../types/whatsapp';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Check, CheckCheck, Pin, VolumeX, Mic, Image as ImageIcon, FileText } from 'lucide-react';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onSelect }) => {
  const { currentUser } = useWhatsApp();

  const formatTimestamp = (ts?: number) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  };

  const isOutgoing = chat.lastMessage?.senderId === currentUser?.id;

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-neutral-100 dark:border-neutral-800/60 transition-colors select-none ${
        isActive
          ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
          : 'hover:bg-neutral-50 dark:hover:bg-[#202c33]'
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover shadow-2xs"
        />
        {!chat.isGroup && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111b21]" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {chat.name}
          </h3>
          <span
            className={`text-3xs font-medium ${
              chat.unreadCount > 0
                ? 'text-[#00a884] dark:text-[#25d366]'
                : 'text-neutral-400'
            }`}
          >
            {formatTimestamp(chat.lastMessage?.timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 truncate pr-2">
            {/* Delivery ticks if last message is outgoing */}
            {isOutgoing && chat.lastMessage?.status && (
              <span className="shrink-0">
                {chat.lastMessage.status === 'sent' && <Check size={14} />}
                {chat.lastMessage.status === 'delivered' && <CheckCheck size={14} />}
                {chat.lastMessage.status === 'read' && (
                  <CheckCheck size={14} className="text-[#53bdeb]" />
                )}
              </span>
            )}

            {/* Media type icon preview */}
            {chat.lastMessage?.type === 'voice' && (
              <Mic size={14} className="text-[#00a884] shrink-0" />
            )}
            {chat.lastMessage?.type === 'image' && (
              <ImageIcon size={14} className="shrink-0" />
            )}
            {chat.lastMessage?.type === 'file' && (
              <FileText size={14} className="shrink-0" />
            )}

            <span className="truncate">
              {chat.lastMessage?.content || 'No messages yet'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {chat.muted && <VolumeX size={14} className="text-neutral-400" />}
            {chat.pinned && <Pin size={14} className="text-neutral-400" />}
            {chat.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#00a884] dark:bg-[#25d366] text-white dark:text-neutral-950 font-bold text-3xs flex items-center justify-center shadow-xs">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
