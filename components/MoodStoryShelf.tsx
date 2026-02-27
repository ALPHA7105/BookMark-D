import React from 'react';
import Shelf from './Shelf';
import { MoodStory, Book } from '../types';

interface Props {
  stories: MoodStory[];
  onStorySelect: (story: MoodStory) => void;
  theme: 'fantasy' | 'sci-fi' | 'classics' | 'crime'; // optional, for styling
}

const MoodStoryShelf: React.FC<Props> = ({ stories, onStorySelect, theme }) => {
  // Map MoodStories to Book-like objects for Shelf rendering
  const mappedBooks: Book[] = stories.map(story => ({
    id: story.id,
    title: story.title,
    author: story.origin,
    description: story.hook,
    theme: theme || 'fantasy',
    coverImage: story.coverImage,
    tags: [story.genre, story.tone],
    vibe: story.tone,
    readCount: 'NEW',
    totalChapters: story.length === 'Short' ? 8 : 15,
    readingLevel: 'Standard',
  }));

  return <Shelf theme={theme || 'fantasy'} books={mappedBooks} onBookClick={(book) => {
    const matchedStory = stories.find(s => s.id === book.id);
    if (matchedStory) onStorySelect(matchedStory);
  }} />;
};

export default MoodStoryShelf;
