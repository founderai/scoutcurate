export type Mode = "scout" | "curate"

export type GiftCategory = "jewelry" | "clothing"
export type GiftRecipient = "her" | "him" | "unisex"
export type GiftBudget = "under50" | "50to100" | "over100"

export interface GiftModeState {
  enabled: boolean
  category: GiftCategory | null
  recipient: GiftRecipient | null
  budget: GiftBudget | null
}

export interface GiftProduct {
  name: string
  description: string
  reason: string
  category: string
  priceRange: string
  amazonSearchUrl: string
}

export interface KidsGiftInput {
  age: number | string
  likes: string
  dislikes: string
  rawTranscript: string
}

export interface AdultGiftInput {
  vibe: string
  categories: string[]
  rawTranscript: string
}

export type GiftResult =
  | { success: true; products: GiftProduct[] }
  | { success: false; error: string }
