import { type NextRequest, NextResponse } from "next/server"

const translationMap: Record<string, Record<string, string>> = {
  hi: {
    // Common greetings and phrases
    नमस्ते: "hello",
    नमस्कार: "greetings",
    धन्यवाद: "thank you",
    कृपया: "please",
    हाँ: "yes",
    नहीं: "no",
    जी: "yes",
    बिल्कुल: "certainly",

    // Common nouns
    पता: "address",
    नाम: "name",
    नंबर: "number",
    तारीख: "date",
    समय: "time",
    दिन: "day",
    महीना: "month",
    साल: "year",
    घर: "house",
    शहर: "city",
    देश: "country",

    // Common verbs
    है: "is",
    हैं: "are",
    हो: "be",
    था: "was",
    थे: "were",
    होगा: "will be",
    हुआ: "happened",
    करना: "do",
    करूंगा: "will do",
    कर: "do",
    दिया: "given",

    // Common adjectives and adverbs
    अच्छा: "good",
    बुरा: "bad",
    बड़ा: "big",
    छोटा: "small",
    नया: "new",
    पुराना: "old",
    तेजी: "quickly",
    धीरे: "slowly",

    // Common questions
    क्या: "what",
    कहाँ: "where",
    कब: "when",
    किसने: "who",
    क्यों: "why",
    कैसे: "how",
  },
  mr: {
    // Common greetings and phrases
    नमस्कार: "greetings",
    नमस्ते: "hello",
    धन्यवाद: "thank you",
    कृपया: "please",
    होय: "yes",
    नाही: "no",
    नक्की: "definitely",

    // Common nouns
    पत्ता: "address",
    नाव: "name",
    नंबर: "number",
    तारीख: "date",
    वेळ: "time",
    दिवस: "day",
    महिना: "month",
    वर्ष: "year",
    घर: "house",
    शहर: "city",
    देश: "country",

    // Common verbs
    आहे: "is",
    आहेत: "are",
    होते: "was",
    होतेस: "were",
    करा: "do",
    केले: "did",
    करीन: "will do",
    दिले: "given",

    // Common adjectives
    चांगला: "good",
    वाईट: "bad",
    मोठा: "big",
    लहान: "small",
    नवीन: "new",
    जुना: "old",

    // Common questions
    काय: "what",
    कुठे: "where",
    केव्हा: "when",
    कोण: "who",
    का: "why",
    कसे: "how",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json()

    if (!text || !language) {
      return NextResponse.json({ error: "Missing text or language" }, { status: 400 })
    }

    let translation = text

    if (language === "hi" || language === "mr") {
      const map = translationMap[language] || {}

      const words = text.split(/\s+/)
      const translatedWords = words.map((word) => {
        // Try exact match first
        if (map[word]) return map[word]

        // Try case-insensitive match
        const lowerWord = word.toLowerCase()
        const foundEntry = Object.entries(map).find(([key]) => key.toLowerCase() === lowerWord)
        if (foundEntry) return foundEntry[1]

        // If no translation found, keep original word
        return word
      })

      translation = translatedWords.join(" ")
    }

    return NextResponse.json({ translation, original: text, language })
  } catch (error) {
    console.error("[v0] Translation error:", error)
    return NextResponse.json({ error: "Translation failed", details: String(error) }, { status: 500 })
  }
}
