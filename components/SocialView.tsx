import React, { useState } from "react";

type TabType = "feed" | "discover" | "messages";

const mockUsers = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  name: `Reader_${i + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
  achievement: [
    "Completed Dune",
    "Earned Cosmic Voyager Badge",
    "Finished 5 Fantasy Books",
    "Master Detective Badge Unlocked",
    "Cyberpunk Explorer Badge",
  ][i % 5],
}));

const mockMessages = [
  { from: "Reader_3", text: "That sci-fi shelf is insane." },
  { from: "You", text: "Right?? Fragmented Sky hit different." },
  { from: "Reader_3", text: "We should compare badges soon." },
];

const SocialView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  return (
    <div className="flex gap-8 min-h-[70vh]">

      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
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

        {/* FEED */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black mb-6">Community Achievements</h3>

            {mockUsers.map(user => (
              <div
                key={user.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex gap-4 items-center hover:bg-white/10 transition-all"
              >
                <img
                  src={user.avatar}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <p className="font-black">{user.name}</p>
                  <p className="text-sm text-white/60">
                    {user.achievement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DISCOVER */}
        {activeTab === "discover" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black mb-6">Discover Readers</h3>

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

        {/* MESSAGES */}
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
