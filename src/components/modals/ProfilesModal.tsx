import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Users,
  UserPlus,
  X,
  Check,
  Mail,
  Phone,
  MessageSquare,
  ArrowRightLeft,
  Trash2,
  Sparkles,
  Camera,
} from 'lucide-react';
import { LoginMethod } from '../../types/whatsapp';

export const ProfilesModal: React.FC = () => {
  const {
    isProfilesModalOpen,
    setIsProfilesModalOpen,
    savedProfiles,
    currentUser,
    addProfile,
    deleteProfile,
    switchToProfile,
    startChatWithProfile,
  } = useWhatsApp();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [method, setMethod] = useState<LoginMethod>('email');
  const [identifier, setIdentifier] = useState('');
  const [about, setAbout] = useState('Available | Using WhatsApp');
  const [avatarUrl, setAvatarUrl] = useState('');

  if (!isProfilesModalOpen) return null;

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim()) return;

    const defaultAvatar =
      avatarUrl.trim() ||
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

    addProfile({
      name: name.trim(),
      about: about.trim(),
      avatar: defaultAvatar,
      loginMethod: method,
      email: method === 'email' ? identifier.trim() : undefined,
      phone: method === 'phone' ? identifier.trim() : undefined,
    });

    setName('');
    setIdentifier('');
    setAvatarUrl('');
    setIsAdding(false);
  };

  const generateRandomSeed = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#111b21] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-[#008069] dark:bg-[#202c33] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Users size={22} />
            <div>
              <h3 className="font-bold text-base leading-tight">Profiles & Contact Directory</h3>
              <p className="text-2xs text-white/80">Manage saved profiles or enter a new profile to chat</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfilesModalOpen(false)}
            className="p-1 rounded-full hover:bg-black/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Add Profile Trigger / Header */}
          {!isAdding ? (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Saved Profiles ({savedProfiles.length})
                </h4>
                <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                  Anyone can select their profile to use the app or message others
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="px-3.5 py-2 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <UserPlus size={15} />
                <span>+ Add New Profile</span>
              </button>
            </div>
          ) : (
            /* Add Profile Form */
            <form onSubmit={handleCreateProfile} className="p-4 bg-neutral-50 dark:bg-[#202c33]/50 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700/60 pb-2">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <UserPlus size={16} className="text-[#00a884]" />
                  <span>Create & Save New Profile</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111b21] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
                  autoFocus
                />
              </div>

              {/* Method choice */}
              <div>
                <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Sign-In Identity
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('email');
                      setIdentifier('');
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      method === 'email'
                        ? 'border-[#00a884] bg-[#00a884] text-white'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#111b21] text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Mail size={14} />
                    <span>Gmail / Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('phone');
                      setIdentifier('');
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      method === 'phone'
                        ? 'border-[#00a884] bg-[#00a884] text-white'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#111b21] text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Phone size={14} />
                    <span>Mobile Number</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  {method === 'email' ? 'Gmail / Email Address' : 'Mobile Phone Number'}
                </label>
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={method === 'email' ? 'e.g. rahul@gmail.com' : 'e.g. +91 98765 43210'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111b21] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  About / Status
                </label>
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="e.g. Available | Working from home"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111b21] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={generateRandomSeed}
                  className="text-2xs text-[#00a884] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles size={12} />
                  <span>Generate New Avatar</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Profiles List */}
          <div className="space-y-3">
            {savedProfiles.map((p) => {
              const isCurrent = currentUser?.id === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-[#00a884] bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-[#202c33]/40 hover:bg-neutral-100/70 dark:hover:bg-[#202c33]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-12 h-12 rounded-full object-cover shadow-2xs border-2 border-emerald-500"
                      />
                      {isCurrent && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111b21]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {p.name}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-[#00a884] text-white font-bold text-3xs">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-2xs text-neutral-500 dark:text-neutral-400 truncate">
                        {p.email || p.phone}
                      </p>
                      <p className="text-3xs text-neutral-400 dark:text-neutral-500 truncate">
                        {p.about}
                      </p>
                    </div>
                  </div>

                  {/* Actions for this profile */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isCurrent ? (
                      <button
                        type="button"
                        onClick={() => switchToProfile(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Use app as this person"
                      >
                        <ArrowRightLeft size={13} />
                        <span>Switch</span>
                      </button>
                    ) : null}

                    {/* Chat with this profile button */}
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => startChatWithProfile(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                        title="Send message to this person"
                      >
                        <MessageSquare size={13} />
                        <span>Chat</span>
                      </button>
                    )}

                    {/* Delete button (only if not primary default) */}
                    {p.id !== 'user_gaurav' && !isCurrent && (
                      <button
                        type="button"
                        onClick={() => deleteProfile(p.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        title="Delete profile"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-[#202c33] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-2xs text-neutral-500 dark:text-neutral-400">
            Open in another browser tab to chat with different profiles in real time!
          </span>
          <button
            type="button"
            onClick={() => setIsProfilesModalOpen(false)}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
