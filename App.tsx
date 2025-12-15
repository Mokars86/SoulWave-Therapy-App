import React, { useState, useEffect } from 'react';
import { Home, Search, Headphones, Heart, User as UserIcon, LogOut, Settings, Moon, Sun, Bell, Shield, ChevronRight, Mail, Lock, Eye, EyeOff, Loader, Play } from 'lucide-react';
import { View, Track, Category, User } from './types';
import { MOCK_TRACKS, ONBOARDING_STEPS } from './constants';
import { Player } from './components/Player';
import { Button } from './components/Button';
import { getMoodRecommendation, AIRecord } from './services/geminiService';

// --- Sub-components (Pages) ---

const SplashScreen: React.FC = () => {
  return (
    <div className="h-screen w-full bg-soul-dark flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-soul-primary/10 via-transparent to-soul-secondary/10 animate-pulse"></div>
      <div className="z-10 flex flex-col items-center">
        <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-soul-primary to-emerald-400 flex items-center justify-center shadow-2xl shadow-soul-primary/30 animate-float rotate-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-white" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6c.5 0 1 .4 1 1v8.5a3.5 3.5 0 11-7 0V7a1 1 0 011-1 1 1 0 011-1 1 1 0 011 1v8.5a1.5 1.5 0 003 0V7a1 1 0 011-1z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a1 1 0 011 1v4.5a1.5 1.5 0 003 0V11a1 1 0 011-1 1 1 0 011-1 1 1 0 011 1v4.5a3.5 3.5 0 11-7 0V11a1 1 0 011-1z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-soul-text tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">SoulWave</h1>
        <p className="text-soul-primary font-medium text-sm mt-2 tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">Find Your Rhythm</p>
      </div>
    </div>
  );
};

