import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// ─── Simple in-memory rate limiter ────────────────────────────────────────────
// Resets on cold start. Good enough for serverless abuse prevention.
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10           // max requests per IP per window

const ipMap = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

const ADULT_CATEGORIES = ["Tech/Gadgets", "Home/Kitchen", "Beauty/Self-Care", "Fashion", "Wellness", "Books & Learning"]

function parseAdultCategories(transcript: string): string[] {
  const lower = transcript.toLowerCase()
  const detected = ADULT_CATEGORIES.filter((cat) =>
    lower.includes(cat.toLowerCase().split("/")[0].toLowerCase())
  )
  return detected.length > 0 ? detected : ADULT_CATEGORIES.slice(0, 3)
}

function parseAge(transcript: string): string | number {
  const match = transcript.toLowerCase().match(/(\d+)\s*(?:year|yr|years|old)?/)
  return match ? parseInt(match[1], 10) : "unknown"
}

function buildScoutPrompts(transcript: string) {
  const age = parseAge(transcript)
  const likesMatch = transcript.match(/likes?\s+([^.]+)/i)
  const dislikesMatch = transcript.match(/(?:dislikes?|hates?|doesn't like)\s+([^.]+)/i)
  const likes = likesMatch?.[1]?.trim() ?? transcript
  const dislikes = dislikesMatch?.[1]?.trim() ?? "nothing specified"

  return {
    system: `You are a children's gift expert and child development specialist.
Your goal is to recommend 25 gifts that are:
- Age-appropriate and developmentally suitable
- Safe (no choking hazards for young kids, no toxic materials)
- Educational or skill-building when possible
- Fun, engaging, and exciting for a child

Always prioritize safety above all else.
Prefer gifts with high ratings and positive reviews from parents.`,
    user: `Find 25 perfect gifts for a child with these details:
Age: ${age}
Likes: ${likes}
Dislikes: ${dislikes}
Additional context: ${transcript}

Return ONLY a valid JSON array of exactly 25 objects. No markdown, no explanation, just JSON.
Each object must have these exact keys:
{
  "name": "Product Name",
  "description": "1-2 sentence product description",
  "reason": "Why this is perfect for this child specifically",
  "category": "e.g. STEM, Arts & Crafts, Outdoor Play, Books, Games",
  "priceRange": "e.g. $15-$25"
}`,
    temperature: 0.7,
  }
}

function buildCuratePrompts(transcript: string) {
  const categories = parseAdultCategories(transcript)
  return {
    system: `You are a luxury lifestyle curator and personal shopping expert.
Your recommendations reflect impeccable taste, practicality, and sophistication.

For each gift recommendation:
- Prioritize items with exceptional quality and high ratings
- Focus on: Luxury, Utility, and Aesthetic Vibes
- Explain the "Pro Choice" reasoning — why this gift stands out
- Match the recipient's personality, lifestyle, and aesthetic
- Cover these categories when relevant: Tech/Gadgets, Home/Kitchen, Beauty/Self-Care, Fashion, Wellness

Never recommend generic or low-quality items. Think like a high-end personal stylist.`,
    user: `Curate 25 sophisticated, highly-rated gift recommendations based on this description:
"${transcript}"

Prioritize categories: ${categories.join(", ")}

Return ONLY a valid JSON array of exactly 25 objects. No markdown, no explanation, just JSON.
Each object must have these exact keys:
{
  "name": "Exact Product Name",
  "description": "Concise, evocative 1-2 sentence description",
  "reason": "The 'Pro Choice' reason — why this is the sophisticated pick for this person",
  "category": "Tech/Gadgets | Home/Kitchen | Beauty/Self-Care | Fashion | Wellness | Books & Learning",
  "priceRange": "e.g. $45-$80"
}`,
    temperature: 0.75,
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a moment." },
      { status: 429 }
    )
  }

  // Parse body
  let body: { transcript?: string; mode?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 })
  }

  const { transcript, mode } = body

  if (!transcript || typeof transcript !== "string" || transcript.trim().length < 3) {
    return NextResponse.json({ success: false, error: "Transcript is required." }, { status: 400 })
  }
  if (!mode || (mode !== "scout" && mode !== "curate")) {
    return NextResponse.json({ success: false, error: "mode must be 'scout' or 'curate'." }, { status: 400 })
  }

  // Enforce max transcript length to prevent prompt injection / abuse
  const safeTranscript = transcript.trim().slice(0, 1000)

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error("[/api/generate] OPENAI_API_KEY not set")
    return NextResponse.json({ success: false, error: "Service temporarily unavailable." }, { status: 503 })
  }

  const client = new OpenAI({ apiKey })
  const prompts = mode === "scout"
    ? buildScoutPrompts(safeTranscript)
    : buildCuratePrompts(safeTranscript)

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompts.system },
        { role: "user", content: prompts.user },
      ],
      temperature: prompts.temperature,
      response_format: { type: "json_object" },
    })

    const raw = response.choices[0].message.content ?? "{}"
    let parsed: unknown[]

    try {
      const obj = JSON.parse(raw)
      parsed = Array.isArray(obj) ? obj : (obj.gifts ?? obj.products ?? Object.values(obj)[0]) as unknown[]
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      )
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        { success: false, error: "No products returned. Please try again." },
        { status: 500 }
      )
    }

    const products = (parsed as any[]).slice(0, 25).map((item: any) => ({
      name: item.name ?? "Unknown Product",
      description: item.description ?? "",
      reason: item.reason ?? "",
      category: item.category ?? "General",
      priceRange: item.priceRange ?? item.price_range ?? "",
    }))

    return NextResponse.json({ success: true, products })
  } catch (err: any) {
    console.error("[/api/generate]", err?.message)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
