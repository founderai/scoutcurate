import { ExternalLink, Tag, DollarSign } from "lucide-react"
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
      className={`
        rounded-xl p-3 border transition-all duration-200 hover:scale-[1.01]
        ${isScout
          ? "bg-white border-orange-100 hover:border-scout-primary hover:shadow-md hover:shadow-orange-100"
          : "bg-curate-card border-curate-secondary hover:border-curate-primary hover:shadow-md hover:shadow-yellow-900/20"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span
          className={`
            text-[10px] font-bold px-2 py-0.5 rounded-full
            ${isScout ? "bg-orange-100 text-scout-primary" : "bg-yellow-900/30 text-curate-accent"}
          `}
        >
          {product.category}
        </span>
        <span
          className={`
            text-[10px] font-semibold flex items-center gap-0.5
            ${isScout ? "text-green-600" : "text-curate-accent"}
          `}
        >
          <DollarSign size={10} />
          {product.priceRange}
        </span>
      </div>

      <h3
        className={`
          font-bold text-sm leading-tight mb-1
          ${isScout ? "font-scout text-gray-800" : "font-curate text-curate-accent"}
        `}
      >
        {index + 1}. {product.name}
      </h3>

      <p className={`text-xs mb-1.5 leading-relaxed ${isScout ? "text-gray-500" : "text-gray-400"}`}>
        {product.description}
      </p>

      <div
        className={`
          text-xs rounded-lg px-2.5 py-1.5 mb-2.5 italic
          ${isScout
            ? "bg-green-50 text-green-700 border-l-2 border-green-400"
            : "bg-yellow-900/20 text-curate-accent border-l-2 border-curate-primary"
          }
        `}
      >
        {isScout ? "Why kids love it: " : "Pro pick: "}
        <span className="not-italic">{product.reason}</span>
      </div>

      <a
        href={product.amazonSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex items-center justify-center gap-1.5 w-full py-2 rounded-lg
          text-xs font-bold text-white transition-all duration-150 hover:opacity-90
          ${isScout ? "bg-scout-primary hover:bg-orange-500" : "bg-curate-primary hover:bg-yellow-600"}
        `}
      >
        <ExternalLink size={12} />
        Buy on Amazon
      </a>
    </div>
  )
}
