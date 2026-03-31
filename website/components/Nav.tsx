import Link from "next/link"
import Image from "next/image"

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-curate-bg/95 backdrop-blur border-b border-curate-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-28 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/sxs-logo.png"
            alt="ScoutCurate"
            width={400}
            height={120}
            className="h-24 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/#how-it-works" className="text-curate-muted hover:text-curate-primary transition-colors hidden sm:block font-medium">
            How It Works
          </Link>
          <Link href="/blog" className="text-curate-muted hover:text-curate-primary transition-colors hidden sm:block font-medium">
            Blog
          </Link>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-curate-primary hover:bg-curate-primary/90 text-white font-semibold text-sm px-5 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
          >
            Add to Chrome
          </a>
        </div>
      </div>
    </nav>
  )
}
