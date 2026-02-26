
import React, { useState, useEffect, useRef } from 'react';
import { Book, StoryChapter, ReadingLevel, ShelfTheme, UserBadge } from '../types';
import { generateInteractiveChapter, generateChapterAudio, getWordDefinition } from '../services/geminiService';

interface ReadingViewProps {
  book: Book;
  onExit: () => void;
  onFinish: (book: Book, badge: UserBadge) => void;
  readingLevel: ReadingLevel;
}

// Helper functions for raw PCM decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const THEME_REWARDS: Record<ShelfTheme, { icon: string; label: string; color: string; glow: string }> = {
  classics: { icon: '🏛️', label: 'Classic Explorer', color: 'text-amber-400', glow: 'shadow-amber-500/50' },
  'sci-fi': { icon: '🚀', label: 'Void Traveler', color: 'text-cyan-400', glow: 'shadow-cyan-500/50' },
  fantasy: { icon: '✨', label: 'Star Weaver', color: 'text-purple-400', glow: 'shadow-purple-500/50' },
  crime: { icon: '🕵️', label: 'Noir Shadow', color: 'text-red-500', glow: 'shadow-red-500/50' },
};

type TextSize = 'sm' | 'md' | 'lg' | 'xl';

const ProgressBar = ({ colorClass = "bg-pink-500" }: { colorClass?: string }) => (
  <div className="w-full h-1 bg-white/5 overflow-hidden rounded-full">
    <div className={`h-full ${colorClass} animate-shimmer w-full origin-left`} />
  </div>
);

