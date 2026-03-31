const scoutFeatures = [
  "Age-appropriate safety filtering",
  "Educational & skill-building picks",
  "Accounts for what they hate",
  "Parent-reviewed, highly-rated items",
  "Covers STEM, arts, outdoor, books & more",
]

const curateFeatures = [
  "Luxury & premium quality focus",
  "Matches their aesthetic vibe",
  "Tech, Home, Beauty & Wellness",
  "Highly-rated, pro-curated picks",
  "Explains exactly why it's the right gift",
]

export function ScoutCurateSplit() {
  return (
    <section className="py-20 sm:py-28 bg-curate-bg" id="scout">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="font-curate text-3xl sm:text-4xl font-bold text-curate-primary mb-4">
            Two modes. One extension.
          </h2>
          <p className="text-curate-muted text-lg max-w-xl mx-auto">
            Switch between Scout and Curate with one tap — same voice-first workflow, totally different AI focus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Scout Card */}
          <div id="scout" className="rounded-3xl overflow-hidden border border-scout-primary/20 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-scout-primary px-6 py-5">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-scout font-black text-2xl text-white">Scout</h3>
              </div>
              <p className="text-orange-100 text-sm font-medium">Perfect gifts for kids, found in seconds</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-curate-muted mb-5 leading-relaxed">
                Just say <em className="text-curate-primary not-italic font-medium">"She's 7, loves dinosaurs and painting, hates loud toys"</em> — Scout's AI parses age, interests, and dislikes to surface gifts kids actually want.
              </p>
              <ul className="space-y-2.5">
                {scoutFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-curate-primary">
                    <span className="w-1 h-1 rounded-full bg-scout-primary flex-shrink-0 inline-block" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-scout-subtle rounded-2xl p-4 border border-scout-primary/10">
                <p className="text-[10px] text-curate-muted uppercase font-bold mb-1.5 tracking-widest">Example prompt</p>
                <p className="text-sm text-curate-primary italic">"He's 10, obsessed with Minecraft and soccer, doesn't like anything too babyish"</p>
              </div>
            </div>
          </div>

          {/* Curate Card */}
          <div id="curate" className="rounded-3xl overflow-hidden border border-curate-border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-curate-primary px-6 py-5">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-curate font-bold text-2xl text-curate-gold">Curate</h3>
              </div>
              <p className="text-curate-gold/70 text-sm font-medium">Sophisticated gifts for adults, curated with taste</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-curate-muted mb-5 leading-relaxed">
                Just say <em className="text-curate-primary not-italic font-medium">"She loves minimalist home decor, works in tech, obsessed with wellness"</em> — Curate's AI thinks like a personal stylist.
              </p>
              <ul className="space-y-2.5">
                {curateFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-curate-primary">
                    <span className="w-1 h-1 rounded-full bg-curate-gold flex-shrink-0 inline-block" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-curate-subtle rounded-2xl p-4 border border-curate-border">
                <p className="text-[10px] text-curate-muted uppercase font-bold mb-1.5 tracking-widest">Example prompt</p>
                <p className="text-sm text-curate-primary italic">"My partner is a 35-year-old architect who loves Japanese design, coffee, and hiking"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
