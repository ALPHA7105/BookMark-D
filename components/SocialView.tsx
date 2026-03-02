import React, { useState, useMemo } from "react";

const userAvatar = localStorage.getItem("bookmarkd-avatar") || 
  "https://api.dicebear.com/7.x/avataaars/svg?seed=You";

type TabType = "feed" | "discover" | "messages";

const AVATAR_STYLES = [
  'avataaars',
  'bottts',
  'pixel-art',
  'adventurer',
  'lorelei',
  'notionists'
];

/* ---------------- MOCK COMMUNITY ---------------- */

const mockUsers = Array.from({ length: 17 }).map((_, i) => {

  const name = `Reader_${i + 2}`;

  const style = AVATAR_STYLES[i % AVATAR_STYLES.length];
  const avatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${name}`;

  return {
    id: i + 1,
    name,
    avatar,
    achievement: [
      "Finished 3 Sci-Fi books",
      "Reading streak: 5 days",
      "Completed Fantasy Saga",
      "Explored Crime Shelf",
      "Earned 'Night Owl' badge",
      "Posted a story",
      "Reached Level 4 Reader",
      "Unlocked Mystery Mood"
    ][i % 8]
  };
});

const mockMessages = [
  { from: "Reader_3", text: "That sci-fi shelf is insane." },
  { from: "You", text: "Right?? Fragmented Sky hit different." },
  { from: "Reader_3", text: "We should compare badges soon." },
];

/* ---------------- COMPONENT ---------------- */

const SocialView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  /* ---------- Stable Leaderboard ---------- */

  const leaderboard = useMemo(() => {
  
    const others = mockUsers.map(user => ({
      ...user,
      score: Math.floor(Math.random() * 1200) + 200
    }));
  
    const you = {
      id: 999,
      name: "You",
      avatar: userAvatar,
      achievement: "Your latest reading milestone",
      score: Math.floor(Math.random() * 1200) + 200
    };
  
    return [...others, you].sort((a, b) => b.score - a.score);
  
  }, [userAvatar]);

  const yourUser = leaderboard.find(u => u.name === "You");
  const yourRank = leaderboard.findIndex(u => u.name === "You") + 1;

  return (
    <div className="flex gap-8 items-start min-h-[70vh]">

      {/* Sidebar (FIXED HEIGHT) */}
      <aside className="w-64 h-[600px] sticky top-24 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">

        <h2 className="text-lg font-black mb-4">Community</h2>

        {["feed", "discover", "messages"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`text-left px-4 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${
              activeTab === tab
                ? "bg-pink-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1">

        {/* ---------------- LEADERBOARD ---------------- */}
        {activeTab === "feed" && (
          <div className="space-y-6">

            <h3 className="text-2xl font-black mb-6">
              Community Leaderboard
            </h3>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

              {leaderboard.map((user, index) => {
                const isYou = user.name === "You";

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between px-6 py-4 border-b border-white/5 ${
                      isYou ? "bg-pink-500/20" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">

                      <div className="text-lg font-black w-6">
                        #{index + 1}
                      </div>

                      <img
                        src={user.avatar}
                        className="w-12 h-12 rounded-xl object-cover"
                      />

                      <div>
                        <p className="font-black">
                          {isYou ? "You" : user.name}
                        </p>
                        <p className="text-xs text-white/50">
                          {user.achievement}
                        </p>
                      </div>
                    </div>

                    <div className="font-black text-cyan-400">
                      {user.score} XP
                    </div>
                  </div>
                );
              })}
            </div>

            {/* YOUR POSITION */}
            <div className="mt-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 p-6 rounded-3xl">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                Your Position
              </p>
              <p className="text-3xl font-black">
                #{yourRank}
              </p>
              <p className="text-white/40 text-xs mt-1">
                out of {leaderboard.length}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Keep reading to climb the ranks.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- DISCOVER ---------------- */}
        {activeTab === "discover" && (
          <div className="space-y-6">

            <h3 className="text-2xl font-black mb-6">
              Discover Readers
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {mockUsers.map(user => (
                <div
                  key={user.id}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-all"
                >
                  <img
                    src={user.avatar}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <p className="font-black">{user.name}</p>
                  <button className="px-4 py-2 bg-pink-500 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- MESSAGES ---------------- */}
        {activeTab === "messages" && (
          <div className="flex gap-6">

            {/* Friend List */}
            <div className="w-64 bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4">
              {mockUsers.slice(0, 8).map(user => (
                <div
                  key={user.id}
                  onClick={() => setSelectedFriend(user.name)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedFriend === user.name
                      ? "bg-pink-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  {user.name}
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">

              {selectedFriend ? (
                <>
                  <div className="space-y-4 mb-6">
                    {mockMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`max-w-xs px-4 py-2 rounded-xl ${
                          msg.from === "You"
                            ? "bg-pink-500 self-end"
                            : "bg-white/10"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <input
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
                    />
                    <button className="px-6 py-3 bg-pink-500 rounded-xl font-black text-xs uppercase tracking-widest">
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-white/40 flex items-center justify-center h-full">
                  Select a friend to start chatting.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SocialView;
