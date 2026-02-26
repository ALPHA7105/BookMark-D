
import React, { useState } from 'react';
import { UserProfile } from '../types';
import AvatarPicker from './AvatarPicker';

interface ProfileViewProps {
  user: UserProfile;
  onUpdate?: (updates: Partial<UserProfile>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    bio: user.bio,
    avatar: user.avatar
  });

  const rarityStyles = {
    common: 'bg-white/10 text-white border-white/20',
    rare: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    epic: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    legendary: 'bg-amber-500/20 text-amber-300 border-amber-500/50'
  };

  const handleSave = () => {
    onUpdate?.(editForm);
    setIsEditing(false);
  };

  return (
    <div className="animate-[fade-in_0.5s_ease-out]">
      {/* Header Profile Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-[#1e293b] p-8 md:p-16 mb-12 border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 ${isEditing ? 'border-pink-500 scale-105' : 'border-white/10 rotate-3 hover:rotate-0'} bg-white/5 shadow-2xl`}>
              <img src={isEditing ? editForm.avatar : user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
            </div>
            
            {!isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-black text-xl border-4 border-[#1e293b]">
                ✓
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-6 max-w-2xl mx-auto md:mx-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Display Name</label>
                      <input 
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-2xl font-black focus:border-pink-500 outline-none transition-colors"
                        value={editForm.displayName}
                        onChange={e => setEditForm({...editForm, displayName: e.target.value})}
                        placeholder="Display Name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Short Bio</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white/80 focus:border-pink-500 outline-none h-32 resize-none transition-colors"
                        value={editForm.bio}
                        onChange={e => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="Tell us your story..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Choose New Avatar</label>
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4">
                      <AvatarPicker 
                        currentAvatar={editForm.avatar} 
                        onSelect={(url) => setEditForm({...editForm, avatar: url})} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Custom Avatar URL (Optional)</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-[10px] font-mono focus:border-pink-500 outline-none text-white/40 transition-colors"
                    value={editForm.avatar}
                    onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                    placeholder="Enter custom URL"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleSave}
                    className="bg-pink-500 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setEditForm({ displayName: user.displayName, bio: user.bio, avatar: user.avatar });
                      setIsEditing(false);
                    }}
                    className="bg-white/5 text-white/50 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{user.displayName}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-fit self-center md:self-auto text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors group"
                  >
                    Edit Profile <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
                  </button>
                </div>
                <p className="text-pink-500 font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">@</span>
                  {user.username}
                </p>
                <p className="text-lg text-white/60 max-w-lg mb-8 leading-relaxed mx-auto md:mx-0 font-light">{user.bio}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-white/5 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
                    <span className="block text-2xl font-black text-white">{user.stats.booksRead}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-black">Books Read</span>
                  </div>
                  <div className="bg-white/5 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
                    <span className="block text-2xl font-black text-cyan-400">{user.stats.streak}🔥</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-black">Day Streak</span>
                  </div>
                  <div className="bg-white/5 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
                    <span className="block text-2xl font-black text-purple-400">{user.stats.pagesTurned}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-black">Pages Turned</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Achievements */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black">Achievement Case</h3>
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{user.badges.length} / 50 Unlocked</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {user.badges.map(badge => (
                <div key={badge.id} className={`p-6 rounded-3xl border ${rarityStyles[badge.rarity as keyof typeof rarityStyles]} flex flex-col items-center text-center group transition-all hover:scale-105 hover:shadow-lg`}>
                  <span className="text-4xl mb-4 group-hover:scale-125 transition-transform drop-shadow-lg">{badge.icon}</span>
                  <span className="font-black mb-1">{badge.name}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60 font-black">{badge.rarity}</span>
                </div>
              ))}
              <div className="p-6 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 group hover:border-white/20 transition-colors">
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">?</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-black mb-8 italic font-serif">Story Outcome Badges</h3>
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-8 rounded-[3rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-full bg-white/5 -skew-x-12 translate-x-32 group-hover:translate-x-24 transition-transform" />
               <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-24 h-24 bg-black/40 rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-white/5">👑</div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-black text-2xl">The True Heir</h4>
                    <p className="text-white/60 text-sm">Achieved in 'The Gilded Crown' • March 12</p>
                  </div>
                  <button className="sm:ml-auto bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Share Card</button>
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-12">
          <section>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              Live Activity
            </h3>
            <div className="space-y-4">
              {user.recentActivity.map((act, i) => (
                <div key={i} className="flex gap-4 items-start p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 shrink-0" />
                  <p className="text-sm font-medium text-white/80 leading-relaxed">{act}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-8 rounded-[3rem] border border-cyan-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">📚</div>
            <h3 className="font-black text-lg mb-6 relative z-10">Reading Recommendation</h3>
            <div className="flex gap-4 items-center relative z-10">
              <div className="w-20 h-28 rounded-xl bg-black/40 border border-white/10 shadow-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1614728263952-84ea206f25ab?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-white">Fragmented Sky</p>
                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-black mt-1">Sci-Fi Pick</p>
                <p className="text-xs text-white/40 mt-2">Matches your recent interest in Cyberpunk.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
