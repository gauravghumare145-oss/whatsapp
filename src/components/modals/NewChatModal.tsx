import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Search, Mail, Phone, UserPlus, Users, X, ArrowRight, Plus } from 'lucide-react';

export const NewChatModal: React.FC = () => {
  const {
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    setIsNewGroupModalOpen,
    setIsProfilesModalOpen,
    createDirectChat,
    chats,
    selectChat,
    savedProfiles,
    currentUser,
    startChatWithProfile,
  } = useWhatsApp();

  const [inputVal, setInputVal] = useState('');
  const [contactName, setContactName] = useState('');
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  if (!isNewChatModalOpen) return null;

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const identifier = inputVal.trim();
    const name = contactName.trim() || identifier;

    // Check if chat already exists
    const existing = chats.find(
      (c) => !c.isGroup && (c.name.toLowerCase() === name.toLowerCase() || c.name === identifier)
    );

    if (existing) {
      selectChat(existing.id);
    } else {
      createDirectChat(identifier, name);
    }

    setIsNewChatModalOpen(false);
    setInputVal('');
    setContactName('');
  };

  // Saved profiles excluding current user
  const otherProfiles = savedProfiles.filter((p) => p.id !== currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#008069] dark:bg-[#202c33] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={20} />
            <h3 className="font-semibold text-base">New Chat</h3>
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(false)}
            className="p-1 rounded-full hover:bg-black/10 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form to message ANY email or phone */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                setMethod('email');
                setInputVal('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                method === 'email'
                  ? 'bg-[#00a884] text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              <Mail size={14} />
              <span>Chat with Gmail / Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('phone');
                setInputVal('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                method === 'phone'
                  ? 'bg-[#00a884] text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              <Phone size={14} />
              <span>Chat with Phone</span>
            </button>
          </div>

          <form onSubmit={handleStartChat} className="space-y-3">
            <div>
              <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                {method === 'email' ? 'Recipient Gmail / Email' : 'Recipient Phone Number'}
              </label>
              <input
                type={method === 'email' ? 'email' : 'tel'}
                required
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  method === 'email' ? 'e.g. friend@gmail.com' : 'e.g. +91 98765 43210'
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                Contact Name (Optional)
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rahul"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Start Chatting</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Quick actions & Presets */}
        <div className="p-4 overflow-y-auto max-h-60 space-y-2">
          {/* New Group shortcut */}
          <button
            onClick={() => {
              setIsNewChatModalOpen(false);
              setIsNewGroupModalOpen(true);
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#202c33] transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                New group
              </h4>
              <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                Add friends and create a group chat
              </p>
            </div>
          </button>

          {/* Manage Saved Profiles shortcut */}
          <button
            onClick={() => {
              setIsNewChatModalOpen(false);
              setIsProfilesModalOpen(true);
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#202c33] transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Plus size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Saved Profiles Directory
              </h4>
              <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                Add new profiles or select from saved contacts
              </p>
            </div>
          </button>

          {otherProfiles.length > 0 && (
            <>
              <div className="text-3xs font-bold uppercase tracking-wider text-neutral-400 pt-2 px-1">
                Your Saved Contacts
              </div>

              {otherProfiles.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    startChatWithProfile(p);
                    setIsNewChatModalOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#202c33] cursor-pointer transition-colors"
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {p.name}
                    </h4>
                    <p className="text-3xs text-neutral-500 dark:text-neutral-400 truncate">
                      {p.email || p.phone}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
