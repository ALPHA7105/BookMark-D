
import React, { useState } from 'react';
import { Book, ShelfTheme, ReadingLevel } from '../types';

interface CreateStoryViewProps {
  onCreate: (book: Book) => void;
  onCancel: () => void;
}

const CreateStoryView: React.FC<CreateStoryViewProps> = ({ onCreate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    vibe: '',
    theme: 'classics' as ShelfTheme,
    chapters: 12,
    readingLevel: 'Standard' as ReadingLevel
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook: Book = {
      id: `custom-${Date.now()}`,
      title: formData.title || "Untitled Masterpiece",
      author: "Architect 01",
      description: `A unique digital journey through the ${formData.theme} realm with a ${formData.vibe} atmosphere. Custom-crafted experience.`,
      theme: formData.theme,
      coverImage: `https://picsum.photos/seed/${formData.title || 'default'}/600/900`,
      tags: ['User Gen', formData.theme, 'Interactive'],
      vibe: formData.vibe || "Personalized",
      readCount: "NEW",
      totalChapters: formData.chapters,
      readingLevel: formData.readingLevel
    };
    onCreate(newBook);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-[fade-in-up_0.6s_ease-out]">
      <div className="bg-[#0f172a] rounded-[4rem] p-12 md:p-20 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/5 blur-[100px] rounded-full" />
        
        <div className="relative z-10">
          <header className="mb-12">
            <h2 className="text-5xl font-black mb-4 tracking-tighter italic font-serif">Forge a new <span className="text-pink-500 underline decoration-wavy underline-offset-8">Reality.</span></h2>
            <p className="text-white/40 font-sans font-bold uppercase tracking-[0.2em] text-[10px]">Define the parameters of your digital odyssey</p>
          </header>
          
          <form onSubmit={handleSubmit} className="space-y-10 font-sans">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Experience Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. The Glass Nebula"
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-2xl font-black focus:border-pink-500 outline-none transition-all placeholder:text-white/5"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Atmospheric Vibe</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rainy & Melancholic"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-lg focus:border-cyan-400 outline-none transition-all"
                  value={formData.vibe}
                  onChange={e => setFormData({...formData, vibe: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Narrative Realm</label>
                <select 
                  className="w-full bg-gray-900 border border-white/10 rounded-3xl p-4 appearance-none font-bold text-white placeholder-white focus:border-purple-500 outline-none cursor-pointer"
                  value={formData.theme}
                  onChange={e => setFormData({...formData, theme: e.target.value as ShelfTheme})}
                >
                  <option value="classics">Regal Classics</option>
                  <option value="sci-fi">Cybernetic Sci-Fi</option>
                  <option value="fantasy">Magic Realms (Fantasy)</option>
                  <option value="crime">Noir Crime</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Structural Complexity</label>
                <div className="flex gap-2">
                  {(['Chill', 'Standard', 'Academic'] as ReadingLevel[]).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setFormData({...formData, readingLevel: l})}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.readingLevel === l ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Temporal Scale (Chapters)</label>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-2 px-6">
                  <input 
                    type="range" 
                    min="5" 
                    max="20"
                    step="1"
                    className="flex-1 accent-pink-500"
                    value={formData.chapters}
                    onChange={e => setFormData({...formData, chapters: parseInt(e.target.value)})}
                  />
                  <span className="text-xl font-black text-pink-500 w-8">{formData.chapters}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <button 
                type="submit"
                className="flex-[2] bg-white text-black py-8 rounded-[2.5rem] font-black text-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5 uppercase tracking-widest"
              >
                Initialize Experience
              </button>
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-sm"
              >
                Abort
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryView;
