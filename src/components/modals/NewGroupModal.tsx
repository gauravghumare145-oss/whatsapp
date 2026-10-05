import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Users, X, Check, Image as ImageIcon } from 'lucide-react';

export const NewGroupModal: React.FC = () => {
  const { isNewGroupModalOpen, setIsNewGroupModalOpen, createGroupChat, savedProfiles, currentUser } = useWhatsApp();

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isNewGroupModalOpen) return null;

  // Filter out current user from participant selection
  const candidates = savedProfiles.filter((p) => p.id !== currentUser?.id);

  const toggleParticipant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    createGroupChat(groupName.trim(), selectedIds, description.trim());
    setIsNewGroupModalOpen(false);
    setGroupName('');
    setDescription('');
    setSelectedIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#008069] dark:bg-[#202c33] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <h3 className="font-semibold text-base">New Group</h3>
          </div>
          <button
            onClick={() => setIsNewGroupModalOpen(false)}
            className="p-1 rounded-full hover:bg-black/10 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-5 space-y-4">
          <div>
            <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Group Subject
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Project Discussion, Team Connect"
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Group Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about?"
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884] resize-none"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Select Participants ({selectedIds.length})
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {candidates.length > 0 ? (
                candidates.map((c) => {
                  const isSelected = selectedIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleParticipant(c.id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
                          : 'hover:bg-neutral-100 dark:hover:bg-[#202c33] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {c.name}
                          </h4>
                          <p className="text-3xs text-neutral-500 dark:text-neutral-400">
                            {c.email || c.phone}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-[#00a884] border-[#00a884] text-white'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                      >
                        {isSelected && <Check size={13} />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-neutral-500 p-2 text-center">
                  No other saved profiles yet. You can add more profiles in the Profiles Directory.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!groupName.trim()}
            className="w-full py-2.5 bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Create Group</span>
          </button>
        </form>
      </div>
    </div>
  );
};
