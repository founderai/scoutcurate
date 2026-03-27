const scoutFeatures = [
  { emoji: "🧒", text: "Age-appropriate safety filtering" },
  { emoji: "🎓", text: "Educational & skill-building picks" },
  { emoji: "🚫", text: "Accounts for what they hate" },
  { emoji: "⭐", text: "Parent-reviewed, highly-rated items" },
  { emoji: "🎨", text: "Covers STEM, arts, outdoor, books & more" },
]

const curateFeatures = [
  { emoji: "💎", text: "Luxury & premium quality focus" },
  { emoji: "✨", text: "Matches their aesthetic vibe" },
  { emoji: "🏠", text: "Tech, Home/Kitchen, Beauty & Wellness" },
  { emoji: "📊", text: "Highly-rated, pro-curated picks" },
  { emoji: "🎯", text: "Explains exactly why it's the right gift" },
]

export function ScoutCurateSplit() {
  return (
    <section className="py-20 sm:py-28 bg-white" id="scout">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Two modes. One extension.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Switch between Scout and Curate with one tap — same voice-first workflow, totally different AI focus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Scout Card */}
          <div id="scout" className="rounded-3xl overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="bg-scout-primary px-6 py-5">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">🧒</span>
                <h3 className="font-scout font-black text-2xl text-white">Scout</h3>
              </div>
              <p className="text-orange-100 text-sm">Perfect gifts for kids, found in seconds</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Just say <em>"She's 7, loves dinosaurs and painting, hates loud toys"</em> — Scout's AI parses age, interests, and dislikes to find gifts that parents love and kids go wild for.
              </p>
              <ul className="space-y-3">
                {scoutFeatures.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-lg w-7 flex-shrink-0">{f.emoji}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-white rounded-2xl p-4 border border-orange-100">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1.5 tracking-wide">Example prompt</p>
                <p className="text-sm text-gray-700 italic">"He's 10, obsessed with Minecraft and soccer, doesn't like anything too babyish"</p>
              </div>
            </div>
          </div>

          {/* Curate Card */}
          <div id="curate" className="rounded-3xl overflow-hidden border-2 border-yellow-800/20 bg-gradient-to-br from-curate-bg to-gray-900">
            <div className="bg-curate-bg px-6 py-5 border-b border-yellow-800/20">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">👑</span>
                <h3 className="font-curate font-bold text-2xl text-curate-primary">Curate</h3>
              </div>
              <p className="text-curate-accent/70 text-sm">Sophisticated gifts for adults, curated with taste</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                Just say <em>"She loves minimalist home decor, works in tech, obsessed with wellness"</em> — Curate's AI thinks like a personal stylist to find gifts that feel intentional.
              </p>
              <ul className="space-y-3">
                {curateFeatures.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-lg w-7 flex-shrink-0">{f.emoji}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-white/5 rounded-2xl p-4 border border-yellow-800/20">
                <p className="text-xs text-curate-accent/50 uppercase font-semibold mb-1.5 tracking-wide">Example prompt</p>
                <p className="text-sm text-curate-accent italic">"My partner is a 35-year-old architect who loves Japanese design, coffee, and hiking"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
