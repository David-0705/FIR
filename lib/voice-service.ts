export type LanguageCode = "en" | "hi" | "mr"

const voiceLanguages: Record<LanguageCode, string> = {
  en: "en-US",
  hi: "hi-IN",
  mr: "mr-IN",
}

interface SpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: () => void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: any[]
}

interface SpeechRecognitionErrorEvent {
  error: string
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null
  private isListening = false

  constructor(language: LanguageCode = "en") {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser")
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = false
    this.recognition.interimResults = true
    this.recognition.lang = voiceLanguages[language]
  }

  setLanguage(language: LanguageCode) {
    if (this.recognition) {
      this.recognition.lang = voiceLanguages[language]
    }
  }

  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void,
  ): void {
    if (!this.recognition) {
      onError("Speech Recognition not supported in this browser")
      return
    }

    this.isListening = true

    this.recognition.onstart = () => {
      console.log("[v0] Voice input started")
    }

    this.recognition.onresult = (event: any) => {
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          onResult(transcript, true)
        } else {
          interimTranscript += transcript
          onResult(interimTranscript, false)
        }
      }
    }

    this.recognition.onerror = (event: any) => {
      console.error("[v0] Voice input error:", event.error)
      onError(`Speech recognition error: ${event.error}`)
    }

    this.recognition.onend = () => {
      console.log("[v0] Voice input ended")
      this.isListening = false
      onEnd()
    }

    this.recognition.start()
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  getIsListening(): boolean {
    return this.isListening
  }
}

export const getTransliteration = async (text: string, language: LanguageCode): Promise<string> => {
  // Now it translates the native script to English for verification
  if (language === "en") return text

  try {
    const response = await fetch("/api/transliterate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        language,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.translation || text
    }
  } catch (error) {
    console.error("[v0] Translation error:", error)
  }

  return text
}

export const textToSpeech = (text: string, language: LanguageCode = "en") => {
  if (!("speechSynthesis" in window)) {
    console.warn("Text-to-Speech not supported in this browser")
    return
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voiceLanguages[language]
  utterance.rate = 0.9

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
