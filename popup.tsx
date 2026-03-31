import { useState, useEffect, useCallback } from "react"
import {
  Sparkles, RotateCcw, Baby, Crown, ChevronDown, ChevronUp,
  Loader2, Shuffle, Copy, Check, Gem, Shirt, X, Gift
} from "lucide-react"

import { VoiceRecorder } from "~components/VoiceRecorder"
import { ProductCard } from "~components/ProductCard"
import { generateKidsGifts } from "~lib/generateKidsGifts"
import { generateAdultGifts } from "~lib/generateAdultGifts"
import { getMode, setMode, getLastResults, saveLastResults, getGiftMode, saveGiftMode } from "~lib/storage"
import type { GiftProduct, Mode, GiftModeState, GiftCategory, GiftRecipient, GiftBudget } from "~lib/types"

import "~style.css"

type AppView = "main" | "results" | "giftmode"

const JEWELRY_KEYWORDS = ["necklace","bracelet","ring","earring","pendant","watch","jewelry","jewel","chain","bangle","anklet","brooch"]
const CLOTHING_KEYWORDS = ["shirt","dress","hoodie","jacket","jeans","outfit","skirt","blouse","sweater","cardigan","pants","coat","shorts","top","tee","clothing"]

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function applyGiftModeFilter(products: GiftProduct[], gm: GiftModeState): GiftProduct[] {
  if (!gm.enabled || !gm.category) return products
  const keywords = gm.category === "jewelry" ? JEWELRY_KEYWORDS : CLOTHING_KEYWORDS
  return products.filter((p) => {
    const haystack = `${p.name} ${p.description} ${p.category}`.toLowerCase()
    return keywords.some((kw) => haystack.includes(kw))
  })
}

