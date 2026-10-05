import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

interface VoiceNotePlayerProps {
  duration?: number;
  audioUrl?: string;
  isOutgoing: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  duration = 15,
  audioUrl,
  isOutgoing,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate realistic pseudo-random waveform bar heights
  const bars = [18, 30, 45, 70, 85, 40, 60, 95, 80, 50, 65, 90, 75, 45, 60, 80, 95, 65, 40, 55, 70, 85, 60, 40, 30, 20];

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.playbackRate = playbackSpeed;

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress(audio.currentTime / audio.duration);
        }
      };

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioUrl, playbackSpeed]);

  const togglePlay = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    // Simulated playback when no real blob URL
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const totalSteps = duration * 10;
      const stepTime = (100 / playbackSpeed);

      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 / totalSteps;
        });
      }, stepTime);
    }
  };

  const handleSpeedCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSpeed: 1 | 1.5 | 2 = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const currentSeconds = Math.floor(progress * duration);
  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;
  const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="flex items-center gap-2.5 py-1 min-w-[220px] max-w-[280px]">
      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          isOutgoing
            ? 'bg-[#00a884] text-white'
            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100'
        }`}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>

      {/* Waveform and progress */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          className="flex items-center gap-[2.5px] h-7 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setProgress(Math.max(0, Math.min(1, clickPos)));
            if (audioRef.current && audioRef.current.duration) {
              audioRef.current.currentTime = clickPos * audioRef.current.duration;
            }
          }}
        >
          {bars.map((height, i) => {
            const barPos = i / bars.length;
            const isFilled = barPos <= progress;
            return (
              <span
                key={i}
                style={{ height: `${height}%` }}
                className={`w-[3px] rounded-full transition-colors ${
                  isFilled
                    ? '#00a884'
                    : isOutgoing
                    ? 'bg-emerald-300 dark:bg-emerald-700/60'
                    : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            );
          })}
        </div>

        {/* Duration and timestamp */}
        <div className="flex items-center justify-between text-3xs font-mono mt-0.5 text-neutral-500 dark:text-neutral-400">
          <span>{isPlaying ? timeStr : `0:${duration < 10 ? '0' : ''}${duration}`}</span>
          <button
            onClick={handleSpeedCycle}
            className="px-1 py-0.5 rounded text-3xs font-bold bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Mic icon indicator */}
      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 text-[#00a884]">
        <Mic size={16} />
      </div>
    </div>
  );
};
