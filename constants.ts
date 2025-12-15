import { Category, Track } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Deep Sleep Therapy',
    artist: 'SoulWave Originals',
    category: Category.SLEEP,
    duration: 1800,
    imageUrl: 'https://picsum.photos/seed/sleep1/400/400',
  },
  {
    id: '2',
    title: 'Morning Clarity',
    artist: 'Mindful Minds',
    category: Category.MEDITATION,
    duration: 600,
    imageUrl: 'https://picsum.photos/seed/meditate1/400/400',
  },
  {
    id: '3',
    title: 'Delta Waves 432Hz',
    artist: 'Frequency Healer',
    category: Category.HEALING,
    duration: 3600,
    imageUrl: 'https://picsum.photos/seed/heal1/400/400',
  },
  {
    id: '4',
    title: 'Forest Rain',
    artist: 'Nature Sounds',
    category: Category.NATURE,
    duration: 1200,
    imageUrl: 'https://picsum.photos/seed/nature1/400/400',
  },
  {
    id: '5',
    title: 'Deep Focus Flow',
    artist: 'Study LoFi',
    category: Category.FOCUS,
    duration: 2400,
    imageUrl: 'https://picsum.photos/seed/focus1/400/400',
  },
  {
    id: '6',
    title: 'Anxiety Release',
    artist: 'Dr. Calm',
    category: Category.HEALING,
    duration: 900,
    imageUrl: 'https://picsum.photos/seed/anxiety/400/400',
  }
];

export const ONBOARDING_STEPS = [
  {
    title: "Relax your mind",
    description: "Escape the noise of the world and find your inner sanctuary.",
    image: "https://picsum.photos/seed/relax/600/800"
  },
  {
    title: "Heal through sound",
    description: "Experience the power of 432Hz and 528Hz healing frequencies.",
    image: "https://picsum.photos/seed/heal/600/800"
  },
  {
    title: "Sleep deeper",
    description: "Drift off effortlessly with our curated sleep therapy sessions.",
    image: "https://picsum.photos/seed/sleep/600/800"
  }
];