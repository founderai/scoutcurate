export function InstallCTA() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Free — No account required
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
          Never struggle with{" "}
          <span className="text-scout-primary">gift ideas</span>{" "}
          again.
        </h2>

        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Add ScoutCurate to Chrome in seconds and start finding perfect gifts instantly — for kids or adults. No account, no setup.
        </p>

        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-scout-primary hover:bg-orange-500 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange-900/40 hover:scale-105 mb-8"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4a8 8 0 110 16A8 8 0 0112 4zm0 2a6 6 0 100 12A6 6 0 0012 6z"/>
          </svg>
          Add ScoutCurate to Chrome
        </a>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Free Chrome Extension</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Works on any Amazon page</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Your data stays local</span>
          <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 25 gifts in &lt;30 seconds</span>
        </div>
      </div>
    </section>
  )
}
