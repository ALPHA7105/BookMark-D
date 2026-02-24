
import React, { useEffect, useState } from 'react';
import { Book, StoryResponse, ReadingLevel } from '../types';
import { generateStoryPreview } from '../services/geminiService';
import Badge from './Badge';

interface PreviewModalProps {
  book: Book;
  onClose: () => void;
  onRead?: (level: ReadingLevel) => void;
}

const ProgressBar = ({ colorClass = "bg-cyan-400" }: { colorClass?: string }) => (
  <div className="w-full h-1 bg-white/5 overflow-hidden rounded-full">
    <div className={`h-full ${colorClass} animate-shimmer w-full origin-left`} />
  </div>
);

const PreviewModal: React.FC<PreviewModalProps> = ({ book, onClose, onRead }) => {
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState<StoryResponse | null>(null);
  const [level, setLevel] = useState<ReadingLevel>(book.readingLevel || 'Standard');

  useEffect(() => {
    async function fetchPreview() {
      setLoading(true);
      const data = await generateStoryPreview(book.title, book.author, book.vibe);
      setAiData(data);
      setLoading(false);
    }
    fetchPreview();
  }, [book]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-[#0f172a] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/5 animate-[zoom-in_0.4s_ease-out]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all border border-white/10"
        >
          ✕
        </button>

        {/* Cover Section */}
        <div className="w-full md:w-5/12 relative">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <Badge label="Experience Mode" icon="⚡" />
            <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight tracking-tighter">{book.title}</h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-2">Authored by {book.author}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-7/12 p-8 md:p-16 overflow-y-auto max-h-[80vh] md:max-h-[90vh] custom-scrollbar">
          <div className="flex gap-3 mb-8 flex-wrap">
            {book.tags.map(t => <span key={t} className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-white/50">#{t}</span>)}
          </div>

          <div className="space-y-12">
            <section>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-pink-500 mb-4">The Premise</h4>
              <p className="text-xl text-slate-300 leading-relaxed font-light">{book.description}</p>
            </section>

            <section className="bg-white/5 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl" />
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-400 mb-6 flex items-center">
                <span className="mr-3">✨</span> Digital Oracle Sync
              </h4>
              {loading ? (
                <div className="space-y-6">
                  <ProgressBar colorClass="bg-cyan-400" />
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] animate-pulse">Scanning narrative ley-lines...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] uppercase font-black text-white/30 mb-2">Narrative Core:</p>
                    <p className="text-lg text-white/90 font-medium leading-relaxed">{aiData?.summary}</p>
                  </div>
                  <div className="p-5 bg-pink-500/5 border border-pink-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2">Anomaly Detected (Plot Twist)</p>
                    <p className="text-white/80 text-base font-bold italic">{aiData?.plotTwist}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                     <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Vibe Assessment</span>
                     <span className="text-lg font-black text-cyan-400 italic">{aiData?.vibeRating}</span>
                  </div>
                </div>
              )}
            </section>

            <section>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-purple-400 mb-6">Select Cognitive Depth</h4>
              <div className="grid grid-cols-3 gap-3">
                {(['Chill', 'Standard', 'Academic'] as ReadingLevel[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${level === l ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </section>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => onRead?.(level)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-95 py-6 rounded-3xl font-black text-xl transition-all shadow-2xl shadow-pink-500/20 uppercase tracking-[0.1em]"
              >
                Launch Experience
              </button>
              <button className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center hover:bg-white/10 transition-colors text-2xl">
                💖
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
