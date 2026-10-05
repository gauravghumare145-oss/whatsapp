import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneCall } from 'lucide-react';

export const CallsList: React.FC = () => {
  const { calls, startCall, chats } = useWhatsApp();

  const formatCallDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `(${m}m ${s}s)`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#111b21] pb-6">
      {/* Create call link banner */}
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3 bg-neutral-50/50 dark:bg-[#111b21]">
        <div className="w-11 h-11 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 shadow-xs">
          <PhoneCall size={20} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Create a call link
          </h4>
          <p className="text-2xs text-neutral-500 dark:text-neutral-400">
            Share a secure link for your WhatsApp audio or video call
          </p>
        </div>
      </div>

      <div className="px-4 py-3 text-3xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Recent Calls
      </div>

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
        {calls.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#202c33] transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={call.contactAvatar}
                alt={call.contactName}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {call.contactName}
                </h4>
                <div className="flex items-center gap-1.5 text-2xs text-neutral-500 dark:text-neutral-400">
                  {call.direction === 'incoming' && (
                    <PhoneIncoming size={13} className="text-emerald-500" />
                  )}
                  {call.direction === 'outgoing' && (
                    <PhoneOutgoing size={13} className="text-emerald-500" />
                  )}
                  {call.direction === 'missed' && (
                    <PhoneMissed size={13} className="text-red-500" />
                  )}
                  <span>{formatCallDate(call.timestamp)}</span>
                  {call.duration && <span>{formatDuration(call.duration)}</span>}
                </div>
              </div>
            </div>

            {/* Quick redial button */}
            <button
              onClick={() => {
                const targetChat = chats.find((c) => c.name === call.contactName) || chats[0];
                if (targetChat) {
                  startCall(targetChat.id, call.type);
                }
              }}
              className="p-2.5 rounded-full text-[#00a884] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              title={`Call ${call.contactName}`}
            >
              {call.type === 'video' ? <Video size={18} /> : <Phone size={18} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
