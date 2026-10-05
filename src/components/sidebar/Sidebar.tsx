import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ChatListItem } from './ChatListItem';
import { StatusList } from './StatusList';
import { ChannelsList } from './ChannelsList';
import { CallsList } from './CallsList';
import {
  MessageSquare,
  CircleDot,
  Radio,
  Phone,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Sun,
  Moon,
  Users,
  Settings,
  LogOut,
  UserCheck,
  Download,
  Share2,
  X,
} from 'lucide-react';

interface SidebarProps {
  onChatSelected?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onChatSelected }) => {
  const {
    currentUser,
    chats,
    activeChatId,
    selectChat,
    sidebarTab,
    setSidebarTab,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    darkMode,
    setDarkMode,
    setIsNewChatModalOpen,
    setIsNewGroupModalOpen,
    setIsSettingsModalOpen,
    setIsAuthModalOpen,
    setIsDownloadModalOpen,
    setIsProfilesModalOpen,
    logout,
    statuses,
  } = useWhatsApp();

  const [showMenu, setShowMenu] = useState(false);

  // Check if any contact has unviewed status
  const hasUnviewedStatus = statuses.some(
    (s) => s.userId !== currentUser?.id && !s.viewers.includes(currentUser?.id || '')
  );

  // Filter chats by query & type filter
  const filteredChats = chats.filter((chat) => {
    // Search query filter
    if (searchQuery.trim()) {
      const matchName = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLastMsg = chat.lastMessage?.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchName && !matchLastMsg) return false;
    }

    // Category chip filter
    if (filterType === 'unread') return chat.unreadCount > 0;
    if (filterType === 'groups') return chat.isGroup;
    if (filterType === 'favorites') return chat.pinned;

    return !chat.archived;
  });

  return (
    <div className="w-full md:w-[380px] lg:w-[420px] h-full flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111b21] shrink-0">
      {/* Top Header */}
      <div className="h-16 px-3 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between shrink-0 select-none z-10 border-b border-neutral-200 dark:border-neutral-800">
        {/* User profile picture */}
        <div
          onClick={() => setIsSettingsModalOpen(true)}
          className="flex items-center gap-2 cursor-pointer group"
          title="Profile settings"
        >
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover shadow-2xs group-hover:ring-2 group-hover:ring-[#00a884] transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#202c33]" />
          </div>
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[70px] truncate hidden sm:inline">
            {currentUser?.name}
          </span>
        </div>

        {/* Tab Navigation & Action Icons */}
        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
          {/* Download App Action Button (Prominent) */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 text-[#00a884] text-xs font-bold transition-all shadow-2xs"
            title="Download & Install App"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Saved Profiles Directory Button */}
          <button
            onClick={() => setIsProfilesModalOpen(true)}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300"
            title="Saved Profiles & Contacts"
          >
            <Users size={19} />
          </button>

          {/* Status stories tab */}
          <button
            onClick={() => setSidebarTab('status')}
            className={`p-2 rounded-full relative transition-colors ${
              sidebarTab === 'status'
                ? 'text-[#00a884] bg-neutral-200 dark:bg-neutral-700'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="Status"
          >
            <CircleDot size={19} />
            {hasUnviewedStatus && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00a884]" />
            )}
          </button>

          {/* Channels / Communities tab */}
          <button
            onClick={() => setSidebarTab('channels')}
            className={`p-2 rounded-full transition-colors ${
              sidebarTab === 'channels'
                ? 'text-[#00a884] bg-neutral-200 dark:bg-neutral-700'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="Channels & Updates"
          >
            <Radio size={19} />
          </button>

          {/* Chats tab & New Chat */}
          <button
            onClick={() => {
              if (sidebarTab !== 'chats') {
                setSidebarTab('chats');
              } else {
                setIsNewChatModalOpen(true);
              }
            }}
            className={`p-2 rounded-full transition-colors ${
              sidebarTab === 'chats'
                ? 'text-[#00a884] bg-neutral-200 dark:bg-neutral-700'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="New Chat"
          >
            <MessageSquare size={19} />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Three Dots Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="Menu"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-30 w-52 bg-white dark:bg-[#233138] rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-1.5 text-xs text-neutral-700 dark:text-neutral-200"
                onClick={() => setShowMenu(false)}
              >
                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 text-[#00a884] font-semibold"
                >
                  <Download size={15} />
                  <span>Download WhatsApp</span>
                </button>

                <button
                  onClick={() => setIsProfilesModalOpen(true)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <Users size={15} />
                  <span>Saved Profiles Directory</span>
                </button>

                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <Plus size={15} />
                  <span>New chat</span>
                </button>

                <button
                  onClick={() => setIsNewGroupModalOpen(true)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <Users size={15} />
                  <span>New group</span>
                </button>

                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <Settings size={15} />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                >
                  <UserCheck size={15} />
                  <span>Login / Switch account</span>
                </button>

                <div className="border-t border-neutral-100 dark:border-neutral-700/60 my-1" />

                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut size={15} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* If in Chats Tab, show Search Bar & Category Filter Chips */}
      {sidebarTab === 'chats' && (
        <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 space-y-2 bg-white dark:bg-[#111b21]">
          {/* Search box */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg">
            <Search size={16} className="text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'favorites', label: 'Favorites' },
                { id: 'groups', label: 'Groups' },
              ] as const
            ).map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                  filterType === chip.id
                    ? 'bg-[#00a884] text-white shadow-2xs'
                    : 'bg-[#f0f2f5] dark:bg-[#202c33] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Header if in Status, Channels, or Calls */}
      {sidebarTab !== 'chats' && (
        <div className="px-4 py-2.5 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 capitalize">
            {sidebarTab}
          </h2>
          <button
            onClick={() => setSidebarTab('chats')}
            className="text-xs text-[#00a884] hover:underline font-medium"
          >
            Back to chats
          </button>
        </div>
      )}

      {/* Tab Views */}
      {sidebarTab === 'chats' && (
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/40">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onSelect={() => {
                  selectChat(chat.id);
                  onChatSelected?.();
                }}
              />
            ))
          ) : (
            <div className="p-8 text-center text-neutral-400 space-y-2">
              <MessageSquare size={32} className="mx-auto opacity-50" />
              <p className="text-sm">No chats found</p>
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="text-xs text-[#00a884] hover:underline font-medium"
              >
                Start a new chat
              </button>
            </div>
          )}
        </div>
      )}

      {sidebarTab === 'status' && <StatusList />}
      {sidebarTab === 'channels' && <ChannelsList />}
      {sidebarTab === 'calls' && <CallsList />}
    </div>
  );
};
