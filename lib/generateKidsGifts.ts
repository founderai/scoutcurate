import OpenAI from "openai"
import { buildAmazonSearchUrl } from "./amazon"
import type { GiftProduct, GiftResult, KidsGiftInput } from "./types"

function parseKidsInput(transcript: string): KidsGiftInput {
  const lower = transcript.toLowerCase()

  const ageMatch = lower.match(/(\d+)\s*(?:year|yr|years|old)?/)
  const age = ageMatch ? parseInt(ageMatch[1]) : "unknown"

  const likesMatch = transcript.match(/likes?\s+([^.]+)/i)
  const dislikesMatch = transcript.match(/(?:dislikes?|hates?|doesn't like)\s+([^.]+)/i)

  return {
    age,
    likes: likesMatch?.[1]?.trim() ?? transcript,
    dislikes: dislikesMatch?.[1]?.trim() ?? "nothing specified",
    rawTranscript: transcript,
  }
}

export async function generateKidsGifts(
  transcript: string
): Promise<GiftResult> {
  const apiKey = process.env.PLASMO_PUBLIC_OPENAI_API_KEY
  if (!apiKey) return { success: false, error: "OpenAI API key not configured. Please contact support." }
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  const input = parseKidsInput(transcript)

  const systemPrompt = `You are a children's gift expert and child development specialist.
Your goal is to recommend 25 gifts that are:
- Age-appropriate and developmentally suitable
- Safe (no choking hazards for young kids, no toxic materials)
- Educational or skill-building when possible
- Fun, engaging, and exciting for a child

Always prioritize safety above all else. Flag if certain items may not be suitable for younger ages.
Prefer gifts with high ratings and positive reviews from parents.`

  const userPrompt = `Find 25 perfect gifts for a child with these details:
Age: ${input.age}
Likes: ${input.likes}
Dislikes: ${input.dislikes}
Additional context: ${input.rawTranscript}

Return ONLY a valid JSON array of exactly 25 objects. No markdown, no explanation, just JSON.
Each object must have these exact keys:
{
  "name": "Product Name",
  "description": "1-2 sentence product description",
  "reason": "Why this is perfect for this child specifically",
  "category": "e.g. STEM, Arts & Crafts, Outdoor Play, Books, Games",
  "priceRange": "e.g. $15-$25"
}`

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
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
