import { SOCIAL_PROFILES } from "../constants";

export default function SocialView() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-black mb-6">Community</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {SOCIAL_PROFILES.map(user => (
          <div
            key={user.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition"
          >
            <div className="text-4xl">{user.avatar}</div>

            <p className="font-bold mt-3">{user.name}</p>
            <p className="text-xs text-white/50">{user.badge}</p>

            <p className="text-xs mt-3">
              Currently reading:
              <span className="text-cyan-400 ml-1">
                {user.currentlyReading}
              </span>
            </p>

            <p className="text-xs text-white/40 mt-1">
              {user.compatibility}% taste match
            </p>

            <button className="mt-4 w-full bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-xs py-2">
              View Shelf
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
