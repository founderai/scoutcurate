import { getSupabase } from "@/lib/supabase"
import { scoreProduct } from "./score"
import type {
  RecommendationContext,
  ScoredProduct,
  ProductMetrics,
  AffinitySignal,
} from "./types"

// Simple in-process TTL cache (per-instance, resets on cold start)
interface CacheEntry<T> {
  value: T
  expiresAt: number
}
const cache = new Map<string, CacheEntry<unknown>>()
const TTL_MS = 5 * 60 * 1000 // 5 minutes

function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.value as T
}

function cacheSet<T>(key: string, value: T): void {
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS })
}

async function fetchMetrics(productIds: string[]): Promise<Map<string, ProductMetrics>> {
  const cacheKey = `metrics:${productIds.slice().sort().join(",")}`
  const cached = cacheGet<Map<string, ProductMetrics>>(cacheKey)
  if (cached) return cached

  const db = getSupabase()
  // Aggregate across last 30 days
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const { data, error } = await db
    .from("product_metrics_daily")
    .select("product_id, views, clicks, saves, outbound_clicks, conversions")
    .in("product_id", productIds)
    .gte("day", since)

  if (error) {
    console.warn("[recommend] metrics fetch error", error.message)
    return new Map()
  }

  // Sum across days per product
  const map = new Map<string, ProductMetrics>()
  for (const row of data ?? []) {
    const existing = map.get(row.product_id)
    if (!existing) {
      map.set(row.product_id, {
        product_id: row.product_id,
        views: row.views,
        clicks: row.clicks,
        saves: row.saves,
        outbound_clicks: row.outbound_clicks,
        conversions: row.conversions,
        ctr: 0,
        conversion_rate: 0,
      })
    } else {
      existing.views += row.views
      existing.clicks += row.clicks
      existing.saves += row.saves
      existing.outbound_clicks += row.outbound_clicks
      existing.conversions += row.conversions
    }
  }

  // Compute derived rates
  Array.from(map.values()).forEach((m) => {
    m.ctr = m.views > 0 ? m.clicks / m.views : 0
    m.conversion_rate = m.outbound_clicks > 0 ? m.conversions / m.outbound_clicks : 0
  })

  cacheSet(cacheKey, map)
  return map
}

async function fetchAffinitySignals(
  productIds: string[],
  recipientType?: string,
  occasion?: string,
  styleTags?: string[]
): Promise<AffinitySignal[]> {
  const cacheKey = `affinity:${productIds.slice().sort().join(",")}:${recipientType}:${occasion}:${(styleTags ?? []).join(",")}`
  const cached = cacheGet<AffinitySignal[]>(cacheKey)
  if (cached) return cached

  const db = getSupabase()
  let query = db
    .from("product_affinity_signals")
    .select("product_id, recipient_type, occasion, style_tag, affinity_score, sample_size")
    .in("product_id", productIds)

  // Only fetch signals relevant to this intent
  const relevantValues: string[] = []
  if (recipientType) relevantValues.push(recipientType)
  if (occasion) relevantValues.push(occasion)
  if (styleTags?.length) relevantValues.push(...styleTags)

  if (relevantValues.length > 0) {
    query = query.or(
      [
        recipientType ? `recipient_type.eq.${recipientType}` : null,
        occasion ? `occasion.eq.${occasion}` : null,
        styleTags?.length ? `style_tag.in.(${styleTags.join(",")})` : null,
      ]
        .filter(Boolean)
        .join(",")
    )
  }

  const { data, error } = await query

  if (error) {
    console.warn("[recommend] affinity fetch error", error.message)
    return []
  }

  const result = (data ?? []) as AffinitySignal[]
  cacheSet(cacheKey, result)
  return result
}

export async function getRankedRecommendations(
  ctx: RecommendationContext
): Promise<ScoredProduct[]> {
  const { intent, products, limit = 25, mode } = ctx

  if (products.length === 0) return []

  const productIds = products.map((p) => p.id)

  // Fetch aggregates (fail gracefully)
  const [metricsMap, affinitySignals] = await Promise.all([
    fetchMetrics(productIds).catch(() => new Map<string, ProductMetrics>()),
    fetchAffinitySignals(
      productIds,
      intent.recipient_type,
      intent.occasion,
      intent.style_tags
    ).catch(() => [] as AffinitySignal[]),
  ])

  const hasPersonalizationData =
    metricsMap.size > 0 || affinitySignals.length > 0

  // Score all products
  const scored = products.map((p) =>
    scoreProduct(p, { intent, metricsMap, affinitySignals })
  )

  // Sort descending
  scored.sort((a, b) => b.totalScore - a.totalScore)

  // If no personalization data at all, fall back to preserving original order
  // but still apply budget + category scoring
  if (!hasPersonalizationData && intent.budget_min == null && intent.budget_max == null && !intent.style_tags?.length) {
    return products.slice(0, limit).map((p) => ({
      product: p,
      totalScore: 0,
      breakdown: [{ key: "fallback", value: 0, reason: "no intent or metrics" }],
    }))
  }

  return scored.slice(0, limit)
}
