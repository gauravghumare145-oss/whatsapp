import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Plus, Camera, Edit3, X, Check } from 'lucide-react';

const STATUS_COLORS = [
  '#00a884',
  '#128c7e',
  '#075e54',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#2563eb',
  '#1e293b',
];

export const StatusList: React.FC = () => {
  const {
    currentUser,
    statuses,
    addStatus,
    setActiveViewingStatus,
  } = useWhatsApp();

  const [isAddingTextStatus, setIsAddingTextStatus] = useState(false);
  const [textStatusContent, setTextStatusContent] = useState('');
  const [selectedBgColor, setSelectedBgColor] = useState(STATUS_COLORS[0]);

  // Find user's own status
  const myStatus = statuses.find((s) => s.userId === currentUser?.id);
  const contactStatuses = statuses.filter((s) => s.userId !== currentUser?.id);

  const handlePostTextStatus = () => {
    if (!textStatusContent.trim()) return;
    addStatus('text', textStatusContent.trim(), undefined, selectedBgColor);
    setTextStatusContent('');
    setIsAddingTextStatus(false);
  };

  const handlePhotoStatusUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      addStatus('image', reader.result as string, file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const formatStatusTime = (ts: number) => {
    const diffMin = Math.floor((Date.now() - ts) / (1000 * 60));
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return 'Yesterday';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#111b21] pb-6">
      {/* Hidden image upload input */}
      <input
        type="file"
        id="status-photo-input"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoStatusUpload}
      />

      {/* My Status Section */}
      <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div
          onClick={() => {
            if (myStatus) {
              setActiveViewingStatus(myStatus);
            } else {
              setIsAddingTextStatus(true);
            }
          }}
          className="flex items-center gap-3 cursor-pointer flex-1 group"
        >
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt="My Avatar"
              className={`w-12 h-12 rounded-full object-cover ${
                myStatus
                  ? 'p-0.5 border-2 border-[#00a884]'
                  : 'border border-neutral-200 dark:border-neutral-700'
              }`}
            />
            {!myStatus && (
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#00a884] text-white flex items-center justify-center border-2 border-white dark:border-[#111b21]">
                <Plus size={12} />
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              My status
            </h4>
            <p className="text-2xs text-neutral-500 dark:text-neutral-400">
              {myStatus
                ? `Updated ${formatStatusTime(myStatus.timestamp)}`
                : 'Tap to add status update'}
            </p>
          </div>
        </div>

        {/* Quick add status buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => document.getElementById('status-photo-input')?.click()}
            className="p-2 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Add photo status"
          >
            <Camera size={18} />
          </button>
          <button
            onClick={() => setIsAddingTextStatus(true)}
            className="p-2 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Add text status"
          >
            <Edit3 size={18} />
          </button>
        </div>
      </div>

      {/* Recent Updates Header */}
      <div className="px-4 py-3 bg-neutral-50 dark:bg-[#111b21] text-3xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Recent updates
      </div>

      {/* Contact Status List */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
        {contactStatuses.map((item) => {
          const isViewed = currentUser ? item.viewers.includes(currentUser.id) : false;

          return (
            <div
              key={item.id}
              onClick={() => setActiveViewingStatus(item)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <div
                className={`relative p-0.5 rounded-full border-2 ${
                  isViewed
                    ? 'border-neutral-300 dark:border-neutral-600'
                    : 'border-[#00a884] dark:border-[#25d366]'
                }`}
              >
                <img
                  src={item.userAvatar}
                  alt={item.userName}
                  className="w-11 h-11 rounded-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {item.userName}
                </h4>
                <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                  {formatStatusTime(item.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Text Status Modal */}
      {isAddingTextStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            className="w-full max-w-md h-[460px] rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative transition-all"
            style={{ backgroundColor: selectedBgColor }}
          >
            <button
              onClick={() => setIsAddingTextStatus(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-black/20"
            >
              <X size={20} />
            </button>

            <div className="flex-1 flex items-center justify-center pt-8">
              <textarea
                value={textStatusContent}
                onChange={(e) => setTextStatusContent(e.target.value)}
                placeholder="Type a status update..."
                className="w-full bg-transparent text-white placeholder-white/60 text-center text-2xl font-semibold outline-hidden resize-none"
                rows={4}
                autoFocus
              />
            </div>

            <div className="space-y-4">
              {/* Color swatches */}
              <div className="flex items-center justify-center gap-2">
                {STATUS_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedBgColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      selectedBgColor === c ? 'scale-125 border-white' : 'border-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePostTextStatus}
                  disabled={!textStatusContent.trim()}
                  className="px-5 py-2.5 bg-white text-neutral-900 font-semibold rounded-full shadow-lg flex items-center gap-2 hover:bg-neutral-100 disabled:opacity-50 transition-all"
                >
                  <Check size={18} />
                  <span>Send Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
