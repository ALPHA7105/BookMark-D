
import { INITIAL_BOOKS, MOOD_STORIES, MOCK_USER, THEME_CONFIG } from './constants.js';
import { generateStoryPreview, generateInteractiveChapter } from './geminiService.js';

// --- State ---
let state = {
  currentUser: null,
  userBooks: [],
  selectedBook: null,
  readingState: null,
  activeTab: 'discover',
  activeMood: 'all',
  previewBook: null,
  isLoadingPreview: false,
  previewData: null,
  isEditingProfile: false,
  selectedAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
};

const AVATAR_STYLES = [
  { id: 'human', label: 'Human', seed: 'human' },
  { id: 'robot', label: 'Robot', seed: 'bot' },
  { id: 'pixels', label: 'Pixels', seed: 'pixel' },
  { id: 'adventurous', label: 'Adventurous', seed: 'adventure' },
  { id: 'minimalistic', label: 'Minimalistic', seed: 'minimal' },
  { id: 'fun', label: 'Fun', seed: 'fun' }
];

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

// --- Helpers ---
function saveState() {
  localStorage.setItem('bookmarkd_user', JSON.stringify(state.currentUser));
  localStorage.setItem('bookmarkd_user_books', JSON.stringify(state.userBooks));
}

function loadState() {
  const savedUser = localStorage.getItem('bookmarkd_user');
  const savedBooks = localStorage.getItem('bookmarkd_user_books');
  if (savedUser) state.currentUser = JSON.parse(savedUser);
  if (savedBooks) state.userBooks = JSON.parse(savedBooks);
}

// --- Components ---

