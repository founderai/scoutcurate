import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Square } from "lucide-react"

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  mode: "scout" | "curate"
  disabled?: boolean
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function VoiceRecorder({ onTranscript, mode, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [interimText, setInterimText] = useState("")
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let interim = ""
      let final = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript + " "
        } else {
          interim += transcript
        }
      }
      if (interim) setInterimText(interim)
      if (final) {
        onTranscript(final.trim())
        setInterimText("")
      }
    }

    recognition.onerror = () => {
      setIsRecording(false)
      setInterimText("")
    }

    recognition.onend = () => {
      setIsRecording(false)
      setInterimText("")
    }

    recognitionRef.current = recognition
  }, [onTranscript])

  const toggle = () => {
    if (!recognitionRef.current) return
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
      setInterimText("")
    }
  }

  if (!supported) {
    return (
      <div className="text-xs text-red-400 text-center py-2">
        Voice input not supported in this browser.
      </div>
    )
  }

  const isScout = mode === "scout"

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={toggle}
        disabled={disabled}
        className={`
          relative w-24 h-24 rounded-full font-bold text-white shadow-lg transition-all duration-200
          flex flex-col items-center justify-center gap-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isScout
            ? isRecording
              ? "bg-red-500 scale-105 shadow-red-300"
              : "bg-scout-primary hover:bg-orange-500 hover:scale-105"
            : isRecording
              ? "bg-red-700 scale-105 shadow-red-900"
              : "bg-curate-primary hover:bg-yellow-600 hover:scale-105"
          }
          ${isRecording ? "animate-pulse_slow" : ""}
        `}
      >
        {isRecording ? (
          <>
            <Square size={20} fill="white" />
            <span className="text-xs font-semibold">Stop</span>
          </>
        ) : (
          <>
            <Mic size={22} />
            <span className="text-xs font-semibold">Record</span>
          </>
        )}
      </button>

      {isRecording && (
        <div className="flex items-center gap-2">
          <span className="animate-pulse w-2 h-2 rounded-full bg-red-500 inline-block" />
          <span className={`text-xs ${isScout ? "text-gray-500" : "text-curate-muted"}`}>
            Listening...
          </span>
        </div>
      )}

      {interimText && (
        <p className={`text-xs italic px-3 text-center max-w-xs truncate ${isScout ? "text-gray-400" : "text-curate-muted"}`}>
          "{interimText}"
        </p>
      )}
    </div>
  )
}