const ReadingView: React.FC<ReadingViewProps> = ({ book, onExit, onFinish, readingLevel }) => {
  const [chapter, setChapter] = useState<StoryChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<UserBadge | null>(null);
  
  // Customization state
  const [textSize, setTextSize] = useState<TextSize>('md');
  const [showSettings, setShowSettings] = useState(false);
  
  // Audio state
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Definition state
  const [activeWord, setActiveWord] = useState<{ word: string; definition: string; example: string; x: number; y: number } | null>(null);
  const [isFetchingDefinition, setIsFetchingDefinition] = useState(false);

  useEffect(() => {
    loadChapter();
    return () => stopAudio(); // Cleanup audio on unmount
  }, [book]);

  const loadChapter = async (choice?: string) => {
    stopAudio();
    setActiveWord(null);
    setLoading(true);
    const currentChapNum = history.length + 1;
    const isLast = currentChapNum >= book.totalChapters;
    
    const context = history.join(" ");
    const nextChapter = await generateInteractiveChapter(book.title, context, isLast, readingLevel, choice);
    
    setChapter(nextChapter);
    setHistory(prev => [...prev, nextChapter.content]);
    
    if (nextChapter.isEnding || currentChapNum >= book.totalChapters) {
      setIsFinished(true);
      
      const themeReward = THEME_REWARDS[book.theme];
      const badge: UserBadge = {
        id: `badge-${Date.now()}`,
        name: nextChapter.unlockedBadge || themeReward.label,
        icon: themeReward.icon,
        rarity: Math.random() > 0.8 ? 'epic' : 'rare',
        unlockedAt: new Date().toISOString().split('T')[0],
        bookId: book.id
      };
      setEarnedBadge(badge);
    }
    
    setLoading(false);
  };

  const handleWordClick = async (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    const cleanWord = word.replace(/[.,!?;:()"]/g, "").trim();
    if (!cleanWord || cleanWord.length < 2 || isFetchingDefinition) return;

    setIsFetchingDefinition(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    
    // Optimistically show a loading state on the tooltip
    setActiveWord({ word: cleanWord, definition: "...", example: "", x: rect.left, y: rect.top });

    const result = await getWordDefinition(cleanWord, chapter?.content || "", readingLevel);
    
    if (result) {
      setActiveWord({
        word: cleanWord,
        definition: result.definition,
        example: result.example,
        x: rect.left,
        y: rect.top
      });
    } else {
      setActiveWord(null);
    }
    setIsFetchingDefinition(false);
  };

  const renderContentWithClickableWords = (content: string) => {
    return content.split(/\s+/).map((word, idx) => (
      <span 
        key={idx} 
        onClick={(e) => handleWordClick(e, word)}
        className="cursor-help hover:text-pink-500 hover:bg-pink-500/5 transition-colors rounded px-0.5 inline-block"
      >
        {word}{' '}
      </span>
    ));
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
    setIsAudioLoading(false);
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (!chapter?.content) return;

    setIsAudioLoading(true);
    const base64Audio = await generateChapterAudio(chapter.content);
    
    if (!base64Audio) {
      setIsAudioLoading(false);
      alert("Audio synthesis failed. Please try again.");
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioContextRef.current,
        24000,
        1
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      
      audioSourceRef.current = source;
      source.start();
      setIsPlaying(true);
      setIsAudioLoading(false);
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsAudioLoading(false);
    }
  };

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'sm': return 'text-lg md:text-xl';
      case 'md': return 'text-xl md:text-2xl';
      case 'lg': return 'text-2xl md:text-3xl';
      case 'xl': return 'text-3xl md:text-4xl';
      default: return 'text-xl md:text-2xl';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#020617] text-slate-100 flex flex-col font-serif" onClick={() => setActiveWord(null)}>
      {/* Header */}
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-3xl bg-black/40">
        <button onClick={onExit} className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-pink-500 transition-colors">
          &larr; {isFinished ? 'Return to Shelf' : 'Exit Session'}
        </button>
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-black italic tracking-tight">{book.title}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[9px] font-sans font-black bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 uppercase">
              {readingLevel} Mode
            </span>
            <span className="text-[9px] uppercase font-sans font-black text-white/30 tracking-widest">
              {isFinished ? 'STORY ARCHIVED' : `Chapter ${history.length} / ${book.totalChapters}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Text Settings Button */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${showSettings ? 'bg-pink-500 border-pink-500' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
              title="Text Settings"
            >
              <span className="text-sm font-black">Aa</span>
            </button>
            
            {showSettings && (
              <div 
                className="absolute top-full right-0 mt-4 w-48 bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-[70] font-sans"
                onClick={e => e.stopPropagation()}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Text Size</p>
                <div className="flex gap-2">
                  {(['sm', 'md', 'lg', 'xl'] as TextSize[]).map(size => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${textSize === size ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:text-white'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center">
            <button 
              onClick={handlePlayAudio}
              disabled={loading}
              className={`relative overflow-hidden flex items-center gap-3 px-6 py-2 rounded-full border transition-all ${isPlaying ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'} disabled:opacity-20`}
            >
              {isAudioLoading && (
                <div className="absolute inset-0 bg-white/10">
                  <div className="h-full bg-pink-400/30 animate-shimmer w-full" />
                </div>
              )}
              {isPlaying ? (
                 <span className="text-sm z-10">■ Stop</span>
              ) : (
                 <span className="text-sm z-10">▶ Listen</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 max-w-4xl mx-auto w-full flex flex-col scroll-smooth" onClick={() => setShowSettings(false)}>
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-sm mx-auto w-full">
            <div className="w-full">
              <ProgressBar />
            </div>
            <p className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/60 animate-pulse text-center">Syncing Narrative Architecture...</p>
          </div>
        ) : (
          <div className="animate-[fade-in-up_0.8s_ease-out] flex-1 flex flex-col relative">
            {!isFinished && (
              <div className="prose prose-invert max-w-none">
                <p className={`${getTextSizeClass()} leading-[1.8] text-slate-300 font-light transition-all duration-300`}>
                   {renderContentWithClickableWords(chapter?.content || "")}
                </p>
              </div>
            )}

            {/* Word Definition Tooltip */}
            {activeWord && (
              <div 
                className="fixed z-[100] max-w-xs bg-slate-900 border border-pink-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-[zoom-in_0.2s_ease-out]"
                style={{ 
                  left: Math.min(window.innerWidth - 320, Math.max(20, activeWord.x)), 
                  top: Math.max(80, activeWord.y - 120) 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-pink-400 font-black uppercase tracking-widest text-[10px]">{activeWord.word}</h5>
                  <button onClick={() => setActiveWord(null)} className="text-white/20 hover:text-white text-xs">✕</button>
                </div>
                {isFetchingDefinition && activeWord.definition === "..." ? (
                  <div className="py-2">
                    <ProgressBar colorClass="bg-cyan-400" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-white/90 leading-relaxed italic mb-2">"{activeWord.definition}"</p>
                    {activeWord.example && (
                      <p className="text-[10px] text-white/40 font-sans border-t border-white/5 pt-2 italic">
                         Example: {activeWord.example}
                      </p>
                    )}
                  </>
                )}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-pink-500/30 rotate-45" />
              </div>
            )}

            {isFinished && earnedBadge ? (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
                
                <div className="relative max-w-lg w-full bg-slate-900 rounded-[4rem] border border-white/10 p-10 md:p-16 text-center shadow-2xl animate-[zoom-in_0.5s_ease-out]">
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />
                  
                  <div className="relative z-10">
                    <div className="relative mb-10 group">
                       <div className={`absolute inset-0 blur-3xl opacity-30 rounded-full scale-150 bg-white`} />
                       <div className="relative w-32 h-32 md:w-44 md:h-44 mx-auto bg-white/5 border-4 border-white/10 rounded-full flex items-center justify-center text-7xl md:text-8xl shadow-2xl group-hover:scale-110 transition-transform">
                          {earnedBadge.icon}
                       </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <span className="block font-sans text-[10px] font-black uppercase tracking-[0.5em] text-pink-500">Badge Earned</span>
                      <h3 className="text-4xl font-black font-sans tracking-tight text-white">{earnedBadge.name}</h3>
                    </div>

                    <p className="text-white/40 font-sans italic mb-10">A testament to your choices and identity.</p>

                    <button 
                      onClick={() => onFinish(book, earnedBadge)}
                      className="w-full bg-white text-black py-6 rounded-3xl font-black font-sans uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      Claim to Shelf
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-20 space-y-6 font-sans">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-black italic">Tip: Click any word for a definition</p>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapter?.choices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => loadChapter(choice.text)}
                      className="group bg-[#0f172a] border border-white/5 p-8 rounded-[2rem] transition-all hover:border-pink-500/50 hover:bg-[#1e293b] text-left"
                    >
                      <span className="block text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2 opacity-60">{choice.impact}</span>
                      <span className="text-lg font-bold text-white leading-tight">{choice.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="h-24" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingView;
