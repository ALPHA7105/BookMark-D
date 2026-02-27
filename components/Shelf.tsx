
import React from 'react';
import { Book, ShelfTheme } from '../types';
import { THEME_CONFIG } from '../constants';
import BookCard from './BookCard';

interface ShelfProps {
  theme: ShelfTheme;
  books: Book[];
  onBookClick: (book: Book) => void;
}

const Shelf: React.FC<ShelfProps> = ({ theme, books, onBookClick }) => {
  const config = THEME_CONFIG[theme];

  return (
    <div className={`mb-12 p-6 rounded-3xl ${config.bg} border ${config.border} backdrop-blur-sm relative overflow-hidden`}>
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-white" />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-black ${config.color} tracking-tight`}>
          {config.label}
        </h3>
        <button className="text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">
          View All &rarr;
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={onBookClick} />
        ))}
        {books.length === 0 && (
          <div className="flex items-center justify-center w-full py-12 text-white/20 italic">
            No books in this archive yet...
          </div>
        )}
      </div>
    </div>
  );
};

export default Shelf;
