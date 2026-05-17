import { buildAmazonSearchUrl } from "./amazon"
import type { GiftProduct, GiftResult } from "./types"

const API_BASE = "https://scoutcurate.com"

export async function generateAdultGifts(
  transcript: string
): Promise<GiftResult> {
  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, mode: "curate" }),
    })

    const data = await res.json()

    if (!data.success) {
      return { success: false, error: data.error ?? "An unexpected error occurred." }
    }

    const products: GiftProduct[] = (data.products as any[]).map((item: any) => ({
      name: item.name ?? "Unknown Product",
      description: item.description ?? "",
      reason: item.reason ?? "",
      category: item.category ?? "General",
      priceRange: item.priceRange ?? "",
      amazonSearchUrl: buildAmazonSearchUrl(item.name ?? ""),
    }))

    return { success: true, products }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "An unexpected error occurred." }
  }
}
