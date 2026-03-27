import { Storage } from "@plasmohq/storage"
import type { GiftProduct } from "./types"

const storage = new Storage()

export const STORAGE_KEYS = {
  MODE: "active_mode",
  LAST_RESULTS: "last_results",
} as const

export interface LastResults {
  products: GiftProduct[]
  transcript: string
}

export async function getMode(): Promise<"scout" | "curate"> {
  const mode = await storage.get(STORAGE_KEYS.MODE)
  return mode === "curate" ? "curate" : "scout"
}

export async function setMode(mode: "scout" | "curate"): Promise<void> {
  await storage.set(STORAGE_KEYS.MODE, mode)
}

export async function getLastResults(): Promise<LastResults | null> {
  return (await storage.get<LastResults>(STORAGE_KEYS.LAST_RESULTS)) ?? null
}

export async function saveLastResults(data: LastResults): Promise<void> {
  await storage.set(STORAGE_KEYS.LAST_RESULTS, data)
}
