import React, { useState, useEffect } from 'react';
import { Home, Search, Headphones, Heart, User } from 'lucide-react';
import { View, Track, Category, UserStats } from './types';
import { MOCK_TRACKS, ONBOARDING_STEPS } from './constants';
import { Player } from './components/Player';
import { Button } from './components/Button';
import { getMoodRecommendation, AIRecord } from './services/geminiService';

// --- Sub-components (Pages) ---

const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const content = ONBOARDING_STEPS[step];

  return (
    <div className="h-screen w-full relative bg-soul-darker flex flex-col text-white">
      <img src={content.image} alt="Onboarding" className="absolute inset-0 w-full h-3/4 object-cover opacity-60 mask-image-gradient" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
      <div className="flex-1 z-10 flex flex-col justify-end p-8 pb-12 bg-gradient-to-t from-soul-darker via-soul-darker/90 to-transparent">
        <h1 className="text-4xl font-bold mb-4 leading-tight">{content.title}</h1>
        <p className="text-gray-300 text-lg mb-8">{content.description}</p>
        <div className="flex gap-2 mb-8">
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-soul-primary' : 'w-2 bg-gray-600'}`} />
          ))}
        </div>
        <Button onClick={handleNext} fullWidth>
          {step === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

const HomePage: React.FC<{ onPlay: (t: Track) => void, onMoodSelect: (mood: string) => void }> = ({ onPlay, onMoodSelect }) => {
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";
  
  const [moodInput, setMoodInput] = useState('');
  const [isMoodLoading, setIsMoodLoading] = useState(false);
  const [moodResults, setMoodResults] = useState<AIRecord[]>([]);

  const handleMoodSubmit = async () => {
    if (!moodInput.trim()) return;
    setIsMoodLoading(true);
    const results = await getMoodRecommendation(moodInput);
    setMoodResults(results);
    setIsMoodLoading(false);
  };

  return (
    <div className="pb-24 pt-8 px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-light text-gray-300">{greeting},</h1>
          <h2 className="text-xl font-bold text-white">Breathe & Relax</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-soul-surface border border-gray-700 flex items-center justify-center relative">
            <span className="text-xs">👤</span>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-soul-dark"></div>
        </div>
      </div>

      {/* AI Mood Check-in */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-soul-darker border border-indigo-500/30">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
           ✨ AI Mood Matcher
        </h3>
        <p className="text-sm text-indigo-200 mb-4">Tell us how you feel, and we'll curate a session.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="e.g., Stressed about exams..." 
            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-soul-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleMoodSubmit()}
          />
          <button 
            onClick={handleMoodSubmit}
            disabled={isMoodLoading}
            className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          >
            {isMoodLoading ? '...' : 'Go'}
          </button>
        </div>

        {moodResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {moodResults.map((rec, idx) => (
               <div key={idx} className="bg-white/5 p-3 rounded-lg flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{rec.title}</p>
                    <p className="text-xs text-indigo-300">{rec.reason}</p>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{rec.category}</span>
               </div>
            ))}
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="relative w-full h-64 rounded-3xl overflow-hidden mb-8 group cursor-pointer" onClick={() => onPlay(MOCK_TRACKS[0])}>
        <img src={MOCK_TRACKS[0].imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Featured" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <span className="bg-soul-primary/90 text-soul-darker text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">FEATURED</span>
          <h3 className="text-2xl font-bold text-white mb-1">{MOCK_TRACKS[0].title}</h3>
          <p className="text-gray-300 text-sm">{MOCK_TRACKS[0].duration / 60} mins • {MOCK_TRACKS[0].category}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
        {Object.values(Category).map((cat) => (
          <button key={cat} className="whitespace-nowrap px-5 py-2.5 rounded-full bg-soul-surface border border-white/5 text-gray-300 text-sm font-medium hover:bg-soul-primary hover:text-soul-darker transition-colors">
            {cat === Category.SLEEP ? '💤 ' : cat === Category.MEDITATION ? '🧘 ' : cat === Category.FOCUS ? '🧠 ' : cat === Category.HEALING ? '💓 ' : '🌿 '} 
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended */}
      <h3 className="text-lg font-bold text-white mb-4">Recommended for You</h3>
      <div className="space-y-4">
        {MOCK_TRACKS.slice(1, 4).map((track) => (
          <div key={track.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onPlay(track)}>
            <img src={track.imageUrl} alt={track.title} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="text-white font-medium">{track.title}</h4>
              <p className="text-gray-500 text-xs">{track.duration / 60} mins • {track.category}</p>
            </div>
            <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white">
              <div className="ml-0.5 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent"></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExplorePage: React.FC<{ onPlay: (t: Track) => void }> = ({ onPlay }) => {
  const [filter, setFilter] = useState('All');
  
  const filteredTracks = filter === 'All' ? MOCK_TRACKS : MOCK_TRACKS.filter(t => t.category === filter);

  return (
    <div className="pb-24 pt-8 px-6">
      <h2 className="text-2xl font-bold text-white mb-6">Explore</h2>
      
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search sounds, moods, frequencies" 
          className="w-full bg-soul-surface border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-soul-primary"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...Object.values(Category)].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${filter === cat ? 'bg-soul-primary text-soul-darker' : 'bg-soul-surface text-gray-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredTracks.map(track => (
          <div key={track.id} className="group cursor-pointer" onClick={() => onPlay(track)}>
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
              <img src={track.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={track.title} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                   <div className="ml-1 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent"></div>
                </div>
              </div>
            </div>
            <h4 className="text-white font-medium text-sm truncate">{track.title}</h4>
            <p className="text-gray-500 text-xs">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.ONBOARDING);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check local storage for onboarding (simulated)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('soulwave_onboarded');
    if (hasSeenOnboarding) {
      setView(View.HOME);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('soulwave_onboarded', 'true');
    setView(View.HOME);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const renderView = () => {
    switch(view) {
      case View.HOME: return <HomePage onPlay={playTrack} onMoodSelect={() => {}} />;
      case View.EXPLORE: return <ExplorePage onPlay={playTrack} />;
      case View.SESSIONS: return <div className="p-8 text-center text-gray-400 mt-20">Your library is empty.</div>;
      case View.FAVORITES: return <div className="p-8 flex flex-col items-center justify-center h-full mt-20"><Heart size={48} className="text-gray-600 mb-4"/><p className="text-gray-400">Your calm space is waiting.</p></div>;
      case View.PROFILE: return <div className="p-8 text-center text-gray-400 mt-20">Profile Settings</div>;
      default: return null;
    }
  };

  if (view === View.ONBOARDING) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-soul-dark text-white font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* Scrollable Content Area */}
      <div className="h-screen overflow-y-auto no-scrollbar pb-20">
         {renderView()}
      </div>

      {/* Persistent Player Overlay */}
      <Player 
        track={currentTrack} 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlay} 
        onClose={() => setCurrentTrack(null)} 
      />

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-soul-darker/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 flex justify-between items-center z-30">
        <button onClick={() => setView(View.HOME)} className={`flex flex-col items-center gap-1 ${view === View.HOME ? 'text-soul-primary' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => setView(View.EXPLORE)} className={`flex flex-col items-center gap-1 ${view === View.EXPLORE ? 'text-soul-primary' : 'text-gray-500'}`}>
          <Search size={24} />
          <span className="text-[10px] font-medium">Explore</span>
        </button>
        <button onClick={() => setView(View.SESSIONS)} className={`flex flex-col items-center gap-1 ${view === View.SESSIONS ? 'text-soul-primary' : 'text-gray-500'}`}>
          <Headphones size={24} />
          <span className="text-[10px] font-medium">Sessions</span>
        </button>
        <button onClick={() => setView(View.FAVORITES)} className={`flex flex-col items-center gap-1 ${view === View.FAVORITES ? 'text-soul-primary' : 'text-gray-500'}`}>
          <Heart size={24} />
          <span className="text-[10px] font-medium">Favorites</span>
        </button>
        <button onClick={() => setView(View.PROFILE)} className={`flex flex-col items-center gap-1 ${view === View.PROFILE ? 'text-soul-primary' : 'text-gray-500'}`}>
          <User size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default App;