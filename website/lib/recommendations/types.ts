export interface GiftIntent {
  session_id?: string
  user_id?: string
  recipient_type?: string
  occasion?: string
  budget_min?: number
  budget_max?: number
  style_tags?: string[]
}

export interface RecommendableProduct {
  id: string
  name: string
  category: string
  price_min?: number
  price_max?: number
  tags?: string[]
  brand?: string
  recipient_type?: string
  age_group?: string
  // raw priceRange string e.g. "$25–$40" for fallback parsing
  priceRange?: string
  // pass-through for existing GiftProduct fields
  [key: string]: unknown
}

export interface ProductMetrics {
  product_id: string
  views: number
  clicks: number
  saves: number
  outbound_clicks: number
  conversions: number
  ctr: number
  conversion_rate: number
}

export interface AffinitySignal {
  product_id: string
  recipient_type: string | null
  occasion: string | null
  style_tag: string | null
  affinity_score: number
  sample_size: number
}

export interface ScoreComponent {
  key: string
  value: number
  reason: string
}

export interface ScoredProduct {
  product: RecommendableProduct
  totalScore: number
  breakdown: ScoreComponent[]
}

export interface RecommendationContext {
  sessionId?: string
  userId?: string
  intent: GiftIntent
  products: RecommendableProduct[]
  limit?: number
  mode?: "scout" | "curate"
  debug?: boolean
}
