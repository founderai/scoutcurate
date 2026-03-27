import { useState, useEffect, useCallback } from "react"
import { Sparkles, RotateCcw, Baby, Crown, ChevronDown, ChevronUp, Loader2, Shuffle, Copy, Check } from "lucide-react"

import { VoiceRecorder } from "~components/VoiceRecorder"
import { ProductCard } from "~components/ProductCard"
import { generateKidsGifts } from "~lib/generateKidsGifts"
import { generateAdultGifts } from "~lib/generateAdultGifts"
import { getMode, setMode, getLastResults, saveLastResults } from "~lib/storage"
import type { GiftProduct, Mode } from "~lib/types"

import "~style.css"

type AppView = "main" | "results"

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Popup() {
  const [mode, setActiveMode] = useState<Mode>("scout")
  const [transcript, setTranscript] = useState("")
  const [loading, setLoading] = useState(false)
  const [allProducts, setAllProducts] = useState<GiftProduct[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<GiftProduct[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<AppView>("main")
  const [showAll, setShowAll] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([getMode(), getLastResults()]).then(([savedMode, lastResults]) => {
      setActiveMode(savedMode)
      if (lastResults && lastResults.products.length > 0) {
        setAllProducts(lastResults.products)
        setDisplayedProducts(lastResults.products)
        setTranscript(lastResults.transcript)
        setView("results")
      }
      setIsInitialized(true)
    })
  }, [])

  const handleModeSwitch = async (newMode: Mode) => {
    setActiveMode(newMode)
    await setMode(newMode)
    setAllProducts([])
    setDisplayedProducts([])
    setTranscript("")
    setError(null)
    setView("main")
    setActiveCategory("All")
    setShowAll(false)
  }

  const handleTranscript = useCallback((text: string) => {
    setTranscript((prev) => (prev ? prev + " " + text : text))
  }, [])

  const handleGenerate = async () => {
    if (!transcript.trim()) return
    setLoading(true)
    setError(null)
    setAllProducts([])
    setDisplayedProducts([])
    setActiveCategory("All")
    setShowAll(false)

    const result =
      mode === "scout"
        ? await generateKidsGifts(transcript)
        : await generateAdultGifts(transcript)

    setLoading(false)

    if (result.success) {
      setAllProducts(result.products)
      setDisplayedProducts(result.products)
      setView("results")
      await saveLastResults({ products: result.products, transcript })
    } else {
      const failed = result as { success: false; error: string }
      setError(failed.error)
    }
  }

  const handleShuffle = () => {
    const base = activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory)
    setDisplayedProducts(shuffleArray(base))
    setShowAll(false)
  }

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category)
    setShowAll(false)
    setDisplayedProducts(
      category === "All" ? allProducts : allProducts.filter((p) => p.category === category)
    )
  }

  const handleCopy = async () => {
    const text = displayedProducts
      .map((p, i) => `${i + 1}. ${p.name} — ${p.priceRange}`)
      .join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = async () => {
    setTranscript("")
    setAllProducts([])
    setDisplayedProducts([])
    setError(null)
    setView("main")
    setActiveCategory("All")
    setShowAll(false)
    await saveLastResults({ products: [], transcript: "" })
  }

  const isScout = mode === "scout"
  const categories = allProducts.length > 0
    ? ["All", ...Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)))]
    : []
  const visibleProducts = showAll ? displayedProducts : displayedProducts.slice(0, 6)

  if (!isInitialized) {
    return (
      <div className={`w-[400px] h-[200px] flex items-center justify-center ${isScout ? "bg-scout-bg" : "bg-curate-bg"}`}>
        <Loader2 className={`animate-spin ${isScout ? "text-scout-primary" : "text-curate-primary"}`} size={28} />
      </div>
    )
  }

  return (
    <div
      className={`
        w-[420px] max-h-[600px] overflow-y-auto flex flex-col
        ${isScout ? "bg-scout-bg font-scout" : "bg-curate-bg font-curate text-curate-accent"}
      `}
    >
      {/* HEADER */}
      <header
        className={`
          sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b
          ${isScout ? "bg-scout-bg border-orange-100" : "bg-curate-bg border-curate-secondary"}
        `}
      >
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black
            ${isScout ? "bg-scout-primary" : "bg-curate-primary"}`}>
            {isScout ? "S" : "C"}
          </div>
          <div>
            <span className={`font-black text-sm ${isScout ? "text-gray-800" : "text-curate-accent"}`}>
              {isScout ? "Scout" : "Curate"}
            </span>
            <span className={`text-[10px] ml-1.5 ${isScout ? "text-gray-400" : "text-curate-muted"}`}>
              {isScout ? "Kids Gifts" : "Adult Gifts"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex rounded-full p-0.5 text-[10px] font-bold ${isScout ? "bg-orange-100" : "bg-curate-secondary"}`}>
            <button
              onClick={() => handleModeSwitch("scout")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                isScout ? "bg-scout-primary text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Baby size={10} /> Scout
            </button>
            <button
              onClick={() => handleModeSwitch("curate")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                !isScout ? "bg-curate-primary text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Crown size={10} /> Curate
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW */}
      {view === "main" && (
        <div className="flex-1 flex flex-col gap-4 p-4">
          <div className="text-center pt-1">
            <p className={`text-xs leading-relaxed ${isScout ? "text-gray-500" : "text-curate-muted"}`}>
              {isScout
                ? "Describe the child — their age, what they love, what they hate."
                : "Describe the person — their vibe, lifestyle, or what they're into."}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <VoiceRecorder onTranscript={handleTranscript} mode={mode} disabled={loading} />
            <p className={`text-[10px] ${isScout ? "text-gray-400" : "text-curate-muted"}`}>or type below</p>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              isScout
                ? "e.g. She's 7 years old, loves dinosaurs and painting, hates loud toys..."
                : "e.g. She's into minimalist home decor, loves wellness, works in tech..."
            }
            rows={3}
            className={`
              w-full rounded-xl px-3 py-2.5 text-xs outline-none border resize-none
              ${isScout
                ? "bg-white border-orange-200 text-gray-800 placeholder-gray-300 focus:border-scout-primary"
                : "bg-curate-card border-curate-secondary text-curate-accent placeholder-gray-600 focus:border-curate-primary"
              }
            `}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !transcript.trim()}
            className={`
              flex items-center justify-center gap-2 w-full py-3 rounded-xl
              font-bold text-sm text-white transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${isScout
                ? "bg-scout-primary hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-200"
                : "bg-curate-primary hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-900/30"
              }
            `}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Finding gifts...</>
            ) : (
              <><Sparkles size={16} /> {isScout ? "Scout 25 Gifts" : "Curate 25 Gifts"}</>
            )}
          </button>

          <p className={`text-center text-[9px] ${isScout ? "text-gray-300" : "text-gray-600"}`}>
            <a href="https://scoutcurate.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Privacy</a>
            {" · "}
            <a href="https://scoutcurate.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Terms</a>
            {" · As an Amazon Associate, I earn from qualifying purchases."}
          </p>
        </div>
      )}

      {/* RESULTS VIEW */}
      {view === "results" && allProducts.length > 0 && (
        <div className="flex-1 flex flex-col gap-3 p-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-bold text-sm ${isScout ? "font-scout text-gray-800" : "font-curate text-curate-accent"}`}>
                {displayedProducts.length} Gifts
              </h2>
              <p className={`text-[10px] truncate max-w-[190px] ${isScout ? "text-gray-400" : "text-curate-muted"}`}>
                "{transcript.slice(0, 45)}{transcript.length > 45 ? "..." : ""}"
              </p>
            </div>
            <button
              onClick={handleReset}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-colors
                ${isScout
                  ? "border-orange-200 text-gray-500 hover:border-scout-primary hover:text-scout-primary"
                  : "border-curate-secondary text-curate-muted hover:border-curate-primary hover:text-curate-accent"
                }`}
            >
              <RotateCcw size={11} /> New Search
            </button>
          </div>

          {/* Category filter pills */}
          {categories.length > 2 && (
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    activeCategory === cat
                      ? isScout
                        ? "bg-scout-primary text-white border-scout-primary"
                        : "bg-curate-primary text-white border-curate-primary"
                      : isScout
                        ? "bg-white border-orange-200 text-gray-500 hover:border-scout-primary hover:text-scout-primary"
                        : "bg-curate-card border-curate-secondary text-curate-muted hover:border-curate-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Product cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {visibleProducts.map((product, i) => (
              <ProductCard key={`${activeCategory}-${i}`} product={product} index={i} mode={mode} />
            ))}
          </div>

          {/* Show more/less */}
          {displayedProducts.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className={`
                flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border text-xs font-semibold transition-colors
                ${isScout
                  ? "border-orange-200 text-scout-primary hover:bg-orange-50"
                  : "border-curate-secondary text-curate-accent hover:bg-curate-card"
                }
              `}
            >
              {showAll
                ? <><ChevronUp size={13} /> Show Less</>
                : <><ChevronDown size={13} /> Show All {displayedProducts.length} Gifts</>
              }
            </button>
          )}

          {/* Shuffle + Copy row */}
          <div className="flex gap-2">
            <button
              onClick={handleShuffle}
              className={`
                flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors
                ${isScout
                  ? "border-orange-200 text-scout-primary hover:bg-orange-50"
                  : "border-curate-secondary text-curate-accent hover:bg-curate-card"
                }
              `}
            >
              <Shuffle size={12} /> Shuffle
            </button>
            <button
              onClick={handleCopy}
              className={`
                flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl border text-xs font-semibold transition-all
                ${copied
                  ? "border-green-400 text-green-600 bg-green-50"
                  : isScout
                    ? "border-orange-200 text-scout-primary hover:bg-orange-50"
                    : "border-curate-secondary text-curate-accent hover:bg-curate-card"
                }
              `}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy List</>}
            </button>
          </div>

          {/* Footer */}
          <p className={`text-center text-[9px] pb-2 ${isScout ? "text-gray-300" : "text-gray-700"}`}>
            <a href="https://scoutcurate.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Privacy</a>
            {" · "}
            <a href="https://scoutcurate.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">Terms</a>
            {" · Amazon affiliate · prices vary"}
          </p>
        </div>
      )}
    </div>
  )
}
