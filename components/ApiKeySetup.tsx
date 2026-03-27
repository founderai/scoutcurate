import { useState } from "react"
import { Key, Eye, EyeOff, ExternalLink } from "lucide-react"

interface ApiKeySetupProps {
  onSave: (key: string) => void
  mode: "scout" | "curate"
}

export function ApiKeySetup({ onSave, mode }: ApiKeySetupProps) {
  const [key, setKey] = useState("")
  const [show, setShow] = useState(false)
  const isScout = mode === "scout"

  const handleSave = () => {
    const trimmed = key.trim()
    if (trimmed.startsWith("sk-") && trimmed.length > 20) {
      onSave(trimmed)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 px-4 py-6 ${isScout ? "" : "text-curate-accent"}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isScout ? "bg-orange-100" : "bg-yellow-900/30"}`}>
        <Key size={22} className={isScout ? "text-scout-primary" : "text-curate-primary"} />
      </div>

      <div className="text-center">
        <h2 className={`font-bold text-sm mb-1 ${isScout ? "font-scout text-gray-800" : "font-curate text-curate-accent"}`}>
          OpenAI API Key Required
        </h2>
        <p className={`text-xs ${isScout ? "text-gray-500" : "text-curate-muted"}`}>
          Your key is stored locally and never sent anywhere except OpenAI.
        </p>
      </div>

      <div className="w-full relative">
        <input
          type={show ? "text" : "password"}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="sk-..."
          className={`
            w-full rounded-xl px-3 py-2.5 pr-10 text-xs outline-none border
            ${isScout
              ? "bg-white border-orange-200 text-gray-800 placeholder-gray-300 focus:border-scout-primary"
              : "bg-curate-card border-curate-secondary text-curate-accent placeholder-gray-600 focus:border-curate-primary"
            }
          `}
        />
        <button
          onClick={() => setShow(!show)}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${isScout ? "text-gray-400" : "text-curate-muted"}`}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={!key.trim().startsWith("sk-") || key.trim().length < 20}
        className={`
          w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all
          disabled:opacity-40 disabled:cursor-not-allowed
          ${isScout ? "bg-scout-primary hover:bg-orange-500" : "bg-curate-primary hover:bg-yellow-600"}
        `}
      >
        Save & Continue
      </button>

      <a
        href="https://platform.openai.com/api-keys"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-1 text-[10px] underline ${isScout ? "text-gray-400" : "text-curate-muted"}`}
      >
        Get an OpenAI API key <ExternalLink size={10} />
      </a>
    </div>
  )
}
