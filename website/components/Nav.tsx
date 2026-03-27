import Link from "next/link"

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-scout-primary flex items-center justify-center text-white font-black text-sm">
            SC
          </div>
          <span className="font-bold text-gray-900">
            Scout<span className="text-scout-primary">Curate</span>
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/#how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            How It Works
          </Link>
          <Link href="/blog" className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            Blog
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            Privacy
          </Link>
          <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
            Terms
          </Link>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-scout-primary hover:bg-orange-500 text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors"
          >
            Add to Chrome
          </a>
        </div>
      </div>
    </nav>
  )
}
