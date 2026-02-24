
import React from 'react';
import { MoodStory } from '../types';

interface MoodStoryCardProps {
  story: MoodStory;
  onSelect: (story: MoodStory) => void;
}

const MoodStoryCard: React.FC<MoodStoryCardProps> = ({ story, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(story)}
      className="group relative flex-shrink-0 w-80 md:w-96 h-[500px] rounded-[3rem] overflow-hidden border border-white/10 transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-2xl"
    >
      {/* Background Image */}
      <img 
        src={story.coverImage} 
        alt={story.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
      />
      
      {/* Dynamic Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/95 transition-colors group-hover:via-black/60`} />
      
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-tr ${story.vibeColor} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
        <div className="flex gap-2 mb-4">
          <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            {story.origin}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 text-white/70 bg-white/5`}>
            {story.length} Read
          </span>
        </div>

        <h3 className="text-3xl md:text-4xl font-black italic font-serif leading-tight mb-4 group-hover:translate-x-2 transition-transform">
          {story.title}
        </h3>
        
        <p className="text-lg text-white/70 font-light mb-8 italic">
          "{story.hook}"
        </p>

        {/* Choice Reveal */}
        <div className="space-y-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="h-[1px] w-full bg-white/10" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Your First Move:</p>
          <p className="text-sm font-bold text-white leading-relaxed italic">
            {story.keyChoice}
          </p>
          <button className={`w-full mt-4 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-white text-black hover:bg-cyan-400 active:scale-95`}>
            Begin Experience &rarr;
          </button>
        </div>

        <div className="absolute top-8 right-8">
           <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.vibeColor} flex items-center justify-center text-2xl shadow-lg border border-white/20 animate-pulse`}>
             {story.moodId === 'cozy' && '☁️'}
             {story.moodId === 'adventure' && '🔥'}
             {story.moodId === 'romantic' && '💘'}
             {story.moodId === 'dark' && '🖤'}
             {story.moodId === 'mysterious' && '📜'}
             {story.moodId === 'uplifting' && '✨'}
             {story.moodId === 'melancholic' && '🌙'}
             {story.moodId === 'fast-paced' && '🚀'}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MoodStoryCard;