export default function Popup() {
  const [mode, setActiveMode] = useState<Mode>("curate")
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
  const [giftMode, setGiftModeState] = useState<GiftModeState>({
    enabled: false, category: null, recipient: null, budget: null,
  })

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode)
  }, [mode])

  useEffect(() => {
    Promise.all([getMode(), getLastResults(), getGiftMode()]).then(([savedMode, lastResults, savedGm]) => {
      setActiveMode(savedMode)
      document.documentElement.setAttribute("data-theme", savedMode)
      setGiftModeState(savedGm)
      if (lastResults && lastResults.products.length > 0) {
        setAllProducts(lastResults.products)
        const filtered = applyGiftModeFilter(lastResults.products, savedGm)
        setDisplayedProducts(filtered)
        setTranscript(lastResults.transcript)
        setView("results")
      }
      setIsInitialized(true)
    })
  }, [])

  const handleModeSwitch = async (newMode: Mode) => {
    setActiveMode(newMode)
    document.documentElement.setAttribute("data-theme", newMode)
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
      const filtered = applyGiftModeFilter(result.products, giftMode)
      setDisplayedProducts(filtered)
      setView("results")
      await saveLastResults({ products: result.products, transcript })
    } else {
      const failed = result as { success: false; error: string }
      setError(failed.error)
    }
  }

  const handleShuffle = () => {
    const base = activeCategory === "All"
      ? displayedProducts
      : allProducts.filter((p) => p.category === activeCategory)
    setDisplayedProducts(shuffleArray(base))
    setShowAll(false)
  }

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category)
    setShowAll(false)
    const base = category === "All" ? allProducts : allProducts.filter((p) => p.category === category)
    setDisplayedProducts(applyGiftModeFilter(base, giftMode))
  }

  const handleCopy = async () => {
    const text = displayedProducts.map((p, i) => `${i + 1}. ${p.name} — ${p.priceRange}`).join("\n")
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

  const handleGiftModeSelect = async (category: GiftCategory) => {
    const next: GiftModeState = { ...giftMode, enabled: true, category }
    setGiftModeState(next)
    await saveGiftMode(next)
    if (allProducts.length > 0) {
      setDisplayedProducts(applyGiftModeFilter(allProducts, next))
      setView("results")
    } else {
      setView("main")
    }
  }

  const handleGiftModeExit = async () => {
    const next: GiftModeState = { enabled: false, category: null, recipient: null, budget: null }
    setGiftModeState(next)
    await saveGiftMode(next)
    if (allProducts.length > 0) {
      setDisplayedProducts(allProducts)
      setView("results")
    }
  }

  const handleGiftFilterChange = async (key: "recipient" | "budget", value: string | null) => {
    const next = { ...giftMode, [key]: value }
    setGiftModeState(next)
    await saveGiftMode(next)
  }

  const isScout = mode === "scout"
  const categories = allProducts.length > 0
    ? ["All", ...Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)))]
    : []
  const visibleProducts = showAll ? displayedProducts : displayedProducts.slice(0, 6)

  // ─── Shared inline styles ───
  const S = {
    root:        { background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-ui)" } as React.CSSProperties,
    header:      { background: "var(--bg)", borderBottomColor: "var(--border)" } as React.CSSProperties,
    pill:        { background: "var(--bg-subtle)" } as React.CSSProperties,
    pillActive:  { background: "var(--primary)", color: "var(--btn-text)" } as React.CSSProperties,
    pillInactive:{ color: "var(--text-muted)" } as React.CSSProperties,
    textarea:    { background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text)" } as React.CSSProperties,
    btn:         { background: "var(--primary)", color: "var(--btn-text)" } as React.CSSProperties,
    btnOutline:  { borderColor: "var(--border)", color: "var(--primary)", background: "transparent" } as React.CSSProperties,
    btnGreen:    { borderColor: "#4CAF50", color: "#2E7D32", background: "#F0FFF4" } as React.CSSProperties,
    muted:       { color: "var(--text-muted)" } as React.CSSProperties,
    accent:      { color: "var(--accent)" } as React.CSSProperties,
    catActive:   { background: "var(--primary)", color: "var(--btn-text)", borderColor: "var(--primary)" } as React.CSSProperties,
    catInactive: { background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-muted)" } as React.CSSProperties,
    card:        { background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" } as React.CSSProperties,
    heading:     { fontFamily: "var(--font-heading)", color: "var(--text)" } as React.CSSProperties,
  }

  if (!isInitialized) {
    return (
      <div className="w-[420px] h-[220px] flex items-center justify-center" style={S.root}>
        <Loader2 className="animate-spin" size={28} style={{ color: "var(--primary)" }} />
      </div>
    )
  }

  return (
    <div className="w-[420px] max-h-[600px] overflow-y-auto flex flex-col" style={S.root}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-10 px-4 pt-4 pb-3 border-b" style={S.header}>
        {/* Logo row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
              style={{ background: "var(--primary)" }}>
              {isScout ? "S" : "C"}
            </div>
            <span className="font-bold text-sm theme-heading" style={S.heading}>
              Scout<span style={S.accent}>Curate</span>
            </span>
          </div>

          {/* Gift Mode badge */}
          {giftMode.enabled && giftMode.category && (
            <button
              onClick={() => setView("giftmode")}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all"
              style={{ borderColor: "var(--accent)", color: "var(--accent)", background: "var(--bg-subtle)" }}
            >
              <Gift size={10} />
              Gift Mode: {giftMode.category === "jewelry" ? "Jewelry" : "Clothing"}
            </button>
          )}
        </div>

        {/* ─── LARGE PREMIUM MODE TOGGLE ─── */}
        <div className="relative flex rounded-2xl p-1 w-full" style={{ background: "var(--bg-subtle)" }}>
          {/* Sliding pill */}
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-in-out"
            style={{
              background: "var(--primary)",
              boxShadow: "var(--shadow-h)",
              left: isScout ? "4px" : "calc(50%)",
            }}
          />
          <button
            onClick={() => handleModeSwitch("scout")}
            className="relative flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-colors duration-200 z-10"
            style={isScout ? { color: "var(--btn-text)" } : { color: "var(--text-muted)" }}
          >
            <Baby size={13} />
            <span>SCOUT</span>
            <span className="text-[9px] font-normal opacity-70">Kids</span>
          </button>
          <button
            onClick={() => handleModeSwitch("curate")}
            className="relative flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-colors duration-200 z-10"
            style={!isScout ? { color: "var(--btn-text)" } : { color: "var(--text-muted)" }}
          >
            <Crown size={13} />
            <span>CURATE</span>
            <span className="text-[9px] font-normal opacity-70">Adults</span>
          </button>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex gap-1 mt-2">
          {(["main", "results", "giftmode"] as AppView[]).map((v) => {
            const labels: Record<AppView, string> = { main: "Search", results: "Results", giftmode: "Gift Mode" }
            const active = view === v
            const hasResults = v === "results" && allProducts.length === 0
            return (
              <button
                key={v}
                onClick={() => !hasResults && setView(v)}
                disabled={hasResults}
                className="flex-1 text-[10px] font-semibold py-1 rounded-lg transition-all duration-150"
                style={active
                  ? { background: "var(--primary)", color: "var(--btn-text)" }
                  : { background: "transparent", color: hasResults ? "var(--border)" : "var(--text-muted)" }
                }
              >
                {labels[v]}
              </button>
            )
          })}
        </div>
      </header>

      {/* ─── GIFT MODE PANEL ─── */}
      {view === "giftmode" && (
        <div className="flex-1 flex flex-col gap-4 p-4">
          <div>
            <h2 className="text-base font-bold theme-heading mb-0.5" style={S.heading}>Gift Mode</h2>
            <p className="text-xs" style={S.muted}>Lock results to a specific product category.</p>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 gap-3">
            {([
              { key: "jewelry" as GiftCategory, icon: Gem, label: "Jewelry", sub: "Rings, necklaces, watches" },
              { key: "clothing" as GiftCategory, icon: Shirt, label: "Clothing", sub: "Dresses, hoodies, jackets" },
            ]).map(({ key, icon: Icon, label, sub }) => {
              const active = giftMode.enabled && giftMode.category === key
              return (
                <button
                  key={key}
                  onClick={() => handleGiftModeSelect(key)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02]"
                  style={active
                    ? { borderColor: "var(--primary)", background: "var(--bg-subtle)", boxShadow: "var(--shadow-h)" }
                    : { borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow)" }
                  }
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: active ? "var(--primary)" : "var(--bg-subtle)" }}>
                    <Icon size={18} style={{ color: active ? "var(--btn-text)" : "var(--primary)" }} />
                  </div>
                  <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{label}</span>
                  <span className="text-[10px] text-center leading-tight" style={S.muted}>{sub}</span>
                  {active && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--primary)", color: "var(--btn-text)" }}>
                      ACTIVE
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-bold mb-1.5" style={{ color: "var(--text)" }}>Recipient</p>
              <div className="flex gap-2">
                {([
                  { v: "her", label: "Her" },
                  { v: "him", label: "Him" },
                  { v: "unisex", label: "Unisex" },
                ] as { v: GiftRecipient; label: string }[]).map(({ v, label }) => (
                  <button key={v}
                    onClick={() => handleGiftFilterChange("recipient", giftMode.recipient === v ? null : v)}
                    className="flex-1 py-1.5 rounded-xl border text-[11px] font-semibold transition-all"
                    style={giftMode.recipient === v ? S.catActive : S.catInactive}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold mb-1.5" style={{ color: "var(--text)" }}>Budget</p>
              <div className="flex gap-2">
                {([
                  { v: "under50", label: "Under $50" },
                  { v: "50to100", label: "$50–$100" },
                  { v: "over100", label: "$100+" },
                ] as { v: GiftBudget; label: string }[]).map(({ v, label }) => (
                  <button key={v}
                    onClick={() => handleGiftFilterChange("budget", giftMode.budget === v ? null : v)}
                    className="flex-1 py-1.5 rounded-xl border text-[10px] font-semibold transition-all"
                    style={giftMode.budget === v ? S.catActive : S.catInactive}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exit Gift Mode */}
          {giftMode.enabled && (
            <button
              onClick={handleGiftModeExit}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border text-xs font-semibold transition-all"
              style={{ borderColor: "#f87171", color: "#ef4444", background: "#fff5f5" }}
            >
              <X size={12} /> Exit Gift Mode
            </button>
          )}

          <p className="text-center text-[9px]" style={S.muted}>
            Gift Mode filters results from your search — run a new search to apply.
          </p>
        </div>
      )}

      {/* ─── MAIN / SEARCH VIEW ─── */}
      {view === "main" && (
        <div className="flex-1 flex flex-col gap-4 p-4">
          {giftMode.enabled && giftMode.category && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ borderColor: "var(--accent)", background: "var(--bg-subtle)" }}>
              <Gift size={12} style={S.accent} />
              <span className="text-[11px] font-semibold" style={S.accent}>
                Gift Mode active: {giftMode.category === "jewelry" ? "Jewelry" : "Clothing"}
              </span>
            </div>
          )}

          <div className="text-center pt-1">
            <p className="text-xs leading-relaxed" style={S.muted}>
              {isScout
                ? "Describe the child — their age, what they love, what they hate."
                : "Describe the person — their vibe, lifestyle, or what they're into."}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <VoiceRecorder onTranscript={handleTranscript} mode={mode} disabled={loading} />
            <p className="text-[10px]" style={S.muted}>or type below</p>
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
            className="w-full rounded-xl px-3 py-2.5 text-xs outline-none border resize-none transition-colors"
            style={S.textarea}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !transcript.trim()}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={S.btn}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Finding gifts...</>
            ) : (
              <><Sparkles size={16} /> {isScout ? "Scout 25 Gifts" : "Curate 25 Gifts"}</>
            )}
          </button>

          <p className="text-center text-[9px]" style={S.muted}>
            <a href="https://scoutcurate.com/privacy" target="_blank" rel="noopener noreferrer"
              className="underline hover:opacity-70">Privacy</a>
            {" · "}
            <a href="https://scoutcurate.com/terms" target="_blank" rel="noopener noreferrer"
              className="underline hover:opacity-70">Terms</a>
            {" · As an Amazon Associate, I earn from qualifying purchases."}
          </p>
        </div>
      )}

      {/* ─── RESULTS VIEW ─── */}
      {view === "results" && allProducts.length > 0 && (
        <div className="flex-1 flex flex-col gap-3 p-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm theme-heading" style={S.heading}>
                {displayedProducts.length} Gifts
                {giftMode.enabled && giftMode.category && (
                  <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--bg-subtle)", color: "var(--accent)" }}>
                    {giftMode.category === "jewelry" ? "Jewelry" : "Clothing"}
                  </span>
                )}
              </h2>
              <p className="text-[10px] truncate max-w-[190px]" style={S.muted}>
                "{transcript.slice(0, 45)}{transcript.length > 45 ? "..." : ""}"
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-all hover:opacity-80"
              style={S.btnOutline}
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
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150"
                  style={activeCategory === cat ? S.catActive : S.catInactive}
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

          {displayedProducts.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>No matches for this filter</p>
              <p className="text-xs" style={S.muted}>Try a different search or exit Gift Mode to see all results.</p>
            </div>
          )}

          {/* Show more/less */}
          {displayedProducts.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border text-xs font-semibold transition-all hover:opacity-80"
              style={S.btnOutline}
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
              className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl border text-xs font-semibold transition-all hover:opacity-80"
              style={S.btnOutline}
            >
              <Shuffle size={12} /> Shuffle
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl border text-xs font-semibold transition-all"
              style={copied ? S.btnGreen : S.btnOutline}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy List</>}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[9px] pb-2" style={S.muted}>
            <a href="https://scoutcurate.com/privacy" target="_blank" rel="noopener noreferrer"
              className="underline hover:opacity-70">Privacy</a>
            {" · "}
            <a href="https://scoutcurate.com/terms" target="_blank" rel="noopener noreferrer"
              className="underline hover:opacity-70">Terms</a>
            {" · Amazon affiliate · prices vary"}
          </p>
        </div>
      )}
    </div>
  )
}
