import React, { useEffect, useRef, useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const CallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleCallMute,
    toggleCallVideo,
  } = useWhatsApp();

  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Live timer for connected call
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') {
      setCallDuration(0);
      return;
    }

    const interval = window.setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall?.status]);

  // Request webcam access if video call
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (activeCall?.type === 'video' && !activeCall.isVideoOff) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          currentStream = s;
          setStream(s);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Webcam permission not granted for call simulation', err);
        });
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeCall?.type, activeCall?.isVideoOff]);

  if (!activeCall) return null;

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl h-[520px] bg-[#111b21] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between">
        {/* Remote Participant View / Background */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#182229] to-[#0c1317]">
          {activeCall.type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Simulated remote participant video banner */}
              <img
                src={activeCall.contactAvatar}
                alt={activeCall.contactName}
                className="w-full h-full object-cover opacity-60 blur-xs"
              />
              <div className="absolute flex flex-col items-center text-center">
                <img
                  src={activeCall.contactAvatar}
                  alt={activeCall.contactName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-2xl mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-1">
                  {activeCall.contactName}
                </h3>
                <p className="text-sm font-medium text-emerald-400">
                  {activeCall.status === 'ringing'
                    ? 'Ringing...'
                    : formatDuration(callDuration)}
                </p>
              </div>

              {/* Local PiP Video stream */}
              <div className="absolute bottom-20 right-4 w-32 h-44 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-white/20 shadow-xl">
                {!activeCall.isVideoOff && stream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 p-2 text-center text-2xs">
                    <VideoOff size={20} className="mb-1" />
                    <span>Camera off</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Audio Call view */
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img
                  src={activeCall.contactAvatar}
                  alt={activeCall.contactName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#00a884] shadow-2xl"
                />
                {activeCall.status === 'ringing' && (
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-75" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {activeCall.contactName}
              </h3>
              <p className="text-sm font-medium text-emerald-400">
                {activeCall.status === 'ringing'
                  ? 'WhatsApp Audio Calling...'
                  : formatDuration(callDuration)}
              </p>
            </div>
          )}
        </div>

        {/* Top Header info */}
        <div className="relative z-10 p-5 flex items-center justify-between text-white/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-semibold">
              End-to-End Encrypted
            </span>
          </div>
        </div>

        {/* Call control action bar */}
        <div className="relative z-10 p-6 flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Mute button */}
          <button
            onClick={toggleCallMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              activeCall.isMuted
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {activeCall.isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Video Toggle button */}
          {activeCall.type === 'video' && (
            <button
              onClick={toggleCallVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                activeCall.isVideoOff
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={activeCall.isVideoOff ? 'Turn camera on' : 'Turn camera off'}
            >
              {activeCall.isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>
          )}

          {/* End Call button (Red) */}
          <button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
            title="End call"
          >
            <PhoneOff size={26} />
          </button>
        </div>
      </div>
    </div>
  );
};
