import React, { useState } from 'react';
import { WhatsAppProvider, useWhatsApp } from './context/WhatsAppContext';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { ContactInfoDrawer } from './components/modals/ContactInfoDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { CallModal } from './components/modals/CallModal';
import { StatusViewerModal } from './components/modals/StatusViewerModal';
import { NewChatModal } from './components/modals/NewChatModal';
import { NewGroupModal } from './components/modals/NewGroupModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { DownloadAppModal } from './components/modals/DownloadAppModal';
import { ProfilesModal } from './components/modals/ProfilesModal';
import { Download, X, Users, Sparkles } from 'lucide-react';

const WhatsAppMain: React.FC = () => {
  const { activeChat, setIsDownloadModalOpen, setIsProfilesModalOpen } = useWhatsApp();
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('sidebar');
  const [showTopDownloadBanner, setShowTopDownloadBanner] = useState<boolean>(true);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#eae6df] dark:bg-[#0c1317] flex flex-col items-center justify-center">
      {/* WhatsApp Web Green Top Banner bar */}
      <div className="absolute top-0 inset-x-0 h-32 bg-[#00a884] dark:bg-[#00a884]/20 hidden md:block -z-0" />

      {/* Prominent Download & Profiles Top Notification Banner */}
      {showTopDownloadBanner && (
        <div className="relative z-20 w-full md:w-[98%] lg:w-[95%] max-w-[1680px] bg-[#008069] text-white px-4 py-2 flex items-center justify-between shadow-md md:rounded-t-xl text-xs shrink-0 select-none animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5 truncate">
            <span className="p-1 rounded-full bg-white/20">
              <Download size={15} />
            </span>
            <p className="truncate">
              <span className="font-bold">Download WhatsApp App:</span> Install on your mobile or desktop so everyone can chat together anytime!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-3 py-1 bg-white text-[#008069] hover:bg-neutral-100 font-bold rounded-full text-2xs shadow-xs transition-colors flex items-center gap-1"
            >
              <Download size={13} />
              <span>Download App</span>
            </button>

            <button
              onClick={() => setIsProfilesModalOpen(true)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full text-2xs transition-colors hidden sm:flex items-center gap-1"
            >
              <Users size={13} />
              <span>Profiles</span>
            </button>

            <button
              onClick={() => setShowTopDownloadBanner(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors ml-1"
              title="Dismiss banner"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Main WhatsApp Window Container */}
      <div
        className={`relative z-10 w-full flex-1 md:flex-initial md:w-[98%] ${
          showTopDownloadBanner ? 'md:h-[91%] lg:h-[91%]' : 'md:h-[96%] lg:h-[96%]'
        } max-w-[1680px] bg-white dark:bg-[#111b21] md:rounded-b-xl ${
          !showTopDownloadBanner ? 'md:rounded-t-xl' : ''
        } shadow-2xl overflow-hidden flex flex-col border border-neutral-300 dark:border-neutral-800`}
      >
        <div className="flex-1 flex w-full h-full overflow-hidden">
          {/* Left Sidebar */}
          <div
            className={`h-full ${
              mobileView === 'chat' && activeChat ? 'hidden md:flex' : 'flex'
            } w-full md:w-auto`}
          >
            <Sidebar onChatSelected={() => setMobileView('chat')} />
          </div>

          {/* Center Chat Area */}
          <div
            className={`flex-1 h-full ${
              mobileView === 'sidebar' && !activeChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <ChatArea onBack={() => setMobileView('sidebar')} />
          </div>

          {/* Right Contact Info Drawer (desktop slide out) */}
          <ContactInfoDrawer />
        </div>
      </div>

      {/* All Overlay Modals */}
      <AuthModal />
      <CallModal />
      <StatusViewerModal />
      <NewChatModal />
      <NewGroupModal />
      <SettingsModal />
      <DownloadAppModal />
      <ProfilesModal />
    </div>
  );
};

export default function App() {
  return (
    <WhatsAppProvider>
      <WhatsAppMain />
    </WhatsAppProvider>
  );
}
