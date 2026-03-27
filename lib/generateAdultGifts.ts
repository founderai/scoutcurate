import OpenAI from "openai"
import { buildAmazonSearchUrl } from "./amazon"
import type { GiftProduct, GiftResult, AdultGiftInput } from "./types"

const ADULT_CATEGORIES = ["Tech/Gadgets", "Home/Kitchen", "Beauty/Self-Care", "Fashion", "Wellness", "Books & Learning"]

function parseAdultInput(transcript: string): AdultGiftInput {
  const lower = transcript.toLowerCase()

  const detectedCategories = ADULT_CATEGORIES.filter((cat) =>
    lower.includes(cat.toLowerCase().split("/")[0].toLowerCase())
  )

  return {
    vibe: transcript,
    categories: detectedCategories.length > 0 ? detectedCategories : ADULT_CATEGORIES.slice(0, 3),
    rawTranscript: transcript,
  }
}

export async function generateAdultGifts(
  transcript: string
): Promise<GiftResult> {
  const apiKey = process.env.PLASMO_PUBLIC_OPENAI_API_KEY
  if (!apiKey) return { success: false, error: "OpenAI API key not configured. Please contact support." }
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  const input = parseAdultInput(transcript)

  const systemPrompt = `You are a luxury lifestyle curator and personal shopping expert.
Your recommendations reflect impeccable taste, practicality, and sophistication.

For each gift recommendation:
- Prioritize items with exceptional quality and high ratings
- Focus on: Luxury, Utility, and Aesthetic Vibes
- Explain the "Pro Choice" reasoning — why this gift stands out
- Match the recipient's personality, lifestyle, and aesthetic
- Cover these categories when relevant: Tech/Gadgets, Home/Kitchen, Beauty/Self-Care, Fashion, Wellness

Never recommend generic or low-quality items. Think like a high-end personal stylist.`

  const userPrompt = `Curate 25 sophisticated, highly-rated gift recommendations based on this description:
"${input.rawTranscript}"

Prioritize categories: ${input.categories.join(", ")}

Return ONLY a valid JSON array of exactly 25 objects. No markdown, no explanation, just JSON.
Each object must have these exact keys:
{
  "name": "Exact Product Name",
  "description": "Concise, evocative 1-2 sentence description",
  "reason": "The 'Pro Choice' reason — why this is the sophisticated pick for this person",
  "category": "Tech/Gadgets | Home/Kitchen | Beauty/Self-Care | Fashion | Wellness | Books & Learning",
  "priceRange": "e.g. $45-$80"
}`

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.75,
      response_format: { type: "json_object" },
    })

    const raw = response.choices[0].message.content ?? "{}"
    let parsed: any

    try {
      const obj = JSON.parse(raw)
      parsed = Array.isArray(obj) ? obj : obj.gifts ?? obj.products ?? Object.values(obj)[0]
    } catch {
      return { success: false, error: "Failed to parse AI response. Please try again." }
    }

    const products: GiftProduct[] = (parsed as any[]).slice(0, 25).map((item: any) => ({
      name: item.name ?? "Unknown Product",
      description: item.description ?? "",
      reason: item.reason ?? "",
      category: item.category ?? "General",
      priceRange: item.priceRange ?? item.price_range ?? "",
      amazonSearchUrl: buildAmazonSearchUrl(item.name ?? ""),
    }))

    return { success: true, products }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "An unexpected error occurred." }
  }
}
