export enum View {
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
  NATURE = 'Nature'
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
