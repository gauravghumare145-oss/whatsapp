import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Send, Mic, Pause, Play } from 'lucide-react';

interface VoiceRecorderProps {
  onCancel: () => void;
  onSend: (audioBlobUrl?: string, duration?: number) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onCancel, onSend }) => {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Start microphone stream
    let mounted = true;

    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start(250);

        intervalRef.current = window.setInterval(() => {
          setSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.warn('Microphone permission not granted, using simulated recording timer', err);
        intervalRef.current = window.setInterval(() => {
          setSeconds((prev) => prev + 1);
        }, 1000);
      }
    }

    initMic();

    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleTogglePause = () => {
    if (!mediaRecorderRef.current) {
      setIsPaused(!isPaused);
      return;
    }
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const handleFinishAndSend = () => {
    const finalSeconds = Math.max(1, seconds);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        onSend(audioUrl, finalSeconds);
      };
      mediaRecorderRef.current.stop();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      onSend(undefined, finalSeconds);
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="flex items-center justify-between w-full py-2 px-3 bg-neutral-100 dark:bg-[#202c33] rounded-xl animate-in slide-in-from-bottom-2 duration-150">
      {/* Delete button */}
      <button
        type="button"
        onClick={() => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
          }
          onCancel();
        }}
        className="p-2 text-neutral-500 hover:text-red-500 transition-colors rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
        title="Cancel recording"
      >
        <Trash2 size={20} />
      </button>

      {/* Recording status & duration */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {formatTimer(seconds)}
          </span>
        </div>

        {/* Live waveform simulation */}
        <div className="flex items-center gap-0.5 h-5 px-2">
          {[12, 24, 18, 28, 14, 20, 26, 16, 22, 14].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-[#00a884] rounded-full transition-all duration-150"
              style={{
                height: isPaused ? '6px' : `${h + Math.sin(Date.now() / 200 + i) * 6}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Pause/Resume button */}
        <button
          type="button"
          onClick={handleTogglePause}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
        </button>

        {/* Send voice message */}
        <button
          type="button"
          onClick={handleFinishAndSend}
          className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          title="Send voice message"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};
