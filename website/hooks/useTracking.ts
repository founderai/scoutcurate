import { getSessionId } from "@/lib/session"

interface IntentData {
  user_id?: string
  recipient_type?: string
  occasion?: string
  budget_min?: number
  budget_max?: number
  style_tags?: string[]
}

interface EventData {
  user_id?: string
  product_id: string
  event_type: "view" | "click" | "save" | "outbound_click"
  position?: number
  metadata?: Record<string, unknown>
}

interface ConversionData {
  user_id?: string
  product_id: string
  affiliate_url?: string
  estimated_value?: number
}

function post(path: string, body: Record<string, unknown>) {
  try {
    fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((e) => console.warn("[tracking] fetch failed", e))
  } catch (e) {
    console.warn("[tracking] error", e)
  }
}

export function useTracking() {
  const sessionId = typeof window !== "undefined" ? getSessionId() : "ssr"

  function trackIntent(data: IntentData) {
    post("/api/track/intent", { session_id: sessionId, ...data })
  }

  function trackEvent(data: EventData) {
    post("/api/track/event", { session_id: sessionId, ...data })
  }

  function trackConversion(data: ConversionData) {
    post("/api/track/conversion", { session_id: sessionId, ...data })
  }

  return { trackIntent, trackEvent, trackConversion }
}
