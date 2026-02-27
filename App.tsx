
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_BOOKS, MOOD_STORIES, MOCK_USER } from './constants';
import { Book, ShelfTheme, ReadingLevel, UserProfile, MoodStory, MoodType, UserBadge } from './types';
import Shelf from './components/Shelf';
import PreviewModal from './components/PreviewModal';
import ReadingView from './components/ReadingView';
import ProfileView from './components/ProfileView';
import CreateStoryView from './components/CreateStoryView';
import Badge from './components/Badge';
import MoodSelector from './components/MoodSelector';
import AuthView from './components/AuthView';
import MoodStoryCard from './components/MoodStoryCard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingState, setReadingState] = useState<{book: Book, level: ReadingLevel} | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'profile' | 'create' | 'social'>('discover');
  const [activeMood, setActiveMood] = useState<MoodType>('all');

  // Load state from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('bookmarkd_user');
    const savedBooks = localStorage.getItem('bookmarkd_user_books');
    
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedBooks) setUserBooks(JSON.parse(savedBooks));
  }, []);

  const handleAuthComplete = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('bookmarkd_user', JSON.stringify(profile));
    setActiveMood('all');
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('bookmarkd_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bookmarkd_user');
  };

  const handleFinishStory = (book: Book, badge: UserBadge) => {
    if (!currentUser) return;

    // Update user's badge collection and completed books map
    const updatedUser: UserProfile = {
      ...currentUser,
      badges: [badge, ...currentUser.badges],
      completedBookIds: {
        ...(currentUser.completedBookIds || {}),
        [book.id]: badge.id
      },
      stats: {
        ...currentUser.stats,
        booksRead: currentUser.stats.booksRead + 1
      },
      recentActivity: [`Completed "${book.title}" and earned the ${badge.name} badge!`, ...currentUser.recentActivity]
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('bookmarkd_user', JSON.stringify(updatedUser));
    setReadingState(null);
    setActiveTab('discover');
  };

  const allBooks = useMemo(() => {
    const combined = [...INITIAL_BOOKS, ...userBooks];
    if (!currentUser?.completedBookIds) return combined;

    // Map the earned badges onto the books
    return combined.map(book => {
      const badgeId = currentUser.completedBookIds?.[book.id];
      if (badgeId) {
        const badge = currentUser.badges.find(b => b.id === badgeId);
        return { ...book, earnedBadge: badge };
      }
      return book;
    });
  }, [userBooks, currentUser]);

  const shelves: ShelfTheme[] = ['classics', 'sci-fi', 'fantasy', 'crime'];

  const filteredBooks = useMemo(() => {
    if (activeMood === 'all') return allBooks;

    return allBooks.filter(book => {
      const vibe = book.vibe.toLowerCase();
      const tags = book.tags.map(t => t.toLowerCase());
      const theme = book.theme;

      switch (activeMood) {
        case 'adventure':
          return theme === 'fantasy' || vibe.includes('adventure') || vibe.includes('tense');
        case 'melancholic':
          return theme === 'classics' || vibe.includes('melancholic') || vibe.includes('refined');
        case 'cozy':
          return vibe.includes('sweet') || vibe.includes('witty') || vibe.includes('enchanting') || vibe.includes('romantic') || vibe.includes('cozy');
        case 'fast-paced':
          return theme === 'sci-fi' || vibe.includes('gritty') || vibe.includes('electric') || vibe.includes('fast');
        case 'mysterious':
          return theme === 'crime' || tags.includes('detective') || vibe.includes('intellectual') || vibe.includes('mystery');
        case 'romantic':
          return vibe.includes('romantic') || vibe.includes('heartfelt') || tags.includes('romance');
        case 'dark':
          return vibe.includes('dark') || vibe.includes('gritty') || theme === 'crime';
        case 'uplifting':
          return vibe.includes('bright') || vibe.includes('uplifting') || vibe.includes('hopeful');
        default:
          return true;
      }
    });
  }, [allBooks, activeMood]);

  const activeMoodStories = useMemo(() => {
    if (activeMood === 'all') return [];
    return MOOD_STORIES.filter(s => s.moodId === activeMood);
  }, [activeMood]);

  const handleMoodStorySelect = (story: MoodStory) => {
    const mappedBook: Book = {
      id: story.id,
      title: story.title,
      author: story.origin,
      description: story.hook,
      theme: (story.moodId === 'fast-paced' || story.moodId === 'melancholic') ? 'sci-fi' : 'fantasy',
      coverImage: story.coverImage,
      tags: [story.genre, story.tone],
      vibe: story.tone,
      readCount: "NEW",
      totalChapters: story.length === 'Short' ? 8 : 15,
      readingLevel: 'Standard'
    };
    setReadingState({ book: mappedBook, level: 'Standard' });
  };

  const getBooksByTheme = (theme: ShelfTheme) => {
    return filteredBooks.filter(b => b.theme === theme);
  };

  const handleStartReading = (book: Book, level: ReadingLevel) => {
    setReadingState({ book, level });
    setSelectedBook(null);
  };

  const handleCreateStory = (newBook: Book) => {
    const updatedUserBooks = [newBook, ...userBooks];
    setUserBooks(updatedUserBooks);
    localStorage.setItem('bookmarkd_user_books', JSON.stringify(updatedUserBooks));
    setReadingState({ book: newBook, level: newBook.readingLevel || 'Standard' });
    setActiveTab('discover');
  };

  if (!currentUser) {
    return <AuthView onComplete={handleAuthComplete} />;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pt-20">
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => {
            setActiveTab('discover');
            setActiveMood('all');
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
            B
          </div>
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            BookMark’D
          </h1>
        </div>

        <div className="hidden md:flex gap-10 items-center text-xs font-black uppercase tracking-[0.2em]">
          {['discover', 'create', 'profile', 'social'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`transition-all relative py-2 ${activeTab === tab ? 'text-pink-500' : 'text-white/40 hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full animate-[scale-x_0.3s_ease-out]" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors mr-2">
            Logout
          </button>
          <div 
            onClick={() => setActiveTab('profile')}
            className={`w-10 h-10 rounded-xl border-2 p-0.5 overflow-hidden cursor-pointer transition-all ${activeTab === 'profile' ? 'border-pink-500 scale-110' : 'border-white/10 hover:border-white/30'}`}
          >
             <img src={currentUser.avatar} alt="Avatar" className="w-full h-full rounded-lg object-cover bg-white/5" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        {activeTab === 'discover' && (
          <>
            <section className="mb-16 relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] p-8 md:p-16 border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full opacity-30 mix-blend-overlay pointer-events-none">
                <img src="https://images.unsplash.com/photo-1550100136-e092101726f4?q=80&w=1600&auto=format&fit=crop" alt="Abstract library" className="w-full h-full object-cover" />
              </div>
              
              <div className="relative z-10 max-w-2xl">
                <Badge label={`Picked for ${currentUser.displayName}`} icon="🔮" colorClass="bg-white/10 text-white border-white/20 mb-4" />
                <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6 font-serif italic text-white">
                  Find your next <span className="text-pink-400">obsession.</span>
                </h2>
                <p className="text-xl text-white/80 font-light mb-8 max-w-lg">
                  Personalize your shelf, earn unique abridgment badges, and shape the stories you read.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="bg-white text-black px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95"
                  >
                    Forge a Story
                  </button>
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-colors">
                    Explore Trends
                  </button>
                </div>
              </div>
            </section>

            <MoodSelector activeMood={activeMood} onMoodChange={setActiveMood} />

            {MOOD_STORIES.length > 0 && (
              <section className="mb-16 animate-[fade-in-up_0.6s_ease-out]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black tracking-tighter">Handcrafted Mood Matches</h2>
                  <Badge label="New Interactive Starts" icon="💎" />
                </div>
                <MoodStoryShelf 
                  stories={activeMood === 'all' ? MOOD_STORIES : activeMoodStories} 
                  onStorySelect={handleMoodStorySelect} 
                  theme="fantasy" // or derive from mood if you want different colors
                />
                </div>
              </section>
            )}

            <section className="animate-[fade-in-up_0.6s_ease-out]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black">
                  {activeMood === 'all' ? 'Your Curated Shelves' : 'Archive Matches'}
                </h2>
                {activeMood !== 'all' && (
                  <button 
                    onClick={() => setActiveMood('all')} 
                    className="text-xs font-black uppercase text-pink-500 hover:text-pink-400 transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>

              <div>
                {activeMood !== 'all' && filteredBooks.length === 0 && activeMoodStories.length === 0 ? (
                  <div className="py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <span className="text-4xl mb-4 block">🔍</span>
                    <p className="text-xl font-black text-white/40 italic">No stories matching this specific vibe yet.</p>
                  </div>
                ) : (
                  shelves.map(theme => {
                  const themeBooks = getBooksByTheme(theme);
                    if (activeMood !== 'all' && themeBooks.length === 0) return null;
                    return (
                      <Shelf 
                        key={theme} 
                        theme={theme} 
                        books={themeBooks} 
                        onBookClick={setSelectedBook}
                      />
                    );
                  })
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'create' && (
          <CreateStoryView onCreate={handleCreateStory} onCancel={() => setActiveTab('discover')} />
        )}

        {activeTab === 'profile' && currentUser && (
          <ProfileView user={currentUser} onUpdate={handleUpdateProfile} />
        )}
        
        {activeTab === 'social' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6">🤝</div>
            <h2 className="text-3xl font-black mb-2">Social Feed</h2>
            <p className="text-white/40 max-w-md">Connect with friends, swap reading badges, and discover what your squad is reading. Coming soon!</p>
          </div>
        )}

        <footer className="mt-20 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-50">
          <p className="font-bold">&copy; 2024 BookMark’D Inc. Keep reading.</p>
          <div className="flex gap-6 text-xs font-black uppercase tracking-widest">
            <a href="#" className="hover:text-pink-500">Privacy</a>
            <a href="#" className="hover:text-pink-500">Terms</a>
            <a href="#" className="hover:text-pink-500">Support</a>
          </div>
        </footer>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-t border-white/10 px-8 py-4 flex justify-between items-center">
        {['discover', 'create', 'profile', 'social'].map(tab => (
           <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className="flex flex-col items-center gap-1 flex-1"
           >
              <div className={`w-1 h-1 rounded-full mb-1 transition-all ${activeTab === tab ? 'bg-pink-500 scale-x-[4]' : 'bg-transparent'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-white' : 'text-white/40'}`}>
                {tab}
              </span>
           </button>
        ))}
      </nav>

      {selectedBook && (
        <PreviewModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          onRead={(level) => handleStartReading(selectedBook, level)}
        />
      )}

      {readingState && (
        <ReadingView 
          book={readingState.book} 
          readingLevel={readingState.level}
          onFinish={handleFinishStory}
          onExit={() => setReadingState(null)} 
        />
      )}
    </div>
  );
};

export default App;
