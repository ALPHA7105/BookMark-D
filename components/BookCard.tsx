import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { generateBookCover } from '../services/geminiService';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const [coverImage, setCoverImage] = useState<string>(book.coverImage);
  const [isLoading, setIsLoading] = useState(false);

  // Generate AI cover if no coverImage exists
  useEffect(() => {
    if (!book.coverImage || book.coverImage.trim() === '') {
      const generateCover = async () => {
        setIsLoading(true);
        try {
          const aiGeneratedImage = await generateBookCover(book.title);
          if (aiGeneratedImage) {
            setCoverImage(aiGeneratedImage);
          }
        } catch (error) {
          console.error("Failed to generate cover:", error);
        } finally {
          setIsLoading(false);
        }
      };

      generateCover();
    } else {
      setCoverImage(book.coverImage);
    }
  }, [book]);

  return (
    <div
      onClick={() => onClick(book)}
      className="group relative flex-shrink-0 w-44 md:w-56 cursor-pointer transition-all duration-500 hover:scale-105"
    >
      {/* Hover Gradient Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-2xl flex flex-col justify-end p-4">
        <p className="text-sm font-bold leading-tight text-white">{book.title}</p>
        <p className="text-xs text-white/70">by {book.author}</p>
      </div>

      {/* Completed Badge Floating */}
      {book.earnedBadge && (
        <div
          className="absolute -top-3 -right-3 z-30 flex flex-col items-center animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {book.earnedBadge.icon}
          </div>
          <div className="mt-1 px-2 py-0.5 bg-white text-black text-[7px] md:text-[8px] font-black uppercase tracking-tighter rounded-full whitespace-nowrap">
            {book.earnedBadge.name}
          </div>
        </div>
      )}

      {/* Book Cover */}
      <div className="relative overflow-hidden rounded-2xl aspect-[2/3] shadow-2xl border-2 border-transparent group-hover:border-white/20">
        {isLoading ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xs">Generating cover...</span>
          </div>
        ) : (
          <>
            <img
              src={coverImage}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Glow if completed */}
            {book.earnedBadge && (
              <div className="absolute inset-0 bg-white/10 pointer-events-none mix-blend-overlay" />
            )}
          </>
        )}

        {/* Top Right Read Badge */}
        <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
          {book.earnedBadge ? 'RE-READ' : `${book.readCount} Reads`}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex gap-1 flex-wrap">
        {book.tags?.slice(0, 2).map(tag => (
          <span
            key={tag}
            className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/60"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BookCard;