function renderAuth() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-6 bg-[#020617]">
      <div class="w-full max-w-md space-y-8 animate-[fade-in-up_0.6s_ease-out]">
        <div class="text-center space-y-4">
          <div class="inline-flex w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl items-center justify-center text-4xl font-black shadow-2xl shadow-pink-500/20 mb-4">
            B
          </div>
          <h1 class="text-5xl font-black tracking-tighter text-white">BookMark’D</h1>
          <p class="text-slate-400 font-medium">Your digital shelf, reimagined for the next generation of readers.</p>
        </div>

        <div class="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Choose Your Identity</label>
            <div class="grid grid-cols-3 gap-3">
              ${AVATAR_STYLES.map(style => `
                <button onclick="window.setAvatar('${getAvatarUrl(style.seed)}')" class="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-800 border-2 ${state.selectedAvatar === getAvatarUrl(style.seed) ? 'border-pink-500' : 'border-transparent'} hover:border-pink-500/50 transition-all">
                  <img src="${getAvatarUrl(style.seed)}" class="w-10 h-10 object-cover" />
                  <span class="text-[8px] font-black uppercase tracking-tighter text-slate-400">${style.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="space-y-4">
            <input id="username-input" type="text" placeholder="Username" class="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 transition-colors" />
            <button id="login-btn" class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              ENTER THE SHELF
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-btn').onclick = () => {
    const username = document.getElementById('username-input').value || 'Reader';
    state.currentUser = {
      ...MOCK_USER,
      username,
      displayName: username,
      avatar: state.selectedAvatar,
      badges: [],
      completedBookIds: {},
      recentActivity: ['Joined BookMark’D!']
    };
    saveState();
    renderApp();
  };
}

window.setAvatar = (url) => {
  state.selectedAvatar = url;
  if (!state.currentUser) {
    renderAuth();
  } else {
    renderApp();
  }
};

function renderHeader() {
  return `
    <header class="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3 cursor-pointer group" onclick="window.navigate('discover')">
        <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
          B
        </div>
        <h1 class="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          BookMark’D
        </h1>
      </div>

      <div class="hidden md:flex gap-10 items-center text-xs font-black uppercase tracking-[0.2em]">
        ${['discover', 'create', 'profile', 'social'].map(tab => `
          <button onclick="window.navigate('${tab}')" class="transition-all relative py-2 ${state.activeTab === tab ? 'text-pink-500' : 'text-white/40 hover:text-white'}">
            ${tab}
            ${state.activeTab === tab ? '<div class="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full"></div>' : ''}
          </button>
        `).join('')}
      </div>

      <div class="flex items-center gap-4">
        <button onclick="window.logout()" class="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors mr-2">
          Logout
        </button>
        <div class="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 overflow-hidden cursor-pointer hover:border-pink-500/50 transition-colors" onclick="window.navigate('profile')">
          <img src="${state.currentUser.avatar}" class="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  `;
}

function renderDiscover() {
  const allBooks = [...INITIAL_BOOKS, ...state.userBooks];
  const filteredBooks = state.activeMood === 'all' ? allBooks : allBooks.filter(b => b.theme === state.activeMood || b.vibe.toLowerCase().includes(state.activeMood));

  const moods = [
    { id: 'all', label: 'All', icon: '🌈' },
    { id: 'adventure', label: 'Adventure', icon: '⚔️' },
    { id: 'cozy', label: 'Cozy', icon: '☕' },
    { id: 'mysterious', label: 'Mystery', icon: '🔍' },
    { id: 'dark', label: 'Dark', icon: '💀' },
    { id: 'romantic', label: 'Romantic', icon: '💖' }
  ];

  const groupedBooks = state.activeMood === 'all' 
    ? filteredBooks.reduce((acc, book) => {
        if (!acc[book.theme]) acc[book.theme] = [];
        acc[book.theme].push(book);
        return acc;
      }, {})
    : { [state.activeMood]: filteredBooks };

  return `
    <div class="space-y-12 animate-[fade-in-up_0.4s_ease-out]">
      <!-- Hero Section -->
      <section class="relative h-[500px] flex items-center justify-center overflow-hidden rounded-b-[60px] md:rounded-b-[100px]">
        <div class="absolute inset-0 z-0">
          <img src="https://picsum.photos/seed/bookshelf/1920/1080?blur=5" class="w-full h-full object-cover opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]"></div>
        </div>
        <div class="relative z-10 text-center space-y-8 px-6 max-w-3xl">
          <div class="inline-flex px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
            The Future of Reading is Here
          </div>
          <h2 class="text-6xl md:text-7xl font-black tracking-tighter leading-none">
            Your Stories, <br/> <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Reimagined.</span>
          </h2>
          <p class="text-lg text-slate-400 font-medium leading-relaxed">
            BookMark’D is a vibrant digital shelf where classics meet AI. Create immersive stories, earn badges, and explore a universe of interactive narratives tailored to your vibe.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button onclick="window.navigate('create')" class="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-105 transition-transform">
              CREATE A STORY
            </button>
            <button onclick="window.navigate('social')" class="px-8 py-4 bg-slate-800 text-white font-black rounded-2xl border border-white/5 hover:bg-slate-700 transition-colors">
              EXPLORE SOCIAL
            </button>
          </div>
        </div>
      </section>

      <section class="px-6">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-4xl font-black tracking-tighter">Discover</h2>
          <div class="flex gap-2 no-scrollbar overflow-x-auto pb-2">
            ${moods.map(m => `
              <button onclick="window.setMood('${m.id}')" class="px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${state.activeMood === m.id ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-slate-900/50 text-slate-400 border border-white/5 hover:bg-slate-800'}">
                <span class="mr-2">${m.icon}</span>${m.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="space-y-16">
          ${Object.entries(groupedBooks).map(([theme, books]) => `
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-500">${theme}</h3>
                <div class="h-px flex-1 bg-white/5"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${books.map(book => `
                  <div onclick="window.showPreview('${book.id}')" class="group relative bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all cursor-pointer">
                    <div class="aspect-[16/9] overflow-hidden">
                      <img src="${book.coverImage}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>
                    </div>
                    <div class="p-6 space-y-3 relative">
                      <div class="flex justify-between items-start">
                        <h3 class="text-xl font-black tracking-tight">${book.title}</h3>
                        <span class="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg text-white/40">${book.theme}</span>
                      </div>
                      <p class="text-sm text-slate-400 line-clamp-2">${book.description}</p>
                      <div class="flex items-center gap-3 pt-2">
                        <div class="flex -space-x-2">
                          ${[1, 2, 3].map(() => `<div class="w-6 h-6 rounded-full border-2 border-[#0f172a] bg-slate-800"></div>`).join('')}
                        </div>
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${book.readCount} reading</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

function renderProfile() {
  const user = state.currentUser;

  if (state.isEditingProfile) {
    return `
      <div class="max-w-2xl mx-auto px-6 py-12 space-y-12 animate-[fade-in-up_0.4s_ease-out]">
        <div class="text-center space-y-4">
          <h2 class="text-5xl font-black tracking-tighter">Edit Profile</h2>
          <p class="text-slate-400 font-medium">Update your digital identity.</p>
        </div>

        <div class="bg-slate-900/50 border border-white/10 p-8 rounded-3xl space-y-8">
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Avatar Style</label>
              <div class="grid grid-cols-3 gap-3">
                ${AVATAR_STYLES.map(style => `
                  <button onclick="window.setAvatar('${getAvatarUrl(style.seed)}')" class="flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-800 border-2 ${state.selectedAvatar === getAvatarUrl(style.seed) ? 'border-pink-500' : 'border-transparent'} hover:border-pink-500/50 transition-all">
                    <img src="${getAvatarUrl(style.seed)}" class="w-10 h-10 object-cover" />
                    <span class="text-[8px] font-black uppercase tracking-tighter text-slate-400">${style.label}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Display Name</label>
              <input id="edit-display-name" type="text" value="${user.displayName}" class="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 transition-colors" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Bio</label>
              <textarea id="edit-bio" class="w-full h-32 bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 transition-colors resize-none">${user.bio}</textarea>
            </div>
          </div>

          <div class="flex gap-4">
            <button onclick="window.toggleEditProfile(false)" class="flex-1 bg-slate-800 text-white font-black py-4 rounded-2xl border border-white/5 hover:bg-slate-700 transition-colors">
              CANCEL
            </button>
            <button onclick="window.updateProfile()" class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-[fade-in-up_0.4s_ease-out]">
      <div class="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <div class="w-32 h-32 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 p-1 shadow-2xl shadow-pink-500/20">
          <img src="${user.avatar}" class="w-full h-full rounded-[22px] object-cover bg-slate-900" />
        </div>
        <div class="flex-1 space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-4xl font-black tracking-tighter">${user.displayName}</h2>
              <p class="text-pink-500 font-bold tracking-wide">@${user.username}</p>
            </div>
            <button onclick="window.toggleEditProfile(true)" class="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
              Edit Profile
            </button>
          </div>
          <p class="text-slate-400 font-medium max-w-lg">${user.bio}</p>
          <div class="flex flex-wrap gap-6 pt-2 justify-center md:justify-start">
            <div class="text-center">
              <div class="text-2xl font-black">${user.stats.booksRead}</div>
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-500">Books Read</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-black">${user.stats.streak}</div>
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-500">Day Streak</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-black">${user.stats.pagesTurned}</div>
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-500">Pages</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Earned Badges</h3>
          <div class="grid grid-cols-3 gap-4">
            ${user.badges.length ? user.badges.map(b => `
              <div class="aspect-square rounded-2xl bg-slate-800/50 flex flex-col items-center justify-center p-4 text-center group hover:bg-slate-800 transition-colors">
                <span class="text-3xl mb-2 group-hover:scale-110 transition-transform">${b.icon}</span>
                <span class="text-[10px] font-black uppercase tracking-tighter text-slate-400">${b.name}</span>
              </div>
            `).join('') : '<p class="col-span-3 text-center text-slate-600 py-8">No badges earned yet. Start reading!</p>'}
          </div>
        </div>

        <div class="bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Recent Activity</h3>
          <div class="space-y-4">
            ${user.recentActivity.map(act => `
              <div class="flex items-center gap-4 text-sm font-medium text-slate-300">
                <div class="w-2 h-2 rounded-full bg-pink-500"></div>
                ${act}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCreate() {
  return `
    <div class="max-w-2xl mx-auto px-6 py-12 space-y-12 animate-[fade-in-up_0.4s_ease-out]">
      <div class="text-center space-y-4">
        <h2 class="text-5xl font-black tracking-tighter">Create Your Story</h2>
        <p class="text-slate-400 font-medium">Manifest a new world with AI. Just give us a spark.</p>
      </div>

      <div class="bg-slate-900/50 border border-white/10 p-8 rounded-3xl space-y-8">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Story Title</label>
            <input id="create-title" type="text" placeholder="The Midnight Protocol" class="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 transition-colors" />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Vibe / Prompt</label>
            <textarea id="create-vibe" placeholder="A cyberpunk detective story set in a rainy Neo-Tokyo where memories can be traded like currency..." class="w-full h-32 bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 transition-colors resize-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Theme</label>
              <select id="create-theme" class="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors appearance-none">
                <option value="sci-fi">Sci-Fi</option>
                <option value="fantasy">Fantasy</option>
                <option value="crime">Crime</option>
                <option value="classics">Classics</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Reading Level</label>
              <select id="create-level" class="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-pink-500/50 transition-colors appearance-none">
                <option value="Standard">Standard</option>
                <option value="Chill">Chill</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
          </div>
        </div>

        <button id="create-story-btn" class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
          GENERATE IMMERSIVE STORY
        </button>
      </div>
    </div>
  `;
}

function renderPreviewModal() {
  if (!state.previewBook) return '';
  const book = state.previewBook;
  const data = state.previewData;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-sm animate-[zoom-in_0.3s_ease-out]">
      <div class="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        <div class="w-full md:w-2/5 relative">
          <img src="${book.coverImage}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          <button onclick="window.closePreview()" class="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">✕</button>
        </div>
        <div class="w-full md:w-3/5 p-8 md:p-12 space-y-8 overflow-y-auto no-scrollbar">
          <div class="space-y-2">
            <h2 class="text-4xl font-black tracking-tighter">${book.title}</h2>
            <p class="text-pink-500 font-bold tracking-wide uppercase text-xs">By ${book.author}</p>
          </div>

          ${state.isLoadingPreview ? `
            <div class="space-y-6 py-8">
              <div class="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
              <div class="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
              <div class="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-500">AI is analyzing the vibe...</p>
            </div>
          ` : `
            <div class="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
              <div class="space-y-2">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-500">The Hook</h4>
                <p class="text-slate-300 leading-relaxed">${data?.summary || book.description}</p>
              </div>
              <div class="p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-1">Potential Twist</h4>
                <p class="text-sm text-pink-100 italic">"${data?.plotTwist || 'Something unexpected awaits...'}"</p>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Vibe Check</span>
                <span class="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-white">${data?.vibeRating || '✨ Immaculate'}</span>
              </div>
            </div>
          `}

          <div class="pt-4">
            <button onclick="window.startReading('${book.id}')" class="w-full bg-white text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              START READING
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderReadingView() {
  const { book, level, chapter, isLoading, history, audioUrl } = state.readingState;
  
  return `
    <div class="fixed inset-0 z-50 bg-[#0f172a] flex flex-col overflow-hidden">
      <header class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <button onclick="window.exitReading()" class="text-slate-400 hover:text-white transition-colors">← Exit</button>
          <div class="h-4 w-px bg-white/10"></div>
          <div>
            <h3 class="text-sm font-black tracking-tight">${book.title}</h3>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${level} Mode</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex h-2 w-32 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-pink-500 transition-all duration-1000" style="width: ${((history.length + 1) / book.totalChapters) * 100}%"></div>
          </div>
          <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">CH ${history.length + 1}</span>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto px-6 py-12 no-scrollbar">
        <div class="max-w-2xl mx-auto space-y-12">
          ${isLoading ? `
            <div class="space-y-8 py-12">
              <div class="space-y-4">
                <div class="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                <div class="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                <div class="h-4 bg-white/5 rounded-full w-4/5 animate-pulse"></div>
              </div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-500 animate-pulse">AI is weaving the next chapter...</p>
            </div>
          ` : `
            <div class="prose prose-invert max-w-none animate-[fade-in-up_0.6s_ease-out]">
              <p class="text-xl md:text-2xl leading-relaxed text-slate-200 font-serif first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-pink-500">
                ${chapter.content}
              </p>
            </div>

            ${chapter.isEnding ? `
              <div class="bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-[40px] text-center space-y-6 animate-[zoom-in_0.5s_ease-out]">
                <div class="text-6xl mb-4">🏆</div>
                <h2 class="text-3xl font-black tracking-tighter">Story Complete!</h2>
                <p class="font-medium text-white/80">You've earned the <strong>${chapter.unlockedBadge || 'Master Reader'}</strong> badge.</p>
                <button onclick="window.finishStory()" class="bg-white text-black px-8 py-3 rounded-2xl font-black hover:scale-105 transition-transform">COLLECT & EXIT</button>
              </div>
            ` : `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                ${chapter.choices.map((choice, i) => `
                  <button onclick="window.makeChoice('${choice.text}')" class="p-6 bg-slate-900 border border-white/10 rounded-3xl text-left hover:border-pink-500/50 hover:bg-slate-800 transition-all group">
                    <div class="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2">Option ${i + 1}</div>
                    <div class="text-lg font-bold text-white group-hover:text-pink-100 transition-colors">${choice.text}</div>
                    <div class="text-xs text-slate-500 mt-2 italic">${choice.impact}</div>
                  </button>
                `).join('')}
              </div>
            `}
          `}
        </div>
      </main>

      ${audioUrl ? `
        <div class="px-6 py-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
          <audio controls src="data:audio/wav;base64,${audioUrl}" class="w-full max-w-md h-10"></audio>
        </div>
      ` : ''}
    </div>
  `;
}

function renderSocialFeed() {
  return `
    <div class="max-w-4xl mx-auto px-6 py-24 text-center space-y-8 animate-[fade-in-up_0.4s_ease-out]">
      <div class="inline-flex w-24 h-24 bg-slate-800 rounded-full items-center justify-center text-5xl mb-4">
        🌐
      </div>
      <h2 class="text-6xl font-black tracking-tighter">Social Feed</h2>
      <div class="inline-flex px-6 py-2 bg-pink-500 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
        Coming Soon
      </div>
      <p class="text-slate-400 text-lg max-w-lg mx-auto">
        Connect with other readers, share your shelves, and discover what's trending in the BookMark'D universe.
      </p>
    </div>
  `;
}

function renderApp() {
  const root = document.getElementById('root');
  if (!state.currentUser) {
    renderAuth();
    return;
  }

  if (state.readingState) {
    root.innerHTML = renderReadingView();
    return;
  }

  let content = '';
  switch (state.activeTab) {
    case 'discover': content = renderDiscover(); break;
    case 'profile': content = renderProfile(); break;
    case 'create': content = renderCreate(); break;
    case 'social': content = renderSocialFeed(); break;
  }

  root.innerHTML = `
    <div class="min-h-screen pb-24 md:pb-0 md:pt-20">
      ${renderHeader()}
      <main class="max-w-7xl mx-auto">
        ${content}
      </main>
      ${renderPreviewModal()}
      
      <!-- Mobile Nav -->
      <nav class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0f172a]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 flex justify-around">
        ${['discover', 'create', 'profile'].map(tab => `
          <button onclick="window.navigate('${tab}')" class="flex flex-col items-center gap-1 ${state.activeTab === tab ? 'text-pink-500' : 'text-white/40'}">
            <span class="text-xs font-black uppercase tracking-widest">${tab}</span>
          </button>
        `).join('')}
      </nav>
    </div>
  `;

  // Re-attach event listeners for dynamic content
  if (state.activeTab === 'create') {
    const btn = document.getElementById('create-story-btn');
    if (btn) {
      btn.onclick = () => {
        const title = document.getElementById('create-title').value;
        const vibe = document.getElementById('create-vibe').value;
        const theme = document.getElementById('create-theme').value;
        const level = document.getElementById('create-level').value;

        if (!title || !vibe) {
          alert('Please fill in title and vibe!');
          return;
        }

        const newBook = {
          id: 'u-' + Date.now(),
          title,
          author: state.currentUser.displayName,
          description: vibe,
          theme,
          coverImage: 'https://picsum.photos/seed/' + title + '/800/450',
          tags: ['AI Generated', theme],
          vibe: 'Custom',
          readCount: "NEW",
          totalChapters: 10,
          readingLevel: level
        };

        state.userBooks.unshift(newBook);
        saveState();
        window.startReading(newBook.id);
      };
    }
  }
}

// --- Global Actions ---
window.navigate = (tab) => {
  state.activeTab = tab;
  state.isEditingProfile = false;
  renderApp();
};

window.toggleEditProfile = (isEditing) => {
  state.isEditingProfile = isEditing;
  if (isEditing) {
    state.selectedAvatar = state.currentUser.avatar;
  }
  renderApp();
};

window.updateProfile = () => {
  const displayName = document.getElementById('edit-display-name').value;
  const bio = document.getElementById('edit-bio').value;

  state.currentUser = {
    ...state.currentUser,
    displayName,
    bio,
    avatar: state.selectedAvatar
  };

  state.isEditingProfile = false;
  saveState();
  renderApp();
};

window.setMood = (mood) => {
  state.activeMood = mood;
  renderApp();
};

window.logout = () => {
  state.currentUser = null;
  localStorage.removeItem('bookmarkd_user');
  renderApp();
};

window.showPreview = async (bookId) => {
  const allBooks = [...INITIAL_BOOKS, ...state.userBooks];
  const book = allBooks.find(b => b.id === bookId);
  state.previewBook = book;
  state.isLoadingPreview = true;
  state.previewData = null;
  renderApp();

  const data = await generateStoryPreview(book.title, book.author, book.vibe);
  state.previewData = data;
  state.isLoadingPreview = false;
  renderApp();
};

window.closePreview = () => {
  state.previewBook = null;
  renderApp();
};

window.startReading = async (bookId) => {
  const allBooks = [...INITIAL_BOOKS, ...state.userBooks];
  const book = allBooks.find(b => b.id === bookId);
  
  state.readingState = {
    book,
    level: book.readingLevel || 'Standard',
    chapter: null,
    isLoading: true,
    history: [],
    audioUrl: null
  };
  state.previewBook = null;
  renderApp();

  const chapter = await generateInteractiveChapter(book.title, book.description, false, state.readingState.level);
  state.readingState.chapter = chapter;
  state.readingState.isLoading = false;
  
  // Try to get audio
  // const audio = await generateChapterAudio(chapter.content.slice(0, 1000));
  // state.readingState.audioUrl = audio;
  
  renderApp();
};

window.makeChoice = async (choiceText) => {
  const { book, level, history, chapter } = state.readingState;
  state.readingState.isLoading = true;
  state.readingState.history.push(chapter);
  state.readingState.audioUrl = null;
  renderApp();

  const isLast = history.length + 1 >= book.totalChapters;
  const nextChapter = await generateInteractiveChapter(book.title, history.map(h => h.content).join(' '), isLast, level, choiceText);
  
  state.readingState.chapter = nextChapter;
  state.readingState.isLoading = false;
  
  const audio = await generateChapterAudio(nextChapter.content.slice(0, 1000));
  state.readingState.audioUrl = audio;
  
  renderApp();
};

window.exitReading = () => {
  state.readingState = null;
  renderApp();
};

window.finishStory = () => {
  const { book, chapter } = state.readingState;
  const badge = {
    id: 'b-' + Date.now(),
    name: chapter.unlockedBadge || 'Master Reader',
    icon: '🏆',
    rarity: 'epic',
    unlockedAt: new Date().toISOString().split('T')[0]
  };

  state.currentUser.badges.unshift(badge);
  state.currentUser.stats.booksRead++;
  state.currentUser.recentActivity.unshift(`Completed "${book.title}" and earned the ${badge.name} badge!`);
  state.currentUser.completedBookIds[book.id] = badge.id;
  
  saveState();
  state.readingState = null;
  state.activeTab = 'profile';
  renderApp();
};

// --- Init ---
loadState();
renderApp();
