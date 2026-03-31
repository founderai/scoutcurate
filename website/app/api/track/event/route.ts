import { NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, user_id, product_id, event_type, position, metadata } = body

    if (!session_id || !product_id || !event_type) {
      return NextResponse.json({ error: "session_id, product_id, event_type required" }, { status: 400 })
    }

    await getSupabase().from("product_events").insert({
      session_id,
      user_id: user_id ?? null,
      product_id,
      event_type,
      position: position ?? null,
      metadata: metadata ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
