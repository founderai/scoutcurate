import { NextRequest, NextResponse } from "next/server"
import { getRankedRecommendations } from "@/lib/recommendations/recommend"
import type { GiftIntent, RecommendableProduct } from "@/lib/recommendations/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      session_id,
      user_id,
      intent,
      products,
      limit = 25,
      mode = "curate",
      debug = false,
    }: {
      session_id?: string
      user_id?: string
      intent: GiftIntent
      products: RecommendableProduct[]
      limit?: number
      mode?: "scout" | "curate"
      debug?: boolean
    } = body

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: "products array required" }, { status: 400 })
    }

    const ranked = await getRankedRecommendations({
      sessionId: session_id,
      userId: user_id,
      intent: intent ?? {},
      products,
      limit,
      mode,
    })

    const isDev = process.env.NODE_ENV === "development"
    const showDebug = debug && isDev

    return NextResponse.json({
      ok: true,
      results: ranked.map((r) => ({
        product: r.product,
        score: r.totalScore,
        ...(showDebug ? { breakdown: r.breakdown } : {}),
      })),
    })
  } catch (e) {
    console.error("[/api/recommendations]", e)
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}

// GET convenience endpoint — query params only, no body needed
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const intent: GiftIntent = {
      recipient_type: searchParams.get("recipient_type") ?? undefined,
      occasion: searchParams.get("occasion") ?? undefined,
      budget_min: searchParams.get("budget_min") ? Number(searchParams.get("budget_min")) : undefined,
      budget_max: searchParams.get("budget_max") ? Number(searchParams.get("budget_max")) : undefined,
      style_tags: searchParams.get("style_tags")?.split(",").filter(Boolean) ?? undefined,
    }

    const mode = (searchParams.get("mode") ?? "curate") as "scout" | "curate"
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 25

    // Without products passed, return empty — caller must POST with product list
    return NextResponse.json({
      ok: true,
      hint: "POST to /api/recommendations with { intent, products[] } for ranked results",
      intent,
      mode,
      limit,
    })
  } catch {
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
