import React, { useState } from 'react';
import { Message } from '../../types/whatsapp';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import {
  Check,
  CheckCheck,
  Star,
  FileText,
  CornerUpLeft,
  Trash2,
  Copy,
  Smile,
  MoreVertical,
  Download,
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isGroup: boolean;
}

const COMMON_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isGroup }) => {
  const {
    currentUser,
    addReaction,
    starMessage,
    deleteMessage,
    setReplyingToMessage,
  } = useWhatsApp();

  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isOutgoing = message.senderId === currentUser?.id;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setShowMenu(false);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReply = () => {
    setReplyingToMessage(message);
    setShowMenu(false);
  };

  return (
    <div
      id={`msg-${message.id}`}
      className={`group relative flex flex-col mb-1.5 transition-all ${
        isOutgoing ? 'items-end' : 'items-start'
      }`}
      onMouseLeave={() => {
        setShowMenu(false);
        setShowEmojiPicker(false);
      }}
    >
      <div className="relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] flex items-start">
        {/* Hover action menu trigger */}
        <div
          className={`absolute top-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity ${
            isOutgoing ? '-left-8' : '-right-8'
          }`}
        >
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full bg-white dark:bg-[#202c33] shadow-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600"
            >
              <MoreVertical size={14} />
            </button>

            {/* Context dropdown menu */}
            {showMenu && (
              <div
                className={`absolute top-full mt-1 z-30 w-44 bg-white dark:bg-[#233138] rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700/80 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 animate-in fade-in zoom-in-95 duration-100 ${
                  isOutgoing ? 'right-0' : 'left-0'
                }`}
              >
                {/* Emoji quick reaction strip */}
                <div className="flex items-center justify-around px-2 py-1.5 border-b border-neutral-100 dark:border-neutral-700/60 mb-1">
                  {COMMON_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        addReaction(message.id, emoji);
                        setShowMenu(false);
                      }}
                      className="hover:scale-125 transition-transform text-sm p-0.5"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleReply}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <CornerUpLeft size={14} />
                  <span>Reply</span>
                </button>

                <button
                  onClick={() => {
                    starMessage(message.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <Star size={14} className={message.starred ? 'fill-yellow-400 text-yellow-400' : ''} />
                  <span>{message.starred ? 'Unstar' : 'Star'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <Copy size={14} />
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => {
                    deleteMessage(message.id, false);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={14} />
                  <span>Delete for me</span>
                </button>

                {isOutgoing && !message.deletedForEveryone && (
                  <button
                    onClick={() => {
                      deleteMessage(message.id, true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={14} />
                    <span>Delete for everyone</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* The actual speech bubble */}
        <div
          className={`relative rounded-xl px-3 py-1.5 shadow-xs text-sm transition-colors ${
            isOutgoing
              ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-neutral-900 dark:text-neutral-100 rounded-tr-xs'
              : 'bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 rounded-tl-xs'
          } ${message.deletedForEveryone ? 'italic text-neutral-400 dark:text-neutral-400' : ''}`}
        >
          {/* Sender name for group chats */}
          {!isOutgoing && isGroup && (
            <p className="text-2xs font-bold text-[#00a884] dark:text-[#25d366] mb-0.5">
              {message.senderName}
            </p>
          )}

          {/* Quoted reply banner */}
          {message.replyTo && (
            <div
              onClick={() => {
                const target = document.getElementById(`msg-${message.replyTo?.id}`);
                target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className={`mb-1.5 p-1.5 rounded-lg border-l-4 border-[#00a884] text-xs cursor-pointer ${
                isOutgoing
                  ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-neutral-700 dark:text-neutral-300'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              <p className="font-semibold text-2xs text-[#00a884]">
                {message.replyTo.senderName}
              </p>
              <p className="truncate line-clamp-1">{message.replyTo.content}</p>
            </div>
          )}

          {/* Photo / Image message */}
          {message.type === 'image' && message.mediaUrl && (
            <div className="mb-1 rounded-lg overflow-hidden">
              <img
                src={message.mediaUrl}
                alt="Shared media"
                className="max-h-72 w-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setPreviewImage(message.mediaUrl || null)}
              />
              {message.caption && <p className="mt-1 text-sm">{message.caption}</p>}
            </div>
          )}

          {/* Voice note message */}
          {message.type === 'voice' && (
            <VoiceNotePlayer
              duration={message.audioDuration || 14}
              audioUrl={message.mediaUrl}
              isOutgoing={isOutgoing}
            />
          )}

          {/* File / Document message */}
          {message.type === 'file' && (
            <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-black/20 rounded-lg my-0.5">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs truncate">
                  {message.fileName || message.content}
                </p>
                <p className="text-3xs text-neutral-500 dark:text-neutral-400">
                  {message.fileSize || 'PDF Document'}
                </p>
              </div>
              <a
                href={message.mediaUrl || '#'}
                download={message.fileName || 'file'}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors"
                title="Download file"
              >
                <Download size={16} />
              </a>
            </div>
          )}

          {/* Plain Text content */}
          {message.type === 'text' && (
            <p className="whitespace-pre-wrap break-words leading-relaxed pr-2">
              {message.content}
            </p>
          )}

          {/* Timestamp and Delivery ticks */}
          <div className="flex items-center justify-end gap-1 mt-0.5 ml-auto -mb-0.5 text-3xs text-neutral-500 dark:text-neutral-400 select-none">
            {message.starred && (
              <Star size={11} className="fill-neutral-400 text-neutral-400 mr-0.5" />
            )}
            <span>{formatTime(message.timestamp)}</span>
            {isOutgoing && (
              <span>
                {message.status === 'sent' && <Check size={14} className="text-neutral-400" />}
                {message.status === 'delivered' && (
                  <CheckCheck size={14} className="text-neutral-400" />
                )}
                {message.status === 'read' && (
                  <CheckCheck size={14} className="text-[#53bdeb]" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Message Reactions display pill */}
      {message.reactions && message.reactions.length > 0 && (
        <div
          className={`flex items-center gap-1 -mt-2 z-10 px-2 py-0.5 rounded-full bg-white dark:bg-[#202c33] border border-neutral-200 dark:border-neutral-700/80 shadow-xs text-xs cursor-pointer select-none ${
            isOutgoing ? 'mr-3' : 'ml-3'
          }`}
          onClick={() => {
            // Quick toggle first reaction
            if (message.reactions?.[0]) {
              addReaction(message.id, message.reactions[0].emoji);
            }
          }}
        >
          {message.reactions.map((r, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span>{r.emoji}</span>
              {r.users.length > 1 && (
                <span className="text-3xs text-neutral-500 font-medium">
                  {r.users.length}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Image Preview Lightbox modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Enlarged"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
