import { normalizeTag, normalizeTags } from "./normalize"
import type {
  GiftIntent,
  RecommendableProduct,
  ProductMetrics,
  AffinitySignal,
  ScoreComponent,
  ScoredProduct,
} from "./types"

const MIN_AFFINITY_SAMPLE = 3
const MAX_POPULARITY_SCORE = 20
const MAX_AFFINITY_SCORE = 30

// ─── Budget ────────────────────────────────────────────────────────────────

function parsePriceRange(product: RecommendableProduct): { min: number; max: number } | null {
  if (product.price_min != null && product.price_max != null) {
    return { min: product.price_min, max: product.price_max }
  }
  if (product.priceRange) {
    const match = product.priceRange.match(/\$?(\d+)[–\-–]?\$?(\d+)?/)
    if (match) {
      const min = parseInt(match[1], 10)
      const max = match[2] ? parseInt(match[2], 10) : min
      return { min, max }
    }
  }
  return null
}

export function scoreBudgetFit(
  product: RecommendableProduct,
  intent: GiftIntent
): ScoreComponent {
  const price = parsePriceRange(product)
  if (!price) return { key: "budget", value: 0, reason: "no price data" }

  const bMin = intent.budget_min ?? 0
  const bMax = intent.budget_max ?? Infinity
  const pMid = (price.min + price.max) / 2

  const isLuxury = (intent.style_tags ?? []).some((t) =>
    ["luxury", "premium"].includes(normalizeTag(t))
  )

  if (pMid >= bMin && pMid <= bMax) {
    return { key: "budget", value: 15, reason: "price fits budget" }
  }
  if (pMid < bMin) {
    if (pMid >= bMin * 0.7) return { key: "budget", value: 5, reason: "slightly under budget" }
    if (isLuxury) return { key: "budget", value: -5, reason: "too cheap for luxury intent" }
    return { key: "budget", value: 2, reason: "under budget" }
  }
  // above budget
  const overage = (pMid - bMax) / bMax
  if (overage <= 0.1) return { key: "budget", value: 5, reason: "just above budget" }
  if (overage <= 0.25) return { key: "budget", value: -5, reason: "moderately over budget" }
  return { key: "budget", value: -15, reason: "significantly over budget" }
}

// ─── Category Relevance ────────────────────────────────────────────────────

export function scoreCategoryRelevance(
  product: RecommendableProduct,
  intent: GiftIntent
): ScoreComponent {
  const intentTags = normalizeTags(intent.style_tags ?? [])
  const productTags = normalizeTags([
    product.category ?? "",
    ...(product.tags ?? []),
  ].filter(Boolean))

  const matches = intentTags.filter((t) => productTags.includes(t))
  if (matches.length === 0) return { key: "category", value: 0, reason: "no tag overlap" }
  const score = Math.min(matches.length * 5, 15)
  return { key: "category", value: score, reason: `tags matched: ${matches.join(", ")}` }
}

// ─── Affinity helpers ──────────────────────────────────────────────────────

function affinityBoost(
  signals: AffinitySignal[],
  productId: string,
  field: keyof Pick<AffinitySignal, "recipient_type" | "occasion" | "style_tag">,
  value: string | undefined,
  maxScore: number
): ScoreComponent {
  const key = field.toString()
  if (!value) return { key, value: 0, reason: `no ${key} in intent` }

  const norm = normalizeTag(value)
  const matches = signals.filter(
    (s) => s.product_id === productId && s[field] && normalizeTag(s[field]!) === norm
  )

  const total = matches.reduce((sum, s) => {
    if (s.sample_size < MIN_AFFINITY_SAMPLE) return sum
    return sum + s.affinity_score
  }, 0)

  if (total === 0) return { key, value: 0, reason: `no ${key} affinity data` }
  const clamped = Math.min(total, maxScore)
  return { key, value: clamped, reason: `${key} affinity score ${clamped.toFixed(1)}` }
}

export function scoreRecipientAffinity(
  product: RecommendableProduct,
  intent: GiftIntent,
  signals: AffinitySignal[]
): ScoreComponent {
  return affinityBoost(signals, product.id, "recipient_type", intent.recipient_type, MAX_AFFINITY_SCORE)
}

export function scoreOccasionAffinity(
  product: RecommendableProduct,
  intent: GiftIntent,
  signals: AffinitySignal[]
): ScoreComponent {
  return affinityBoost(signals, product.id, "occasion", intent.occasion, MAX_AFFINITY_SCORE)
}

export function scoreStyleAffinity(
  product: RecommendableProduct,
  intent: GiftIntent,
  signals: AffinitySignal[]
): ScoreComponent {
  const styleTags = intent.style_tags ?? []
  if (styleTags.length === 0) return { key: "style", value: 0, reason: "no style tags" }

  let total = 0
  for (const tag of styleTags) {
    const boost = affinityBoost(signals, product.id, "style_tag", tag, MAX_AFFINITY_SCORE)
    total += boost.value
  }
  const clamped = Math.min(total, MAX_AFFINITY_SCORE)
  return { key: "style", value: clamped, reason: `style affinity ${clamped.toFixed(1)}` }
}

// ─── Popularity ────────────────────────────────────────────────────────────

export function scorePopularity(metrics: ProductMetrics | undefined): ScoreComponent {
  if (!metrics) return { key: "popularity", value: 0, reason: "no metrics" }
  const raw = metrics.views * 0.5 + metrics.clicks * 2 + metrics.saves * 3
  const clamped = Math.min(raw / 10, MAX_POPULARITY_SCORE)
  return { key: "popularity", value: clamped, reason: `v:${metrics.views} c:${metrics.clicks} s:${metrics.saves}` }
}

export function scoreConversionStrength(metrics: ProductMetrics | undefined): ScoreComponent {
  if (!metrics) return { key: "conversion", value: 0, reason: "no metrics" }
  const raw = metrics.outbound_clicks * 3 + metrics.conversions * 10
  const clamped = Math.min(raw / 5, 20)
  return { key: "conversion", value: clamped, reason: `oc:${metrics.outbound_clicks} cv:${metrics.conversions}` }
}

// ─── Combine ───────────────────────────────────────────────────────────────

export interface ScoreContext {
  intent: GiftIntent
  metricsMap: Map<string, ProductMetrics>
  affinitySignals: AffinitySignal[]
}

export function scoreProduct(
  product: RecommendableProduct,
  ctx: ScoreContext
): ScoredProduct {
  const metrics = ctx.metricsMap.get(product.id)
  const breakdown: ScoreComponent[] = [
    scoreBudgetFit(product, ctx.intent),
    scoreCategoryRelevance(product, ctx.intent),
    scoreRecipientAffinity(product, ctx.intent, ctx.affinitySignals),
    scoreOccasionAffinity(product, ctx.intent, ctx.affinitySignals),
    scoreStyleAffinity(product, ctx.intent, ctx.affinitySignals),
    scorePopularity(metrics),
    scoreConversionStrength(metrics),
  ]
  const totalScore = breakdown.reduce((sum, c) => sum + c.value, 0)
  return { product, totalScore, breakdown }
}
