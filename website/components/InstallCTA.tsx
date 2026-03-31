export function InstallCTA() {
  return (
    <section className="py-20 sm:py-28 bg-curate-primary relative overflow-hidden">
      {/* Subtle gold blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-curate-gold/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-curate-gold animate-pulse inline-block" />
          Free — No account required
        </div>

        <h2 className="font-curate text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
          Never struggle with{" "}
          <span className="text-curate-gold italic">gift ideas</span>{" "}
          again.
        </h2>

        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Add ScoutCurate to Chrome in seconds and start finding perfect gifts instantly — for kids or adults. No account, no setup.
        </p>

        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-curate-gold hover:bg-curate-gold/90 text-curate-primary font-bold px-10 py-4 rounded-2xl text-base transition-all shadow-lg shadow-black/20 hover:scale-[1.02] mb-10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4a8 8 0 110 16A8 8 0 0112 4zm0 2a6 6 0 100 12A6 6 0 0012 6z"/>
          </svg>
          Add ScoutCurate to Chrome
        </a>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-curate-gold inline-block" /> Free Chrome Extension</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-curate-gold inline-block" /> Works on any Amazon page</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-curate-gold inline-block" /> Your data stays local</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-curate-gold inline-block" /> 25 gifts in &lt;30 seconds</span>
        </div>
      </div>
    </section>
  )
}
