import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { CheckCircle2, Users, Bell } from 'lucide-react';

export const ChannelsList: React.FC = () => {
  const { channels, toggleFollowChannel } = useWhatsApp();

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M followers`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K followers`;
    return `${count} followers`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#111b21] p-3 space-y-4">
      {/* Intro Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00a884] text-white flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Stay updated on topics you care about
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Find and follow verified channels to receive announcements and multimedia updates.
            </p>
          </div>
        </div>
      </div>

      <div className="text-3xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-1">
        Featured Channels
      </div>

      <div className="space-y-3">
        {channels.map((chan) => (
          <div
            key={chan.id}
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 bg-neutral-50/50 dark:bg-[#202c33]/40 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={chan.avatar}
                  alt={chan.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {chan.name}
                    </h4>
                    {chan.verified && (
                      <CheckCircle2 size={15} className="text-[#00a884] fill-[#00a884]/20" />
                    )}
                  </div>
                  <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                    {formatFollowers(chan.followersCount)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollowChannel(chan.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  chan.isFollowing
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300'
                    : 'bg-[#00a884] hover:bg-[#008f6f] text-white shadow-xs'
                }`}
              >
                {chan.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {chan.description}
            </p>

            {/* Latest post snippet */}
            {chan.posts[0] && (
              <div className="p-2.5 bg-white dark:bg-[#111b21] rounded-xl border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
                <p className="line-clamp-2">{chan.posts[0].content}</p>
                {chan.posts[0].imageUrl && (
                  <img
                    src={chan.posts[0].imageUrl}
                    alt="Channel media"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                )}
                <div className="text-3xs text-neutral-400 text-right">
                  {chan.posts[0].reactionsCount.toLocaleString()} reactions
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
