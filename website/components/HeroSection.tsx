export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-100 rounded-full blur-3xl opacity-40 translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-scout-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-scout-primary animate-pulse inline-block" />
          Free Chrome Extension — AI-Powered Gift Finder
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
          Find the{" "}
          <span className="text-scout-primary font-scout">perfect gift</span>
          <br className="hidden sm:block" />
          {" "}in under 30 seconds.
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Just speak or type — ScoutCurate's AI instantly curates{" "}
          <strong className="text-gray-700">25 hand-picked Amazon gifts</strong> based on age, personality, and vibe.
          No account required. Every link is affiliate-tagged so you always get the best deal.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-scout-primary hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4a8 8 0 110 16A8 8 0 0112 4zm0 2a6 6 0 100 12A6 6 0 0012 6z"/>
            </svg>
            Add to Chrome — It's Free
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold px-6 py-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all text-base"
          >
            See how it works ↓
          </a>
        </div>

        {/* Mock extension preview */}
        <div className="relative inline-block">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-1.5 shadow-2xl shadow-gray-900/20">
            <div className="bg-white rounded-xl overflow-hidden w-[320px] sm:w-[380px]">
              {/* Mock browser bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 mx-3 bg-white rounded text-xs text-gray-400 px-2 py-0.5 text-left">scoutcurate.com</div>
              </div>
              {/* Mock popup UI */}
              <div className="p-4 bg-orange-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-scout-primary flex items-center justify-center text-white text-[10px] font-black">S</div>
                    <span className="font-black text-sm text-gray-800">Scout</span>
                    <span className="text-[10px] text-gray-400 ml-1">Kids Gifts</span>
                  </div>
                  <div className="flex rounded-full bg-orange-100 p-0.5 text-[9px] font-bold">
                    <div className="bg-scout-primary text-white px-2 py-0.5 rounded-full">Scout</div>
                    <div className="text-gray-400 px-2 py-0.5">Curate</div>
                  </div>
                </div>
                <div className="text-center py-3">
                  <div className="w-14 h-14 rounded-full bg-scout-primary mx-auto flex items-center justify-center text-white shadow-md shadow-orange-200 mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </div>
                  <p className="text-[10px] text-gray-400">"She's 7, loves dinosaurs..."</p>
                </div>
                <div className="bg-scout-primary text-white text-xs font-bold text-center py-2 rounded-lg">✨ Scout 25 Gifts</div>
              </div>
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            25 gifts ⚡
          </div>
        </div>
      </div>
    </section>
  )
}
