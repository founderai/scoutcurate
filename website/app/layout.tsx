import type { Metadata } from "next"
import "./globals.css"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: "ScoutCurate — AI Gift Finder | Kids & Adult Gifts on Amazon",
  description:
    "ScoutCurate uses AI to find 25 perfect gifts in seconds. Scout finds age-appropriate gifts for kids. Curate finds sophisticated gifts for adults. Free Chrome extension.",
  keywords: "AI gift finder, kids gifts, adult gifts, Amazon, Chrome extension, gift ideas",
  openGraph: {
    title: "ScoutCurate — AI Gift Finder",
    description: "Scout finds gifts for kids. Curate finds gifts for adults. Powered by AI.",
    url: "https://scoutcurate.com",
    siteName: "ScoutCurate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScoutCurate — AI Gift Finder",
    description: "Scout finds gifts for kids. Curate finds gifts for adults. Powered by AI.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
