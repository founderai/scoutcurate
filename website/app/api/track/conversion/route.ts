import { NextRequest, NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, user_id, product_id, affiliate_url, estimated_value } = body

    if (!session_id || !product_id) {
      return NextResponse.json({ error: "session_id, product_id required" }, { status: 400 })
    }

    await getSupabase().from("conversions").insert({
      session_id,
      user_id: user_id ?? null,
      product_id,
      affiliate_url: affiliate_url ?? null,
      estimated_value: estimated_value ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "internal" }, { status: 500 })
  }
}