const AuthPage: React.FC<{ onAuthSuccess: (user: User) => void }> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: 'u1',
        name: isLogin ? 'Alex Doe' : name,
        email: email,
        avatar: 'https://picsum.photos/seed/user1/200/200',
        stats: {
          streak: 5,
          totalMinutes: 1240,
          sessionsCompleted: 42
        }
      };
      
      localStorage.setItem('soulwave_user', JSON.stringify(mockUser));
      setIsLoading(false);
      onAuthSuccess(mockUser);
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-soul-dark flex flex-col justify-center px-8 relative overflow-hidden transition-colors duration-500">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-soul-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="z-10 mb-10">
        <h1 className="text-4xl font-bold text-soul-text mb-3 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="text-soul-muted text-lg">{isLogin ? 'Sign in to continue your journey' : 'Start your wellness journey today'}</p>
      </div>

      <form onSubmit={handleSubmit} className="z-10 space-y-5">
        {!isLogin && (
           <div className="relative group">
             <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-soul-muted group-focus-within:text-soul-primary transition-colors" size={20} />
             <input 
               type="text" 
               placeholder="Full Name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full bg-soul-surface border border-transparent focus:border-soul-primary rounded-xl py-4 pl-12 pr-4 text-soul-text placeholder-soul-muted/70 focus:outline-none transition-all shadow-sm"
               required={!isLogin}
             />
           </div>
        )}

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-soul-muted group-focus-within:text-soul-primary transition-colors" size={20} />
          <input 
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-soul-surface border border-transparent focus:border-soul-primary rounded-xl py-4 pl-12 pr-4 text-soul-text placeholder-soul-muted/70 focus:outline-none transition-all shadow-sm"
            required
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-soul-muted group-focus-within:text-soul-primary transition-colors" size={20} />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-soul-surface border border-transparent focus:border-soul-primary rounded-xl py-4 pl-12 pr-12 text-soul-text placeholder-soul-muted/70 focus:outline-none transition-all shadow-sm"
            required
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-soul-muted hover:text-soul-text transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {isLogin && (
          <div className="flex justify-end">
            <button type="button" className="text-sm font-medium text-soul-primary hover:text-emerald-500 transition-colors">Forgot Password?</button>
          </div>
        )}

        <Button type="submit" fullWidth disabled={isLoading} className="mt-4">
          {isLoading ? <Loader className="animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
        </Button>
      </form>

      <div className="mt-10 text-center z-10">
        <p className="text-soul-muted text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-soul-text font-bold hover:text-soul-primary transition-colors ml-1"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

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
    <div className="h-screen w-full relative bg-black flex flex-col text-white">
      <img src={content.image} alt="Onboarding" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700 ease-in-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      
      <div className="flex-1 z-10 flex flex-col justify-end p-8 pb-12">
        <div className="mb-6 space-y-4 animate-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl font-bold leading-tight">{content.title}</h1>
            <p className="text-gray-300 text-lg">{content.description}</p>
        </div>
        
        <div className="flex gap-2 mb-8">
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-soul-primary' : 'w-2 bg-gray-700'}`} />
          ))}
        </div>
        <Button onClick={handleNext} fullWidth>
          {step === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

const HomePage: React.FC<{ user: User | null, onPlay: (t: Track) => void }> = ({ user, onPlay }) => {
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
    <div className="pb-24 pt-6 px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-light text-soul-muted">{greeting},</h1>
          <h2 className="text-xl font-bold text-soul-text">{user?.name.split(' ')[0] || 'Guest'}</h2>
        </div>
        <div className="w-11 h-11 rounded-full bg-soul-surface border-2 border-soul-surface overflow-hidden relative shadow-sm">
            <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* AI Mood Check-in */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            ✨ AI Mood Matcher
            </h3>
            <p className="text-sm text-indigo-100 mb-5 leading-relaxed">How are you feeling right now? Let us curate the perfect session for you.</p>
            
            <div className="flex gap-2">
            <input 
                type="text" 
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                placeholder="e.g., Anxious about work..." 
                className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-200 focus:outline-none focus:bg-white/30 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleMoodSubmit()}
            />
            <button 
                onClick={handleMoodSubmit}
                disabled={isMoodLoading}
                className="bg-white text-indigo-700 rounded-xl px-5 py-2 text-sm font-bold shadow-lg hover:bg-indigo-50 transition-colors disabled:opacity-70"
            >
                {isMoodLoading ? <Loader size={16} className="animate-spin" /> : 'Go'}
            </button>
            </div>

            {moodResults.length > 0 && (
            <div className="mt-5 space-y-2 animate-in fade-in slide-in-from-top-2">
                {moodResults.map((rec, idx) => (
                <div key={idx} className="bg-black/20 backdrop-blur-sm p-3 rounded-xl flex items-start justify-between border border-white/10 hover:bg-black/30 transition-colors cursor-pointer" onClick={() => {
                   // Find track mock logic would go here
                }}>
                    <div>
                        <p className="font-semibold text-white text-sm">{rec.title}</p>
                        <p className="text-xs text-indigo-200 opacity-80">{rec.reason}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-1 rounded text-white">{rec.category}</span>
                </div>
                ))}
            </div>
            )}
        </div>
      </div>

      {/* Hero */}
      <div className="relative w-full h-72 rounded-3xl overflow-hidden mb-8 group cursor-pointer shadow-2xl shadow-soul-text/5" onClick={() => onPlay(MOCK_TRACKS[0])}>
        <img src={MOCK_TRACKS[0].imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Featured" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
          <span className="bg-soul-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full w-fit mb-3">Featured Session</span>
          <h3 className="text-3xl font-bold text-white mb-2">{MOCK_TRACKS[0].title}</h3>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
             <Play size={14} fill="currentColor" />
             <span>{MOCK_TRACKS[0].duration / 60} mins</span>
             <span>•</span>
             <span>{MOCK_TRACKS[0].category}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2 -mx-6 px-6">
        {Object.values(Category).map((cat) => (
          <button key={cat} className="whitespace-nowrap px-6 py-3 rounded-2xl bg-soul-card border border-soul-surface text-soul-muted text-sm font-semibold shadow-sm hover:bg-soul-primary hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-soul-primary/30 transition-all duration-300">
            {cat === Category.SLEEP ? '💤 ' : cat === Category.MEDITATION ? '🧘 ' : cat === Category.FOCUS ? '🧠 ' : cat === Category.HEALING ? '💓 ' : cat === Category.QURAN ? '📖 ' : '🌿 '} 
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended */}
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-bold text-soul-text">Recommended for You</h3>
         <button className="text-xs text-soul-primary font-bold uppercase tracking-wider">See All</button>
      </div>
      
      <div className="space-y-4">
        {MOCK_TRACKS.slice(1, 4).map((track) => (
          <div key={track.id} className="flex items-center gap-4 p-3 pr-4 rounded-2xl bg-soul-card hover:bg-soul-surface/50 border border-transparent hover:border-soul-surface transition-all cursor-pointer group" onClick={() => onPlay(track)}>
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md">
                <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/30 backdrop-blur-sm p-1 rounded-full">
                        <Play size={12} fill="white" className="text-white ml-0.5" />
                    </div>
                </div>
            </div>
            <div className="flex-1">
              <h4 className="text-soul-text font-bold mb-1 group-hover:text-soul-primary transition-colors">{track.title}</h4>
              <p className="text-soul-muted text-xs font-medium">{Math.floor(track.duration / 60)} mins • {track.category}</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-soul-surface flex items-center justify-center text-soul-text hover:bg-soul-primary hover:text-white transition-colors shadow-sm">
              <Play size={16} fill="currentColor" className="ml-0.5"/>
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
      <h2 className="text-3xl font-bold text-soul-text mb-6 tracking-tight">Explore</h2>
      
      <div className="relative mb-8 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-soul-muted group-focus-within:text-soul-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search sounds, moods, frequencies" 
          className="w-full bg-soul-surface border border-transparent group-focus-within:border-soul-primary rounded-2xl py-4 pl-12 pr-4 text-soul-text placeholder-soul-muted focus:outline-none shadow-sm transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...Object.values(Category)].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${filter === cat ? 'bg-soul-text text-soul-darker shadow-lg' : 'bg-soul-card border border-soul-surface text-soul-muted hover:text-soul-text hover:border-soul-text/30'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredTracks.map(track => (
          <div key={track.id} className="group cursor-pointer" onClick={() => onPlay(track)}>
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-sm">
              <img src={track.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={track.title} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                   <Play size={20} fill="white" className="text-white ml-1" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-medium">
                {Math.floor(track.duration / 60)} min
              </div>
            </div>
            <h4 className="text-soul-text font-bold text-sm truncate group-hover:text-soul-primary transition-colors">{track.title}</h4>
            <p className="text-soul-muted text-xs font-medium">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage: React.FC<{ user: User | null, onLogout: () => void, isDarkMode: boolean, onToggleTheme: () => void }> = ({ user, onLogout, isDarkMode, onToggleTheme }) => {
  if (!user) return null;

  const SettingItem: React.FC<{ icon: React.ReactNode, label: string, trailing?: React.ReactNode, onClick?: () => void }> = ({ icon, label, trailing, onClick }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-soul-card rounded-2xl hover:bg-soul-surface/50 transition-colors cursor-pointer border border-transparent hover:border-soul-surface/50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-soul-surface text-soul-primary">{icon}</div>
        <span className="text-soul-text font-semibold">{label}</span>
      </div>
      {trailing || <ChevronRight size={18} className="text-soul-muted" />}
    </div>
  );

  return (
    <div className="pb-24">
      {/* Profile Header */}
      <div className="relative mb-20">
        <div className="h-48 bg-gradient-to-br from-soul-primary to-emerald-600 rounded-b-[3rem] shadow-lg shadow-soul-primary/20"></div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-4 border-soul-dark bg-soul-surface overflow-hidden shadow-2xl">
            <img src={user.avatar || "https://ui-avatars.com/api/?name=User&background=random"} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="mt-3 text-center">
            <h2 className="text-2xl font-bold text-soul-text">{user.name}</h2>
            <p className="text-soul-muted text-sm font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 mt-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-soul-card p-4 rounded-2xl flex flex-col items-center text-center border border-soul-surface shadow-sm">
            <span className="text-2xl font-bold text-soul-primary mb-1">{user.stats?.streak || 0}</span>
            <span className="text-[10px] text-soul-muted uppercase tracking-widest font-bold">Streak</span>
          </div>
          <div className="bg-soul-card p-4 rounded-2xl flex flex-col items-center text-center border border-soul-surface shadow-sm">
            <span className="text-2xl font-bold text-soul-primary mb-1">{Math.floor((user.stats?.totalMinutes || 0) / 60)}h</span>
            <span className="text-[10px] text-soul-muted uppercase tracking-widest font-bold">Hours</span>
          </div>
          <div className="bg-soul-card p-4 rounded-2xl flex flex-col items-center text-center border border-soul-surface shadow-sm">
            <span className="text-2xl font-bold text-soul-primary mb-1">{user.stats?.sessionsCompleted || 0}</span>
            <span className="text-[10px] text-soul-muted uppercase tracking-widest font-bold">Sessions</span>
          </div>
        </div>

        {/* Settings Group 1 */}
        <div className="space-y-3">
          <h3 className="text-xs text-soul-muted font-bold uppercase tracking-widest ml-4 mb-2">Preferences</h3>
          <SettingItem 
            onClick={onToggleTheme}
            icon={isDarkMode ? <Moon size={20} /> : <Sun size={20} />} 
            label={isDarkMode ? "Dark Mode" : "Light Mode"}
            trailing={
              <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-soul-primary' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            } 
          />
          <SettingItem icon={<Bell size={20} />} label="Notifications" />
          <SettingItem icon={<Shield size={20} />} label="Privacy & Security" />
        </div>

        {/* Settings Group 2 */}
        <div className="space-y-3">
          <h3 className="text-xs text-soul-muted font-bold uppercase tracking-widest ml-4 mb-2">Account</h3>
          <SettingItem icon={<Settings size={20} />} label="Account Settings" />
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 bg-red-500/5 rounded-2xl hover:bg-red-500/10 transition-colors cursor-pointer group border border-transparent hover:border-red-500/20"
          >
             <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-500"><LogOut size={20} /></div>
                <span className="text-red-500 font-semibold group-hover:text-red-600">Log Out</span>
             </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.SPLASH);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initial Theme Setup
    const savedTheme = localStorage.getItem('soulwave_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const initApp = () => {
      // Minimum splash screen duration of 2 seconds
      setTimeout(() => {
        const savedUser = localStorage.getItem('soulwave_user');
        
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setView(View.HOME);
        } else {
          // If no user, go to Auth
          setView(View.AUTH);
        }
      }, 2500);
    };

    initApp();
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('soulwave_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('soulwave_theme', 'light');
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    const hasSeenOnboarding = localStorage.getItem('soulwave_onboarded');
    if (hasSeenOnboarding) {
        setView(View.HOME);
    } else {
        setView(View.ONBOARDING);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('soulwave_user');
    setCurrentUser(null);
    setView(View.AUTH);
  };

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

  const handleTrackEnd = () => {
    setIsPlaying(false);
  };

  const renderView = () => {
    switch(view) {
      case View.SPLASH: return <SplashScreen />;
      case View.AUTH: return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case View.ONBOARDING: return <Onboarding onComplete={completeOnboarding} />;
      case View.HOME: return <HomePage user={currentUser} onPlay={playTrack} />;
      case View.EXPLORE: return <ExplorePage onPlay={playTrack} />;
      case View.SESSIONS: return <div className="p-8 text-center text-soul-muted mt-20">Your library is empty.</div>;
      case View.FAVORITES: return <div className="p-8 flex flex-col items-center justify-center h-full mt-20"><Heart size={48} className="text-soul-muted mb-4"/><p className="text-soul-muted">Your calm space is waiting.</p></div>;
      case View.PROFILE: return <ProfilePage user={currentUser} onLogout={handleLogout} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
      default: return null;
    }
  };

  // Views that don't need navigation bar
  const fullScreenViews = [View.SPLASH, View.AUTH, View.ONBOARDING];

  return (
    <div className="min-h-screen bg-soul-dark text-soul-text font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden transition-colors duration-500">
      
      {/* Scrollable Content Area */}
      <div className={`h-screen overflow-y-auto no-scrollbar ${!fullScreenViews.includes(view) ? 'pb-24' : ''}`}>
         {renderView()}
      </div>

      {/* Persistent Player Overlay - Only show if authenticated and not in fullscreen views */}
      {!fullScreenViews.includes(view) && (
        <Player 
          track={currentTrack} 
          isPlaying={isPlaying} 
          onTogglePlay={togglePlay} 
          onClose={() => setCurrentTrack(null)} 
          onTrackEnd={handleTrackEnd}
        />
      )}

      {/* Bottom Navigation */}
      {!fullScreenViews.includes(view) && (
        <div className="absolute bottom-0 left-0 right-0 bg-soul-darker/80 backdrop-blur-xl border-t border-soul-text/5 px-6 py-4 flex justify-between items-center z-30 transition-colors duration-300">
          <button onClick={() => setView(View.HOME)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.HOME ? 'text-soul-primary' : 'text-soul-muted hover:text-soul-text'}`}>
            <Home size={24} strokeWidth={view === View.HOME ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => setView(View.EXPLORE)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.EXPLORE ? 'text-soul-primary' : 'text-soul-muted hover:text-soul-text'}`}>
            <Search size={24} strokeWidth={view === View.EXPLORE ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Explore</span>
          </button>
          <button onClick={() => setView(View.SESSIONS)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.SESSIONS ? 'text-soul-primary' : 'text-soul-muted hover:text-soul-text'}`}>
            <Headphones size={24} strokeWidth={view === View.SESSIONS ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Sessions</span>
          </button>
          <button onClick={() => setView(View.FAVORITES)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.FAVORITES ? 'text-soul-primary' : 'text-soul-muted hover:text-soul-text'}`}>
            <Heart size={24} strokeWidth={view === View.FAVORITES ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Favorites</span>
          </button>
          <button onClick={() => setView(View.PROFILE)} className={`flex flex-col items-center gap-1 transition-colors ${view === View.PROFILE ? 'text-soul-primary' : 'text-soul-muted hover:text-soul-text'}`}>
            <UserIcon size={24} strokeWidth={view === View.PROFILE ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;