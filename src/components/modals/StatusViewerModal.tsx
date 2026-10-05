import React, { useState, useEffect } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';

export const StatusViewerModal: React.FC = () => {
  const {
    activeViewingStatus,
    setActiveViewingStatus,
    statuses,
    viewStatus,
    sendMessage,
    chats,
  } = useWhatsApp();

  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  // Mark status as viewed
  useEffect(() => {
    if (activeViewingStatus) {
      viewStatus(activeViewingStatus.id);
      setProgress(0);
    }
  }, [activeViewingStatus?.id]);

  // Find index in status list
  const currentIndex = statuses.findIndex((s) => s.id === activeViewingStatus?.id);

  // Auto-progress bar (5 seconds duration)
  useEffect(() => {
    if (!activeViewingStatus || isPaused) return;

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next status
          if (currentIndex < statuses.length - 1) {
            setActiveViewingStatus(statuses[currentIndex + 1]);
            return 0;
          } else {
            setActiveViewingStatus(null);
            return 0;
          }
        }
        return prev + 2; // ~50 ticks * 100ms = 5000ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeViewingStatus, currentIndex, isPaused, statuses]);

  if (!activeViewingStatus) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setActiveViewingStatus(statuses[currentIndex - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < statuses.length - 1) {
      setActiveViewingStatus(statuses[currentIndex + 1]);
    } else {
      setActiveViewingStatus(null);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Send reply to contact
    const targetChat = chats.find((c) => c.name === activeViewingStatus.userName);
    if (targetChat) {
      sendMessage(`Replied to your status: "${replyText.trim()}"`);
    }
    setReplyText('');
    setActiveViewingStatus(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 md:p-6 select-none animate-in fade-in duration-200"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative w-full max-w-md h-full md:h-[680px] bg-neutral-900 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Top Progress bar segments */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 pt-4 space-y-2 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex gap-1.5 h-1">
            {statuses.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 bg-white/30 rounded-full overflow-hidden h-full"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info & Close button */}
          <div className="flex items-center justify-between text-white pt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={activeViewingStatus.userAvatar}
                alt={activeViewingStatus.userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
              />
              <div>
                <h4 className="text-sm font-semibold leading-tight">
                  {activeViewingStatus.userName}
                </h4>
                <p className="text-3xs text-white/70">
                  {new Date(activeViewingStatus.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveViewingStatus(null)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Status Content */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {activeViewingStatus.type === 'image' ? (
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={activeViewingStatus.content}
                alt="Status"
                className="w-full h-full object-contain"
              />
              {activeViewingStatus.caption && (
                <div className="absolute bottom-16 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-center">
                  <p className="text-white text-sm font-medium drop-shadow-md">
                    {activeViewingStatus.caption}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-8 text-center"
              style={{
                backgroundColor: activeViewingStatus.backgroundColor || '#00a884',
              }}
            >
              <p className="text-white text-2xl font-bold max-w-xs leading-relaxed drop-shadow-md">
                {activeViewingStatus.content}
              </p>
            </div>
          )}

          {/* Left / Right Click Navigators */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Reply Bar */}
        <div className="relative z-30 p-3 bg-black/70 backdrop-blur-xs flex items-center gap-2">
          <form onSubmit={handleSendReply} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply to status..."
              className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white placeholder-white/50 text-xs outline-hidden border border-white/20 focus:border-[#00a884]"
            />
            {replyText.trim() && (
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 hover:bg-[#008f6f]"
              >
                <Send size={15} />
              </button>
            )}
          </form>

          <button
            onClick={() => {
              setReplyText('❤️');
            }}
            className="p-2 text-rose-400 hover:scale-125 transition-transform"
          >
            <Heart size={22} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};
