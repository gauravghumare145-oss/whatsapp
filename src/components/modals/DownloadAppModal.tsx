import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Share2,
  Copy,
  Check,
  X,
  Smartphone,
  Laptop,
  Apple,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const DownloadAppModal: React.FC = () => {
  const { isDownloadModalOpen, setIsDownloadModalOpen } = useWhatsApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isDownloadModalOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setIsDownloadModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#111b21] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#008069] dark:bg-[#202c33] p-6 text-white relative">
          <button
            onClick={() => setIsDownloadModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
              <svg viewBox="0 0 32 32" className="w-8 h-8 fill-[#25d366]">
                <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.4 1.2 1.2-4.3-.3-.5a11.6 11.6 0 1 1 9.8 5.5zm6.4-8.6c-.3-.2-2-.9-2.3-1s-.5-.2-.8.2-.9 1-1.1 1.2-.4.2-.7 0a9.2 9.2 0 0 1-2.7-1.7 10.2 10.2 0 0 1-1.9-2.3c-.2-.3 0-.5.2-.7s.4-.4.5-.6.2-.4.3-.6 0-.4 0-.6-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7a1.4 1.4 0 0 0-1 .5 4.3 4.3 0 0 0-1.3 3.2 7.6 7.6 0 0 0 1.6 4 17.5 17.5 0 0 0 6.7 5.9c2.8 1.2 3.4 1 4 1a3.4 3.4 0 0 0 2.3-1.6 2.8 2.8 0 0 0 .2-1.6c-.2-.2-.5-.3-.9-.5z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Download WhatsApp</h2>
              <p className="text-xs text-white/80">Install on Mobile or PC to chat together</p>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Main Action Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 text-center space-y-3">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {isInstalled ? 'WhatsApp is Installed!' : 'Get WhatsApp for All Your Devices'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed">
              Install the app directly on your phone or computer. Once installed, you and your friends can chat, send voice notes, and make calls anytime.
            </p>

            {/* Direct PWA Install Trigger button */}
            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={handleNativeInstall}
                className="w-full py-3 px-4 bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Download size={18} />
                <span>Download & Install App (1-Click)</span>
              </button>
            )}

            {!isInstalled && !isInstallable && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-3 px-4 bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share App Link with Friends'}</span>
              </button>
            )}

            {isInstalled && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Check size={16} />
                <span>App is running in Standalone mode</span>
              </div>
            )}
          </div>

          {/* Share with Friends Section */}
          <div className="p-4 bg-neutral-50 dark:bg-[#202c33]/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Share App URL to Chat with Others
              </span>
              <span className="text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
                Real-Time Sync
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentAppUrl}
                className="flex-1 px-3 py-2 text-2xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#111b21] text-neutral-700 dark:text-neutral-300 font-mono select-all outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-3xs text-neutral-500 dark:text-neutral-400">
              Send this link to anyone on WhatsApp, email, or SMS. Anyone with the link can open the app, enter their profile, and chat with you immediately.
            </p>
          </div>

          {/* Platform Specific Install Instructions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Installation Guides by Device
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Android */}
              <div className="p-3 bg-neutral-50 dark:bg-[#202c33]/40 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <Smartphone size={16} className="text-[#00a884]" />
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Android</span>
                </div>
                <p className="text-3xs text-neutral-500 dark:text-neutral-400 leading-normal">
                  Tap Chrome menu (⋮) ➔ <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
                </p>
              </div>

              {/* iOS / iPhone */}
              <div className="p-3 bg-neutral-50 dark:bg-[#202c33]/40 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <Apple size={16} className="text-neutral-800 dark:text-neutral-200" />
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">iPhone / iPad</span>
                </div>
                <p className="text-3xs text-neutral-500 dark:text-neutral-400 leading-normal">
                  Tap Safari Share icon (⎋) ➔ scroll down and tap <strong>"Add to Home Screen"</strong>.
                </p>
              </div>

              {/* Windows / Mac */}
              <div className="p-3 bg-neutral-50 dark:bg-[#202c33]/40 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <Laptop size={16} className="text-blue-500" />
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">PC / Mac</span>
                </div>
                <p className="text-3xs text-neutral-500 dark:text-neutral-400 leading-normal">
                  Click the install icon (⊕) in your browser address bar to install as desktop app.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-[#202c33] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-2xs">
            <ShieldCheck size={14} className="text-[#00a884]" />
            <span>End-to-End Encrypted</span>
          </div>
          <button
            type="button"
            onClick={() => setIsDownloadModalOpen(false)}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg font-semibold transition-colors"
          >
            Continue to Web Chat
          </button>
        </div>
      </div>
    </div>
  );
};
