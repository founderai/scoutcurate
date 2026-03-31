import { NextRequest, NextResponse } from "next/server"
import { aggregateProductMetricsDaily, aggregateProductAffinitySignals } from "@/lib/recommendations/aggregates"

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? ""

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret")
  if (!auth || auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const results: Record<string, string> = {}

  try {
    await aggregateProductMetricsDaily()
    results.metrics = "ok"
  } catch (e) {
    results.metrics = `error: ${(e as Error).message}`
  }

  try {
    await aggregateProductAffinitySignals()
    results.affinity = "ok"
  } catch (e) {
    results.affinity = `error: ${(e as Error).message}`
  }

  return NextResponse.json({ ok: true, results })
}
