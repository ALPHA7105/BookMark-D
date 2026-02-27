
export type ShelfTheme = 'classics' | 'sci-fi' | 'fantasy' | 'crime';
export type ReadingLevel = 'Chill' | 'Standard' | 'Academic';
export type MoodType = 'all' | 'cozy' | 'adventure' | 'romantic' | 'dark' | 'mysterious' | 'uplifting' | 'melancholic' | 'fast-paced';

export interface UserPreferences {
  preferredGenre: ShelfTheme;
  pacing: 'Fast' | 'Slow';
  tone: 'Bright' | 'Dark';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  theme: ShelfTheme;
  coverImage: string;
  tags: string[];
  vibe: string;
  readCount: string;
  totalChapters: number;
  readingLevel?: ReadingLevel;
  earnedBadge?: UserBadge; // New property to show earned badge on the shelf
}

export interface MoodStory {
  id: string;
  title: string;
  hook: string;
  genre: string;
  tone: string;
  length: 'Short' | 'Standard' | 'Long';
  origin: 'Original' | 'Inspired by Classics';
  keyChoice: string;
  moodId: MoodType;
  coverImage: string;
  vibeColor: string;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  bookId?: string; // Reference to the book that unlocked it
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  readingPreference: ReadingLevel;
  preferences?: UserPreferences;
  stats: {
    booksRead: number;
    streak: number;
    pagesTurned: string;
  };
  badges: UserBadge[];
  recentActivity: string[];
  completedBookIds?: Record<string, string>; // bookId -> badgeId
}

export interface StoryChapter {
  content: string;
  choices: {
    text: string;
    impact: string;
  }[];
  isEnding?: boolean;
  unlockedBadge?: string;
}

export interface StoryResponse {
  summary: string;
  plotTwist: string;
  vibeRating: string;
}
