import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { sound } from '../../utils/audio';
import {
  Settings,
  X,
  User,
  Image as ImageIcon,
  Bell,
  Moon,
  Sun,
  Shield,
  Palette,
  Check,
  LogOut,
  Camera,
  RefreshCw,
} from 'lucide-react';

const WALLPAPER_OPTIONS = [
  { id: 'doodle', name: 'Classic Doodle', color: '#efeae2', darkColor: '#0b141a' },
  { id: 'dark', name: 'Dark Slate', color: '#182229', darkColor: '#182229' },
  { id: 'emerald', name: 'Emerald WhatsApp', color: '#075e54', darkColor: '#062e24' },
  { id: 'purple', name: 'Royal Purple', color: '#311b92', darkColor: '#1e1329' },
  { id: 'sky', name: 'Deep Sky', color: '#0d47a1', darkColor: '#0e2433' },
  { id: 'plain', name: 'Plain Clean', color: '#f0f2f5', darkColor: '#111b21' },
];

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    currentUser,
    updateProfile,
    wallpaper,
    setWallpaper,
    darkMode,
    setDarkMode,
    soundEnabled,
    setSoundEnabled,
    logout,
  } = useWhatsApp();

  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [aboutInput, setAboutInput] = useState(currentUser?.about || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsModalOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim() || currentUser.name,
      about: aboutInput.trim() || currentUser.about,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    updateProfile({ avatar: newAvatar });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#008069] dark:bg-[#202c33] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h3 className="font-semibold text-base">WhatsApp Settings</h3>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1 rounded-full hover:bg-black/10 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-neutral-50 dark:bg-[#202c33]/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="relative group shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-emerald-500"
              />
              <label
                htmlFor="avatar-file-input"
                className="absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-2xs"
                title="Upload Photo"
              >
                <Camera size={18} className="mb-0.5" />
                <span>Change</span>
              </label>
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFile}
              />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {currentUser.name}
                </h4>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="p-1 rounded-full text-neutral-400 hover:text-[#00a884] hover:bg-black/5"
                  title="Randomize avatar"
                >
                  <RefreshCw size={13} />
                </button>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-1">
                {currentUser.about}
              </p>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#00a884] text-2xs font-semibold">
                <Shield size={12} />
                <span>
                  Logged in with {currentUser.loginMethod === 'email' ? 'Gmail / Email' : 'Mobile Number'}:{' '}
                  {currentUser.email || currentUser.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                About / Status
              </label>
              <input
                type="text"
                value={aboutInput}
                onChange={(e) => setAboutInput(e.target.value)}
                placeholder="Hey there! I am using WhatsApp."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 outline-hidden focus:border-[#00a884]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-2xs text-emerald-600 font-medium">
                {savedSuccess ? 'Profile saved successfully!' : ''}
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Chat Wallpaper Customization */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              <Palette size={16} className="text-[#00a884]" />
              <span>Chat Wallpaper</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {WALLPAPER_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setWallpaper(item.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-18 transition-all ${
                    wallpaper === item.id
                      ? 'border-[#00a884] ring-2 ring-[#00a884]/30'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                  }`}
                  style={{
                    backgroundColor: darkMode ? item.darkColor : item.color,
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-2xs font-semibold ${
                        item.id === 'plain' || item.id === 'doodle'
                          ? 'text-neutral-800 dark:text-neutral-100'
                          : 'text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                    {wallpaper === item.id && (
                      <Check size={14} className="text-[#00a884]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferences & Toggles */}
          <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                <span>Dark Theme</span>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  darkMode ? 'bg-[#00a884]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    darkMode ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Sound notification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <Bell size={16} />
                <span>Message & Call Sounds</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sound.playMessageReceived()}
                  className="text-2xs text-[#00a884] hover:underline"
                >
                  Test Sound
                </button>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    soundEnabled ? 'bg-[#00a884]' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      soundEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => {
                setIsSettingsModalOpen(false);
                logout();
              }}
              className="w-full py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut size={16} />
              <span>Log out from WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
