export enum View {
  SPLASH = 'SPLASH',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  SESSIONS = 'SESSIONS',
  FAVORITES = 'FAVORITES',
  PROFILE = 'PROFILE'
}

export enum Category {
  SLEEP = 'Sleep',
  MEDITATION = 'Meditation',
  FOCUS = 'Focus',
  HEALING = 'Healing',
  NATURE = 'Nature',
  QURAN = 'Quran'
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  category: Category;
  duration: number; // in seconds
  imageUrl: string;
  audioUrl?: string; // Placeholder for real app
  isPremium?: boolean;
}

export interface UserStats {
  streak: number;
  totalMinutes: number;
  sessionsCompleted: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  stats?: UserStats;
}
