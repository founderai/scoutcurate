import { ExternalLink, DollarSign } from "lucide-react"
import type { GiftProduct } from "~lib/types"

interface ProductCardProps {
  product: GiftProduct
  index: number
  mode: "scout" | "curate"
}

export function ProductCard({ product, index, mode }: ProductCardProps) {
  const isScout = mode === "scout"

  return (
    <div
      className="rounded-2xl p-3.5 border transition-all duration-200 hover:scale-[1.01] hover:-translate-y-px"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = "var(--border-h)"
        el.style.boxShadow = "var(--shadow-h)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = "var(--border)"
        el.style.boxShadow = "var(--shadow)"
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
        >
          {product.category}
        </span>
        <span
          className="text-[10px] font-semibold flex items-center gap-0.5"
          style={{ color: "var(--accent)" }}
        >
          <DollarSign size={10} />
          {product.priceRange}
        </span>
      </div>

      <h3
        className="font-bold text-sm leading-tight mb-1 theme-heading"
        style={{ color: "var(--text)" }}
      >
        {index + 1}. {product.name}
      </h3>

      <p className="text-xs mb-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {product.description}
      </p>

      <div
        className="text-xs rounded-xl px-2.5 py-1.5 mb-2.5 italic border-l-2"
        style={{
          background: "var(--why-bg)",
          color: "var(--why-text)",
          borderLeftColor: "var(--why-border)",
        }}
      >
        {isScout ? "Why kids love it: " : "Pro pick: "}
        <span className="not-italic">{product.reason}</span>
      </div>

      <a
        href={product.amazonSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:opacity-90"
        style={{ background: "var(--primary)", color: "var(--btn-text)" }}
      >
        <ExternalLink size={12} />
        Buy on Amazon
      </a>
    </div>
  )
}
