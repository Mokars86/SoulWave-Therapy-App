import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Wind, X, ChevronDown, Heart } from 'lucide-react';
import { Track } from '../types';

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void; // To minimize
  onTrackEnd?: () => void;
}

export const Player: React.FC<PlayerProps> = ({ track, isPlaying, onTogglePlay, onClose, onTrackEnd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Initialize audio and handle track changes
  useEffect(() => {
    if (track && audioRef.current) {
      // Only update src if it's different to avoid reloading on re-renders if track object reference changes but content is same
      if (audioRef.current.src !== track.audioUrl) {
         audioRef.current.src = track.audioUrl || '';
         audioRef.current.load();
         if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.log("Autoplay prevented or interrupted:", error);
                // We don't necessarily want to toggle play off here if it's just an interruption due to rapid switching
              });
            }
         }
      }
    } else if (!track) {
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [track?.id, track?.audioUrl]); // Depend on ID and URL

  // Handle play/pause toggle from props
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
           playPromise.catch(error => {
             // Ignore AbortError which happens when pausing rapidly after playing
             if (error.name !== 'AbortError') {
                console.error("Play error:", error);
             }
           });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total || track?.duration || 0); // Fallback to track duration if loading
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleEnded = () => {
    if (onTrackEnd) {
      onTrackEnd();
    }
    setProgress(0);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const percentage = Math.max(0, Math.min(1, x / width));
      
      const newTime = percentage * (audioRef.current.duration || track?.duration || 0);
      audioRef.current.currentTime = newTime;
      setProgress(percentage * 100);
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!track) return null;

  return (
    <>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleEnded} 
        onLoadedMetadata={handleTimeUpdate}
      />
      
      {!isExpanded ? (
        // Minified Player
        <div 
          className="fixed bottom-[80px] left-4 right-4 bg-soul-card/90 backdrop-blur-md p-3 rounded-2xl border border-soul-text/5 shadow-2xl flex items-center justify-between z-40 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={track.imageUrl} alt={track.title} className={`w-12 h-12 rounded-full object-cover shadow-sm ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '10s' }} />
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-soul-text truncate">{track.title}</span>
              <span className="text-xs text-soul-primary">{track.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-3 rounded-full bg-soul-primary text-white shadow-lg shadow-soul-primary/30 active:scale-95 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay();
              }}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
          </div>
          {/* Progress bar line at bottom */}
          <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-soul-text/5 rounded-full overflow-hidden">
              <div className="h-full bg-soul-primary transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : (
        // Full Screen Player
        <div className="fixed inset-0 bg-soul-darker z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setIsExpanded(false)} className="text-soul-muted hover:text-soul-text p-2 rounded-full hover:bg-soul-surface/50 transition-colors">
              <ChevronDown size={32} />
            </button>
            <span className="text-xs font-bold tracking-widest text-soul-primary uppercase">Now Playing</span>
            <button className="text-soul-muted hover:text-soul-text p-2 rounded-full hover:bg-soul-surface/50 transition-colors">
              <Wind size={24} />
            </button>
          </div>

          {/* Visual Area */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Ambient Glow */}
            <div className={`absolute w-64 h-64 bg-soul-primary/20 rounded-full blur-[80px] ${isPlaying ? 'animate-pulse' : ''}`}></div>
            
            {/* Main Art */}
            <div className="relative z-10 w-72 h-72 rounded-full overflow-hidden shadow-2xl shadow-soul-primary/10 border-4 border-soul-text/5">
              <img src={track.imageUrl} alt="Album Art" className="w-full h-full object-cover" />
              {/* Breathe Overlay */}
              {isPlaying && (
                <div className="absolute inset-0 bg-soul-primary/10 animate-breathe rounded-full"></div>
              )}
            </div>
          </div>

          {/* Controls Area */}
          <div className="px-8 pb-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-soul-text mb-1">{track.title}</h2>
                <p className="text-soul-muted">{track.artist} • {track.category}</p>
              </div>
              <button onClick={() => setIsLiked(!isLiked)} className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-soul-muted hover:text-soul-text hover:bg-soul-surface'}`}>
                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Scrubber */}
            <div className="mb-8 group">
              <div 
                ref={progressBarRef}
                className="h-1.5 bg-soul-text/10 rounded-full w-full mb-2 overflow-hidden cursor-pointer relative"
                onClick={handleSeek}
              >
                <div className="h-full bg-soul-primary relative transition-all duration-100 ease-linear pointer-events-none" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-soul-text rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-soul-muted font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Buttons */}
            <div className="flex items-center justify-between mb-8">
                <button className="text-soul-muted hover:text-soul-text transition-colors"><Repeat size={20} /></button>
                <button 
                  className="text-soul-text hover:text-soul-primary transition-colors"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime -= 10;
                  }}
                >
                  <SkipBack size={32} />
                </button>
                <button 
                  onClick={onTogglePlay}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-soul-primary to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-teal-500/30 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                  className="text-soul-text hover:text-soul-primary transition-colors"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime += 10;
                  }}
                >
                  <SkipForward size={32} />
                </button>
                <button onClick={toggleMute} className="text-soul-muted hover:text-soul-text transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>

            <div className="flex justify-center">
                <button className="text-xs font-bold text-soul-muted uppercase tracking-widest border border-soul-text/10 px-6 py-2.5 rounded-full hover:border-soul-primary hover:text-soul-text transition-colors">
                    Play Timer
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};