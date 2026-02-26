
import React from 'react';
import { MoodType } from '../types';

interface Mood {
  id: MoodType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const MOODS: Mood[] = [
  { id: 'all', label: 'All Vibes', icon: '🌈', description: 'Explore everything', color: 'from-slate-500 to-slate-700' },
  { id: 'cozy', label: 'Cozy', icon: '☁️', description: 'Warm & Whimsical', color: 'from-orange-400 to-amber-500' },
  { id: 'adventure', label: 'Adventurous', icon: '🔥', description: 'Action & Discovery', color: 'from-red-500 to-orange-600' },
  { id: 'romantic', label: 'Romantic', icon: '💘', description: 'Heartfelt & Tense', color: 'from-pink-400 to-rose-500' },
  { id: 'dark', label: 'Dark', icon: '🖤', description: 'Ominous & Gritty', color: 'from-slate-700 to-black' },
  { id: 'mysterious', label: 'Mysterious', icon: '📜', description: 'Secrets & Suspense', color: 'from-amber-600 to-stone-800' },
  { id: 'uplifting', label: 'Uplifting', icon: '✨', description: 'Hopeful & Bright', color: 'from-yellow-400 to-green-500' },
  { id: 'melancholic', label: 'Melancholic', icon: '🌙', description: 'Poetic & Deep', color: 'from-indigo-600 to-purple-800' },
  { id: 'fast-paced', label: 'Fast-Paced', icon: '🚀', description: 'Adrenaline Rush', color: 'from-cyan-400 to-blue-600' },
];

interface MoodSelectorProps {
  activeMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ activeMood, onMoodChange }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 italic">Stories for your mood</h2>
        <div className="h-[1px] flex-1 bg-white/5 ml-6" />
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodChange(mood.id)}
            className={`flex-shrink-0 group relative p-1 rounded-[2rem] transition-all duration-500 ${
              activeMood === mood.id ? 'scale-105' : 'hover:scale-102'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} rounded-[2rem] opacity-0 group-hover:opacity-20 transition-opacity ${activeMood === mood.id ? 'opacity-30' : ''}`} />
            
            <div className={`relative flex items-center gap-4 px-6 py-4 rounded-[1.9rem] bg-[#0f172a] border transition-all duration-500 ${
              activeMood === mood.id ? 'border-white/40 shadow-2xl shadow-white/5' : 'border-white/5 group-hover:border-white/20'
            }`}>
              <span className={`text-2xl transition-transform duration-500 ${activeMood === mood.id ? 'scale-125' : 'group-hover:scale-110'}`}>
                {mood.icon}
              </span>
              <div className="text-left">
                <p className={`text-sm font-black transition-colors ${activeMood === mood.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                  {mood.label}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold leading-none mt-1">
                  {mood.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
