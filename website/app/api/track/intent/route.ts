import { NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, user_id, recipient_type, occasion, budget_min, budget_max, style_tags } = body

    if (!session_id) {
      return NextResponse.json({ error: "session_id required" }, { status: 400 })
    }

    await getSupabase().from("gift_intents").insert({
      session_id,
      user_id: user_id ?? null,
      recipient_type: recipient_type ?? null,
      occasion: occasion ?? null,
      budget_min: budget_min ?? null,
      budget_max: budget_max ?? null,
      style_tags: style_tags ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
