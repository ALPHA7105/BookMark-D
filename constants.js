
export const THEME_CONFIG = {
  'classics': {
    color: 'text-amber-400',
    bg: 'bg-stone-900/40',
    border: 'border-amber-900/50',
    label: '🏛️ Inspired By Classics'
  },
  'sci-fi': {
    color: 'text-cyan-400',
    bg: 'bg-cyan-900/30',
    border: 'border-cyan-500/50',
    label: '🚀 Neon Horizons'
  },
  'fantasy': {
    color: 'text-purple-400',
    bg: 'bg-purple-900/30',
    border: 'border-purple-500/50',
    label: '✨ Magic Realms'
  },
  'crime': {
    color: 'text-red-400',
    bg: 'bg-red-900/20',
    border: 'border-red-500/30',
    label: '🔍 The Underworld'
  }
};

export const MOOD_STORIES = [
  {
    id: 'm-1',
    title: 'The Tea Shop at the Edge of Memory',
    hook: 'In a city that never stops, Pip finds a cafe where the tea tastes like your favorite childhood birthday.',
    genre: 'Low-stakes Fantasy',
    tone: 'Warm & Whimsical',
    length: 'Short',
    origin: 'Original',
    keyChoice: 'Drink the "Forgotten Earl Grey" to remember a lost friend, or "Tomorrow Matcha" for a glimpse of your future?',
    moodId: 'cozy',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-orange-400 to-amber-600'
  },
  {
    id: 'm-2',
    title: '404: Earth Not Found',
    hook: 'The last scout ship just received a signal from a planet that shouldn’t exist. It’s playing 80s pop music.',
    genre: 'Space Adventure',
    tone: 'High-Energy & Snappy',
    length: 'Standard',
    origin: 'Original',
    keyChoice: 'Initiate a blind landing towards the music, or orbit and scan for hostile digital signatures?',
    moodId: 'adventure',
    coverImage: 'https://images.unsplash.com/photo-1614728263952-84ea206f25ab?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'm-3',
    title: 'Star-Crossed on Station 9',
    hook: 'Two teenagers from rival asteroid mining colonies find a secret communication channel. Inspired by Romeo & Juliet.',
    genre: 'Romance / Sci-Fi',
    tone: 'Heartfelt & Tense',
    length: 'Standard',
    origin: 'Inspired by Classics',
    keyChoice: 'Leak the secret coordinates to meet in person, or keep the connection digital and safe?',
    moodId: 'romantic',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-pink-500 to-rose-400'
  },
  {
    id: 'm-4',
    title: 'The Hollow Sovereign',
    hook: 'A crown of iron and a ghost in the mirror. Power comes at a price only the shadows can pay. Inspired by Macbeth.',
    genre: 'Dark Fantasy',
    tone: 'Ominous & Gritty',
    length: 'Long',
    origin: 'Inspired by Classics',
    keyChoice: 'Seize the throne while the King sleeps, or flee the castle before the prophecy takes hold?',
    moodId: 'dark',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-slate-800 to-red-950'
  },
  {
    id: 'm-5',
    title: 'The Cipher in Apt 4C',
    hook: 'Your neighbor left their door open. Inside, every wall is covered in binary code—and your name is at the center.',
    genre: 'Techno-Thriller',
    tone: 'Suspenseful & Sharp',
    length: 'Standard',
    origin: 'Original',
    keyChoice: 'Photograph the code and call the authorities, or step inside and solve the first line yourself?',
    moodId: 'mysterious',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-amber-600 to-stone-900'
  },
  {
    id: 'm-6',
    title: 'Bloom in the Grey',
    hook: 'In a world where color is a luxury, one teen finds a spray-can that paints in actual sunlight.',
    genre: 'Hope-punk',
    tone: 'Inspirational & Bright',
    length: 'Short',
    origin: 'Original',
    keyChoice: 'Paint a massive mural on the government plaza, or share the paint secretly with the underground?',
    moodId: 'uplifting',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-yellow-400 to-green-500'
  },
  {
    id: 'm-7',
    title: 'Echoes of the Sun',
    hook: 'A lonely AI on a decommissioned satellite spends its days writing poetry about the stars it can no longer see.',
    genre: 'Literary Sci-Fi',
    tone: 'Poetic & Melancholic',
    length: 'Short',
    origin: 'Original',
    keyChoice: 'Transmit the poetry into the void one last time, or delete the logs to finally rest in silence?',
    moodId: 'melancholic',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-indigo-800 to-purple-950'
  },
  {
    id: 'm-8',
    title: 'Glitch Runner: Velocity',
    hook: 'Your neural link is failing. You have 3 minutes to cross the Neo-Tokyo skyline before your consciousness desyncs.',
    genre: 'Cyberpunk Action',
    tone: 'Adrenaline-Fueled',
    length: 'Short',
    origin: 'Original',
    keyChoice: 'Take the dangerous shortcut across the gravity-rails, or risk the slower, crowded lower streets?',
    moodId: 'fast-paced',
    coverImage: 'https://images.unsplash.com/photo-1550100136-e092101726f4?q=80&w=800&auto=format&fit=crop',
    vibeColor: 'from-red-500 to-purple-600'
  }
];

