import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat, Wind, X, ChevronDown, Heart } from 'lucide-react';
import { Track } from '../types';

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void; // To minimize
}

export const Player: React.FC<PlayerProps> = ({ track, isPlaying, onTogglePlay, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && track) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.1)); // Simulated progress
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track]);

  if (!track) return null;

  // Minified Player
  if (!isExpanded) {
    return (
      <div 
        className="fixed bottom-[80px] left-4 right-4 bg-soul-surface/95 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between z-40 cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img src={track.imageUrl} alt={track.title} className={`w-12 h-12 rounded-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '10s' }} />
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-white truncate">{track.title}</span>
            <span className="text-xs text-soul-primary">{track.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-full bg-soul-primary text-soul-darker"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
        </div>
        {/* Progress bar line at bottom */}
        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-soul-primary" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  }

  // Full Screen Player
  return (
    <div className="fixed inset-0 bg-soul-darker z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white">
          <ChevronDown size={32} />
        </button>
        <span className="text-xs font-medium tracking-widest text-soul-primary uppercase">Now Playing</span>
        <button className="text-gray-400 hover:text-white">
          <Wind size={24} />
        </button>
      </div>

      {/* Visual Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Ambient Glow */}
        <div className={`absolute w-64 h-64 bg-soul-primary/20 rounded-full blur-[80px] ${isPlaying ? 'animate-pulse' : ''}`}></div>
        
        {/* Main Art */}
        <div className="relative z-10 w-72 h-72 rounded-full overflow-hidden shadow-2xl shadow-soul-primary/10 border-4 border-white/5">
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
            <h2 className="text-2xl font-bold text-white mb-1">{track.title}</h2>
            <p className="text-gray-400">{track.artist} • {track.category}</p>
          </div>
          <button onClick={() => setIsLiked(!isLiked)} className={`${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
            <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Scrubber */}
        <div className="mb-8">
          <div className="h-1 bg-white/10 rounded-full w-full mb-2 overflow-hidden">
            <div className="h-full bg-soul-primary relative" style={{ width: `${progress}%` }}>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 hover:scale-100 transition-transform"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.floor((track.duration * (progress / 100)) / 60)}:{String(Math.floor((track.duration * (progress / 100)) % 60)).padStart(2, '0')}</span>
            <span>{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="flex items-center justify-between mb-8">
            <button className="text-gray-400 hover:text-white"><Repeat size={20} /></button>
            <button className="text-white hover:text-soul-primary"><SkipBack size={32} /></button>
            <button 
              onClick={onTogglePlay}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-soul-primary to-emerald-400 flex items-center justify-center text-soul-darker shadow-lg shadow-teal-500/30 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-white hover:text-soul-primary"><SkipForward size={32} /></button>
            <button className="text-gray-400 hover:text-white"><Volume2 size={20} /></button>
        </div>

        <div className="flex justify-center">
            <button className="text-xs text-gray-500 uppercase tracking-widest border border-gray-700 px-4 py-2 rounded-full hover:border-soul-primary transition-colors">
                Play Timer
            </button>
        </div>
      </div>
    </div>
  );
};