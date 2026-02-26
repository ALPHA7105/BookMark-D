
import React, { useState } from 'react';
import { UserProfile, ShelfTheme, UserPreferences } from '../types';
import AvatarPicker from './AvatarPicker';

interface AuthViewProps {
  onComplete: (profile: UserProfile) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'register' | 'avatar' | 'questionnaire'>('register');
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    avatar: '',
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredGenre: 'fantasy',
    pacing: 'Fast',
    tone: 'Bright'
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Default avatar based on name if not set
    if (!formData.avatar) {
      setFormData(prev => ({
        ...prev,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.displayName || 'reader'}`
      }));
    }
    setStep('avatar');
  };

  const handleFinish = () => {
    const newProfile: UserProfile = {
      username: formData.username || "new_reader",
      displayName: formData.displayName || "Explorer",
      bio: "Newly joined BookMark'D reader.",
      avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.displayName}`,
      readingPreference: 'Standard',
      preferences,
      stats: { booksRead: 0, streak: 0, pagesTurned: "0" },
      badges: [],
      recentActivity: ["Joined BookMark'D"]
    };
    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-pink-900/20" />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/5 rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-pink-500/5 animate-[zoom-in_0.5s_ease-out]">
        {step === 'register' ? (
          <div className="space-y-10">
            <header className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl shadow-pink-500/20">B</div>
              <h2 className="text-4xl font-black tracking-tight mb-2">Claim Your Identity</h2>
              <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Initialize your reader profile</p>
            </header>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 ml-4">Display Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="The Star Wanderer"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-xl font-bold focus:border-pink-500 outline-none transition-all"
                  value={formData.displayName}
                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 ml-4">Handle (@)</label>
                <input 
                  type="text" 
                  required
                  placeholder="username_2099"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-xl font-bold focus:border-cyan-400 outline-none transition-all"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all mt-6 shadow-xl"
              >
                Choose Your Avatar &rarr;
              </button>
            </form>
          </div>
        ) : step === 'avatar' ? (
          <div className="space-y-10">
            <header className="text-center">
              <span className="inline-block text-[10px] font-black bg-pink-500/10 text-pink-500 px-4 py-1.5 rounded-full border border-pink-500/20 uppercase tracking-widest mb-4">Visual Identity</span>
              <h2 className="text-4xl font-black tracking-tight mb-2">Pick Your Look</h2>
              <p className="text-white/40 font-medium">How should other readers see you?</p>
            </header>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-pink-500 shadow-2xl shadow-pink-500/20">
                  <img src={formData.avatar} alt="Current selection" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <AvatarPicker 
                currentAvatar={formData.avatar} 
                onSelect={(url) => setFormData({...formData, avatar: url})} 
              />
            </div>

            <button 
              onClick={() => setStep('questionnaire')}
              className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Proceed to Taste Sync &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-10">
             <header className="text-center">
              <span className="inline-block text-[10px] font-black bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full border border-cyan-500/20 uppercase tracking-widest mb-4">Neural Questionnaire</span>
              <h2 className="text-4xl font-black tracking-tight mb-2">Sync Your Taste</h2>
              <p className="text-white/40 font-medium">What kind of worlds do you want to inhabit?</p>
            </header>

            <div className="space-y-8">
              <section>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 ml-4">Preferred Narrative Realm</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['classics', 'sci-fi', 'fantasy', 'crime'] as ShelfTheme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setPreferences({...preferences, preferredGenre: t})}
                      className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${preferences.preferredGenre === t ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 ml-4">Pacing & Energy</label>
                <div className="flex gap-4">
                  {(['Fast', 'Slow'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPreferences({...preferences, pacing: p})}
                      className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${preferences.pacing === p ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}
                    >
                      {p === 'Fast' ? '⚡ Adrenaline' : '🌙 Slow Burn'}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 ml-4">Atmospheric Tone</label>
                <div className="flex gap-4">
                  {(['Bright', 'Dark'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setPreferences({...preferences, tone: t})}
                      className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${preferences.tone === t ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}
                    >
                      {t === 'Bright' ? '🌈 Hopeful' : '🖤 Gritty'}
                    </button>
                  ))}
                </div>
              </section>

              <button 
                onClick={handleFinish}
                className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black uppercase tracking-widest text-lg hover:scale-[1.02] active:scale-95 transition-all mt-4 shadow-2xl"
              >
                Launch Experience
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