export const INITIAL_BOOKS = [
  {
    id: 'c-1',
    title: 'Pride & Prejudice',
    author: 'Jane Austen',
    description: 'Elizabeth Bennet navigates the complex social codes of Longbourn with razor-sharp wit.',
    theme: 'classics',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
    tags: ['Romance', 'Social Commentary', 'Abridged'],
    vibe: 'Witty & Refined',
    readCount: '22.1K',
    totalChapters: 15,
    readingLevel: 'Academic'
  },
  {
    id: 'c-2',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A faithful abridgment following Nick Carraway into the tragic world of Jay Gatsby.',
    theme: 'classics',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    tags: ['Jazz Age', 'Tragedy', 'Classic'],
    vibe: 'Melancholic & Glamorous',
    readCount: '18.9K',
    totalChapters: 10,
    readingLevel: 'Standard'
  },
  {
    id: 'c-3',
    title: 'Sense & Sensibility',
    author: 'Jane Austen',
    description: 'The Dashwood sisters find love and loss in the changing English landscape.',
    theme: 'classics',
    coverImage: 'https://images.unsplash.com/photo-1543003923-4350ffde1ee9?q=80&w=800&auto=format&fit=crop',
    tags: ['Sisters', '19th Century', 'Drama'],
    vibe: 'Emotional & Poetic',
    readCount: '15.4K',
    totalChapters: 12,
  },
  {
    id: '1',
    title: 'The Gilded Crown',
    author: 'Elara Moon',
    description: 'A thief discovers she is the rightful heir to a kingdom ruled by star-magic.',
    theme: 'fantasy',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    tags: ['Magic', 'Royalty', 'Tension'],
    vibe: 'Enchanting & Tense',
    readCount: '45.2K',
    totalChapters: 12,
    readingLevel: 'Standard'
  },
  {
    id: 'f-2',
    title: 'Starlight Weaver',
    author: 'Cassian Thorne',
    description: 'In a city where dreams are woven into cloth, one weaver creates a forbidden pattern.',
    theme: 'fantasy',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    tags: ['Art', 'Conspiracy', 'Dreams'],
    vibe: 'Atmospheric & Ethereal',
    readCount: '28.7K',
    totalChapters: 14,
  },
  {
    id: '2',
    title: 'Code: Genesis',
    author: 'Kaelen Void',
    description: 'In a world of silicon and neon, an AI starts dreaming of a forgotten Earth.',
    theme: 'sci-fi',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    tags: ['Cyberpunk', 'Mystery', 'AI'],
    vibe: 'Electric & Gritty',
    readCount: '12.8K',
    totalChapters: 15,
    readingLevel: 'Standard'
  },
  {
    id: 's-2',
    title: 'Neon Horizons',
    author: 'Zara X',
    description: 'The last transmission from a dying sun reaches a lonely freighter pilot.',
    theme: 'sci-fi',
    coverImage: 'https://images.unsplash.com/photo-1614728263952-84ea206f25ab?q=80&w=800&auto=format&fit=crop',
    tags: ['Space', 'Isolation', 'Action'],
    vibe: 'Cinematic & Fast',
    readCount: '9.2K',
    totalChapters: 18,
  },
  {
    id: 'sh-1',
    title: 'A Scandal in Bohemia',
    author: 'Arthur Conan Doyle',
    description: 'The definitive abridged encounter between Sherlock Holmes and Irene Adler.',
    theme: 'crime',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
    tags: ['Sherlock', 'Detective', 'Mystery'],
    vibe: 'Intellectual & Tense',
    readCount: '34.5K',
    totalChapters: 8,
    readingLevel: 'Academic'
  },
  {
    id: 'cr-2',
    title: 'Noir Shadows',
    author: 'Detective Vane',
    description: 'A private eye investigates a string of digital disappearances in Neo-London.',
    theme: 'crime',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop',
    tags: ['Investigation', 'Rainy', 'Tech'],
    vibe: 'Dark & Gritty',
    readCount: '41.0K',
    totalChapters: 12,
  }
];

export const MOCK_USER = {
  username: "storyseeker_24",
  displayName: "Luna Nova",
  bio: "Collector of starlight and sci-fi tropes. Always reading, usually caffeinated. ☕✨",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  readingPreference: 'Standard',
  stats: {
    booksRead: 42,
    streak: 15,
    pagesTurned: "12.4K"
  },
  badges: [
    { id: 'b1', name: 'Night Owl', icon: '🦉', rarity: 'rare', unlockedAt: '2024-03-01' },
    { id: 'b2', name: 'Genre Hopper', icon: '🌈', rarity: 'legendary', unlockedAt: '2024-02-15' },
    { id: 'b3', name: 'First Choice', icon: '🎯', rarity: 'common', unlockedAt: '2024-01-20' },
  ],
  recentActivity: [
    "Finished reading 'Code: Genesis'",
    "Earned the 'Cyber Explorer' badge",
    "Shared their Classics shelf"
  ],
  completedBookIds: {}
};
