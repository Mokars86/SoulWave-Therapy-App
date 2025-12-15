import { Category, Track } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Deep Sleep Therapy',
    artist: 'SoulWave Originals',
    category: Category.SLEEP,
    duration: 372, // Updated to match sample audio approx duration
    imageUrl: 'https://picsum.photos/seed/sleep1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Morning Clarity',
    artist: 'Mindful Minds',
    category: Category.MEDITATION,
    duration: 420,
    imageUrl: 'https://picsum.photos/seed/meditate1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Delta Waves 432Hz',
    artist: 'Frequency Healer',
    category: Category.HEALING,
    duration: 300,
    imageUrl: 'https://picsum.photos/seed/heal1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Forest Rain',
    artist: 'Nature Sounds',
    category: Category.NATURE,
    duration: 300,
    imageUrl: 'https://picsum.photos/seed/nature1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Deep Focus Flow',
    artist: 'Study LoFi',
    category: Category.FOCUS,
    duration: 350,
    imageUrl: 'https://picsum.photos/seed/focus1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '6',
    title: 'Anxiety Release',
    artist: 'Dr. Calm',
    category: Category.HEALING,
    duration: 300,
    imageUrl: 'https://picsum.photos/seed/anxiety/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    id: '7',
    title: 'Surah Ar-Rahman',
    artist: 'Mishary Al Afasy',
    category: Category.QURAN,
    duration: 320,
    imageUrl: 'https://picsum.photos/seed/quran1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: '8',
    title: 'Morning Adhkar',
    artist: 'SoulWave Islamic',
    category: Category.QURAN,
    duration: 280,
    imageUrl: 'https://picsum.photos/seed/adhkar/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: '9',
    title: 'Ayatul Kursi (Loop)',
    artist: 'Recitation',
    category: Category.QURAN,
    duration: 300,
    imageUrl: 'https://picsum.photos/seed/ayat/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
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