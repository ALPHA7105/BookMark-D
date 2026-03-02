import { useState } from "react";

const mockUsers = [
  { name: "Aisha Khan", avatar: "🪐", achievement: "Finished 5 Sci-Fi books this week" },
  { name: "Leo Martins", avatar: "📖", achievement: "Completed The Odyssey" },
  { name: "Zara Noor", avatar: "✨", achievement: "100 day reading streak!" },
  { name: "Daniel Cho", avatar: "🚀", achievement: "Started Fantasy Journey" },
  { name: "Maya Patel", avatar: "🌙", achievement: "Unlocked Night Reader badge" },
  { name: "Omar Saeed", avatar: "📚", achievement: "Finished 3 classics" },
  { name: "Sofia Rossi", avatar: "🧠", achievement: "Joined Philosophy Circle" },
  { name: "Jonah Blake", avatar: "🔥", achievement: "Completed Cyberpunk shelf" },
  { name: "Lina Chen", avatar: "🌌", achievement: "Read 2000 pages this month" },
  { name: "Arjun Mehta", avatar: "⚡", achievement: "Unlocked Speed Reader" }
];

export default function SocialView() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="flex h-full">

      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col gap-4">

        <h2 className="text-xl font-black mb-4">Community</h2>

        <button
          onClick={() => setActiveTab("feed")}
          className={`text-left p-3 rounded-xl transition ${
            activeTab === "feed" ? "bg-cyan-500/20" : "hover:bg-white/5"
          }`}
        >
          🏆 Achievements
        </button>

        <button
          onClick={() => setActiveTab("friends")}
          className={`text-left p-3 rounded-xl transition ${
            activeTab === "friends" ? "bg-cyan-500/20" : "hover:bg-white/5"
          }`}
        >
          ➕ Discover Readers
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`text-left p-3 rounded-xl transition ${
            activeTab === "chat" ? "bg-cyan-500/20" : "hover:bg-white/5"
          }`}
        >
          💬 Messages
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">

        {activeTab === "feed" && <AchievementsFeed />}
        {activeTab === "friends" && <DiscoverFriends />}
        {activeTab === "chat" && <MockChat />}

      </div>

    </div>
  );
}
