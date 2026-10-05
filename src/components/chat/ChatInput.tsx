import React, { useState, useRef, useEffect } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { VoiceRecorder } from './VoiceRecorder';
import {
  Smile,
  Paperclip,
  Mic,
  Send,
  Image as ImageIcon,
  FileText,
  Camera,
  X,
} from 'lucide-react';

const EMOJI_CATEGORIES = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😜', '🤪', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😴', '🤤', '😷', '🤒', '🤕'] },
  { name: 'Gestures', emojis: ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶'] },
  { name: 'Hearts & Vibes', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '✨', '⭐', '🌟', '💫', '💥', '💯', '🔥', '🎉', '🎊'] },
  { name: 'Food & Objects', emojis: ['☕', '🍵', '🧃', '🥤', '🍺', '🍻', '🥂', '🍷', '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥗', '🍝', '🍜', '🍣', '🍱', '🍦', '🍩', '🍪', '🎂', '🍰', '🍫', '🍬', '🍭', '💻', '📱', '⌚', '📷', '📹', '💡', '🔑', '🎁', '🎈'] },
];

export const ChatInput: React.FC = () => {
  const {
    sendMessage,
    replyingToMessage,
    setReplyingToMessage,
  } = useWhatsApp();

  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize input textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim(), 'text');
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      sendMessage('Photo', 'image', {
        mediaUrl: dataUrl,
        caption: file.name,
      });
    };
    reader.readAsDataURL(file);
    setShowAttachmentMenu(false);
    e.target.value = '';
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    sendMessage(file.name, 'file', {
      fileName: file.name,
      fileSize: sizeFormatted,
    });
    setShowAttachmentMenu(false);
    e.target.value = '';
  };

  const handleVoiceSend = (audioBlobUrl?: string, duration?: number) => {
    setIsRecordingVoice(false);
    const audioDur = duration || 8;
    sendMessage(`Voice note (0:${audioDur < 10 ? '0' : ''}${audioDur})`, 'voice', {
      mediaUrl: audioBlobUrl,
      audioDuration: audioDur,
    });
  };

  return (
    <div className="relative border-t border-neutral-200 dark:border-neutral-800 bg-[#f0f2f5] dark:bg-[#202c33] p-2.5">
      {/* Quoted reply banner */}
      {replyingToMessage && (
        <div className="flex items-center justify-between p-2 mb-2 bg-white dark:bg-[#111b21] rounded-lg border-l-4 border-[#00a884] shadow-xs text-xs animate-in slide-in-from-bottom-2 duration-150">
          <div className="truncate pr-2">
            <span className="font-semibold text-[#00a884] block">
              Replying to {replyingToMessage.senderName}
            </span>
            <span className="text-neutral-600 dark:text-neutral-400 truncate block">
              {replyingToMessage.content}
            </span>
          </div>
          <button
            onClick={() => setReplyingToMessage(null)}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageSelected}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 left-2 z-40 w-80 max-w-[90vw] bg-white dark:bg-[#202c33] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700/80 p-3 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-700/60 mb-2">
            <div className="flex gap-1">
              {EMOJI_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedEmojiCategory(idx)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    selectedEmojiCategory === idx
                      ? 'bg-[#00a884] text-white font-medium'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 h-52 overflow-y-auto pr-1">
            {EMOJI_CATEGORIES[selectedEmojiCategory].emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setText((prev) => prev + emoji)}
                className="text-xl p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-transform active:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Menu Popup */}
      {showAttachmentMenu && (
        <div className="absolute bottom-full mb-2 left-12 z-40 w-48 bg-white dark:bg-[#233138] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700/80 p-2 animate-in fade-in zoom-in-95 duration-100">
          <div className="space-y-1">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                <ImageIcon size={18} />
              </div>
              <span className="font-medium">Photos & Videos</span>
            </button>

            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
                <Camera size={18} />
              </div>
              <span className="font-medium">Camera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="font-medium">Document</span>
            </button>
          </div>
        </div>
      )}

      {/* If recording voice note */}
      {isRecordingVoice ? (
        <VoiceRecorder
          onCancel={() => setIsRecordingVoice(false)}
          onSend={handleVoiceSend}
        />
      ) : (
        <div className="flex items-end gap-1.5 sm:gap-2">
          {/* Emoji button */}
          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowAttachmentMenu(false);
            }}
            className={`p-2 rounded-full transition-colors ${
              showEmojiPicker
                ? 'text-[#00a884] bg-neutral-200 dark:bg-neutral-700'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
            title="Emojis"
          >
            <Smile size={22} />
          </button>

          {/* Attachment button */}
          <button
            type="button"
            onClick={() => {
              setShowAttachmentMenu(!showAttachmentMenu);
              setShowEmojiPicker(false);
            }}
            className={`p-2 rounded-full transition-colors ${
              showAttachmentMenu
                ? 'text-[#00a884] bg-neutral-200 dark:bg-neutral-700'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
            title="Attach file or photo"
          >
            <Paperclip size={22} />
          </button>

          {/* Text input area */}
          <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-xl border border-transparent focus-within:border-neutral-300 dark:focus-within:border-neutral-600 flex items-center px-3 py-1 shadow-2xs">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="w-full bg-transparent resize-none outline-hidden text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 max-h-28 py-1.5"
            />
          </div>

          {/* Send or Voice Record button */}
          {text.trim() ? (
            <button
              type="button"
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
              title="Send message"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="w-10 h-10 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center shrink-0 transition-colors"
              title="Hold to record voice message"
            >
              <Mic size={22} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
