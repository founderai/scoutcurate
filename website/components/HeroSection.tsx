export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-curate-bg pt-16 pb-20 sm:pt-24 sm:pb-32">
      {/* Subtle background texture blobs */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-curate-gold/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-curate-primary/5 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-rose-gold-light border border-rose-gold/30 text-curate-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-gold animate-pulse inline-block" />
              Free Chrome Extension — AI-Powered Gift Finder
            </div>

            {/* Headline */}
            <h1 className="font-curate text-4xl sm:text-5xl lg:text-6xl font-bold text-curate-primary leading-tight mb-6 tracking-tight">
              The perfect gift,<br />
              <span className="text-rose-gold italic">found in seconds.</span>
            </h1>

            <p className="text-base sm:text-lg text-curate-muted max-w-lg mb-10 leading-relaxed">
              Speak or type a description — ScoutCurate's AI curates{" "}
              <strong className="text-curate-primary font-semibold">25 hand-picked Amazon gifts</strong>{" "}
              matched to any age, personality, or vibe. No account required.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-curate-primary hover:bg-curate-primary/90 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-curate-primary/20 hover:shadow-curate-primary/30 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4a8 8 0 110 16A8 8 0 0112 4zm0 2a6 6 0 100 12A6 6 0 0012 6z"/>
                </svg>
                Add to Chrome — It's Free
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 text-curate-muted hover:text-curate-primary font-semibold px-6 py-4 rounded-2xl border border-curate-border hover:border-curate-primary/40 transition-all text-base"
              >
                See how it works ↓
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-5">
              {["No account needed", "25 gifts in &lt;30s", "Free forever"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-curate-muted">
                  <span className="text-rose-gold font-bold">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </span>
              ))}
            </div>
          </div>

          {/* Right — mock extension preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-rose-gold/15 blur-2xl scale-105 pointer-events-none" />

              <div className="relative bg-white rounded-3xl shadow-2xl shadow-curate-primary/15 overflow-hidden w-[300px] sm:w-[340px] border border-curate-border">
                {/* Mock popup header */}
                <div className="px-4 pt-4 pb-3 bg-curate-bg border-b border-curate-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-curate-primary flex items-center justify-center text-white text-[10px] font-black">C</div>
                      <span className="font-curate font-bold text-sm text-curate-primary">Scout<span className="text-curate-gold">Curate</span></span>
                    </div>
                  </div>
                  {/* Toggle pill */}
                  <div className="flex rounded-2xl bg-curate-subtle p-1">
                    <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10px] font-bold text-curate-muted">
                      SCOUT <span className="opacity-60 font-normal">Kids</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-curate-primary text-white text-[10px] font-bold shadow-sm">
                      CURATE <span className="opacity-80 font-normal">Adults</span>
                    </div>
                  </div>
                </div>

                {/* Mock gift cards */}
                <div className="p-3 bg-curate-bg space-y-2">
                  {[
                    { name: "Ember Temperature Mug", price: "$79–$99", cat: "Kitchen" },
                    { name: "Silk Sleep Mask Set", price: "$25–$40", cat: "Wellness" },
                    { name: "Leather Journal", price: "$30–$55", cat: "Stationery" },
                  ].map((g, i) => (
                    <div key={i} className="bg-white rounded-xl px-3 py-2.5 border border-curate-border shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-curate-subtle text-curate-primary">{g.cat}</span>
                        <span className="text-[9px] font-semibold text-curate-gold">{g.price}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-curate-primary">{i + 1}. {g.name}</p>
                    </div>
                  ))}
                  <div className="text-center pt-1">
                    <span className="text-[9px] text-curate-muted">+ 22 more gifts</span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-rose-gold text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                25 gifts
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
