import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Gift Ideas Blog — ScoutCurate",
  description: "Expert gift guides for kids and adults. AI-powered recommendations, honest reviews, and curated picks from ScoutCurate.",
}

const posts = [
  {
    slug: "educational-toys-5-year-olds",
    title: "10 Educational Toys for 5-Year-Olds That Aren't Just More Plastic",
    excerpt: "Tired of toys that break in a week and end up in a landfill? We rounded up the best STEM and creativity toys that actually hold a child's attention — and their value.",
    tag: "Scout · Kids",
    tagColor: "bg-orange-100 text-scout-primary",
    date: "March 2026",
    readTime: "5 min read",
  },
  {
    slug: "gift-guide-person-who-has-everything",
    title: "The Ultimate Gift Guide for the 'Person Who Has Everything'",
    excerpt: "You know the type. They buy what they want when they want it. Here's how to find a gift that actually surprises them — unique home gadgets, premium coffee gear, and more.",
    tag: "Curate · Adults",
    tagColor: "bg-yellow-100 text-yellow-700",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    slug: "smart-kitchen-appliances-2026",
    title: "Why 2026 is the Year of the Smart Kitchen: 5 Must-Have Appliances",
    excerpt: "From AI-assisted espresso machines to countertop convection ovens that connect to your phone — the kitchen gift game has leveled up massively. Here are the 5 worth buying.",
    tag: "Curate · Tech",
    tagColor: "bg-yellow-100 text-yellow-700",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    slug: "trending-character-toys-birthday-2026",
    title: "The Top Trending Character Toys for Birthday Parties This Season",
    excerpt: "Planning a birthday party? We tracked down the hottest character toys of 2026 that kids are actually asking for — before they sell out.",
    tag: "Scout · Kids",
    tagColor: "bg-orange-100 text-scout-primary",
    date: "March 2026",
    readTime: "5 min read",
  },
  {
    slug: "how-we-use-ai-gift-searching",
    title: "How We Use AI to Save You Hours of Gift Searching",
    excerpt: "Gift searching is broken. You spend 2 hours on Amazon and still aren't sure. Here's how ScoutCurate's Scout and Curate modes use AI to fix that in under 30 seconds.",
    tag: "About ScoutCurate",
    tagColor: "bg-gray-100 text-gray-600",
    date: "March 2026",
    readTime: "4 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Gift Ideas &amp; Guides</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Expert picks for every occasion — kids, adults, and everyone in between.
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${post.tagColor}`}>
                {post.tag}
              </span>
              <span className="text-xs text-gray-400">{post.date} · {post.readTime}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-scout-primary transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
            <span className="inline-block mt-3 text-sm font-semibold text-scout-primary group-hover:underline">
              Read more →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
        <h2 className="font-black text-xl text-gray-900 mb-2">Find gifts in 30 seconds</h2>
        <p className="text-gray-500 text-sm mb-5">Instead of reading 10 articles, just describe the person and let AI do the work.</p>
        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-scout-primary hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Add ScoutCurate to Chrome — Free
        </a>
        <p className="text-xs text-gray-400 mt-3">As an Amazon Associate, ScoutCurate earns from qualifying purchases.</p>
      </div>
    </div>
  )
}
