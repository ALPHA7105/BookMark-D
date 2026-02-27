
import React, { useState, useMemo } from 'react';

interface AvatarPickerProps {
  currentAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

const AVATAR_STYLES = [
  { id: 'avataaars', name: 'Human', icon: '👤' },
  { id: 'bottts', name: 'Robot', icon: '🤖' },
  { id: 'pixel-art', name: 'Pixel', icon: '👾' },
  { id: 'adventurer', name: 'Adventurer', icon: '🗺️' },
  { id: 'lorelei', name: 'Cute', icon: '✨' },
  { id: 'notionists', name: 'Minimal', icon: '🖋️' },
];

const AvatarPicker: React.FC<AvatarPickerProps> = ({ currentAvatar, onSelect }) => {
  const [activeStyle, setActiveStyle] = useState('avataaars');
  const [refreshKey, setRefreshKey] = useState(0);

  const options = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const seed = `${activeStyle}-${i}-${refreshKey}`;
      return `https://api.dicebear.com/7.x/${activeStyle}/svg?seed=${seed}`;
    });
  }, [activeStyle, refreshKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {AVATAR_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
              activeStyle === style.id
                ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20'
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
            }`}
          >
            <span>{style.icon}</span>
            <span>{style.name}</span>
          </button>
        ))}
        <button
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="ml-auto p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
          title="Shuffle Options"
        >
          🔄
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {options.map((url, i) => (
          <button
            key={i}
            onClick={() => onSelect(url)}
            className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
              currentAvatar === url
                ? 'border-pink-500 scale-105 shadow-xl shadow-pink-500/20'
                : 'border-white/5 hover:border-white/20'
            }`}
          >
            <img src={url} alt={`Option ${i}`} className="w-full h-full object-cover" />
            {currentAvatar === url && (
              <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                <div className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                  ✓
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarPicker;
