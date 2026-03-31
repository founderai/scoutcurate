import { getSupabase } from "@/lib/supabase"

export async function aggregateProductMetricsDaily(): Promise<void> {
  const db = getSupabase()
  const today = new Date().toISOString().split("T")[0]

  // Pull all product events grouped by product_id + event_type for today
  const { data: events, error: evErr } = await db
    .from("product_events")
    .select("product_id, event_type")
    .gte("created_at", `${today}T00:00:00Z`)
    .lte("created_at", `${today}T23:59:59Z`)

  if (evErr) throw evErr

  // Pull conversions for today
  const { data: convs, error: cvErr } = await db
    .from("conversions")
    .select("product_id")
    .gte("created_at", `${today}T00:00:00Z`)
    .lte("created_at", `${today}T23:59:59Z`)

  if (cvErr) throw cvErr

  // Aggregate in memory
  const map: Record<
    string,
    { views: number; clicks: number; saves: number; outbound_clicks: number; conversions: number }
  > = {}

  for (const e of events ?? []) {
    const pid = e.product_id
    if (!map[pid]) map[pid] = { views: 0, clicks: 0, saves: 0, outbound_clicks: 0, conversions: 0 }
    if (e.event_type === "view") map[pid].views++
    else if (e.event_type === "click") map[pid].clicks++
    else if (e.event_type === "save") map[pid].saves++
    else if (e.event_type === "outbound_click") map[pid].outbound_clicks++
  }

  for (const c of convs ?? []) {
    const pid = c.product_id
    if (!map[pid]) map[pid] = { views: 0, clicks: 0, saves: 0, outbound_clicks: 0, conversions: 0 }
    map[pid].conversions++
  }

  const rows = Object.entries(map).map(([product_id, m]) => ({
    product_id,
    day: today,
    views: m.views,
    clicks: m.clicks,
    saves: m.saves,
    outbound_clicks: m.outbound_clicks,
    conversions: m.conversions,
    ctr: m.views > 0 ? m.clicks / m.views : 0,
    conversion_rate: m.outbound_clicks > 0 ? m.conversions / m.outbound_clicks : 0,
    updated_at: new Date().toISOString(),
  }))

  if (rows.length === 0) return

  const { error: upsertErr } = await db
    .from("product_metrics_daily")
    .upsert(rows, { onConflict: "product_id,day" })

  if (upsertErr) throw upsertErr
}

export async function aggregateProductAffinitySignals(): Promise<void> {
  const db = getSupabase()

  // Join gift_intents → product_events on session_id
  // Pull strong engagement events only: click, save, outbound_click
  const { data: intents, error: intErr } = await db
    .from("gift_intents")
    .select("session_id, recipient_type, occasion, style_tags")

  if (intErr) throw intErr

  const { data: events, error: evErr } = await db
    .from("product_events")
    .select("session_id, product_id, event_type")
    .in("event_type", ["click", "save", "outbound_click"])

  if (evErr) throw evErr

  const intentMap: Record<
    string,
    { recipient_type: string | null; occasion: string | null; style_tags: string[] }
  > = {}
  for (const i of intents ?? []) {
    intentMap[i.session_id] = {
      recipient_type: i.recipient_type ?? null,
      occasion: i.occasion ?? null,
      style_tags: i.style_tags ?? [],
    }
  }

  // event weight
  const WEIGHTS: Record<string, number> = {
    click: 1,
    save: 3,
    outbound_click: 5,
  }

  // accumulate: key = `${product_id}|${recipient_type}|${occasion}|${style_tag}`
  const agg: Record<string, { score: number; count: number }> = {}

  function addSignal(
    productId: string,
    rtype: string | null,
    occ: string | null,
    stag: string | null,
    weight: number
  ) {
    const key = `${productId}|${rtype ?? ""}|${occ ?? ""}|${stag ?? ""}`
    if (!agg[key]) agg[key] = { score: 0, count: 0 }
    agg[key].score += weight
    agg[key].count++
  }

  for (const ev of events ?? []) {
    const intent = intentMap[ev.session_id]
    if (!intent) continue
    const weight = WEIGHTS[ev.event_type] ?? 1

    // recipient_type signal
    addSignal(ev.product_id, intent.recipient_type, null, null, weight)
    // occasion signal
    addSignal(ev.product_id, null, intent.occasion, null, weight)
    // style_tag signals (one row per tag)
    for (const tag of intent.style_tags) {
      addSignal(ev.product_id, null, null, tag, weight)
    }
    // combined
    addSignal(ev.product_id, intent.recipient_type, intent.occasion, null, weight)
  }

  const rows = Object.entries(agg).map(([key, val]) => {
    const [product_id, recipient_type, occasion, style_tag] = key.split("|")
    return {
      product_id,
      recipient_type: recipient_type || null,
      occasion: occasion || null,
      style_tag: style_tag || null,
      affinity_score: val.score,
      sample_size: val.count,
      updated_at: new Date().toISOString(),
    }
  })

  if (rows.length === 0) return

  const { error: upsertErr } = await db
    .from("product_affinity_signals")
    .upsert(rows, { onConflict: "product_id,recipient_type,occasion,style_tag" })

  if (upsertErr) throw upsertErr
}
