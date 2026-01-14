// lib/bns-suggestions.ts

import { getAllBNSSectionsSorted, type BNSSection } from "./bns-data"

// ---------------- INCIDENT KEYWORDS ----------------
const INCIDENT_KEYWORDS_MAP: Record<string, string[]> = {
  Theft: ["theft", "steal", "rob"],
  Robbery: ["robbery", "armed robbery", "robbed"],
  Burglary: ["burglary", "break-in", "house break"],
  Assault: ["assault", "attack", "hit", "physical harm"],
  "Domestic Violence": ["domestic violence", "wife abuse", "family violence"],
  Fraud: ["fraud", "cheating", "scam"],
  Cybercrime: ["cybercrime", "hacking", "phishing"],
  "Drug Offense": ["drug", "narcotics", "possession", "smuggling"],
  "Traffic Violation": ["traffic", "drunk driving", "rash driving"],
  Vandalism: ["vandalism", "damage", "destruction"],
  "Missing Person": ["missing", "lost", "kidnapped person"],
  Rape: ["rape", "sexual assault", "molestation"],
  Kidnap: ["kidnap", "abduction", "forcibly taken"],
  "Child Marriage": ["child marriage", "underage marriage"],
  Other: [],
}

// ---------------- TYPES ----------------
export interface BNSSuggestion {
  section: BNSSection
  confidence: number
  reasoning: string
  matchedKeywords: string[]
}

// ---------------- SERVICE ----------------
export class BNSSuggestionService {
  async suggestBNSSections(
    incidentType: string,
    description: string,
    location?: string
  ): Promise<BNSSuggestion[]> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const text = `${incidentType} ${description} ${location || ""}`.toLowerCase()
    const suggestions: BNSSuggestion[] = []
    const allSections = getAllBNSSectionsSorted()

    for (const section of allSections) {
      const analysis = this.analyzeComplaintContext(incidentType, text, section)

      if (analysis.confidence > 10) {
        suggestions.push({
          section,
          confidence: Math.round(analysis.confidence),
          reasoning: analysis.reasoning,
          matchedKeywords: analysis.matchedKeywords,
        })
      }
    }

    // Return top 5 suggestions
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
  }

  private analyzeComplaintContext(
    incidentType: string,
    text: string,
    section: BNSSection
  ): { confidence: number; reasoning: string; matchedKeywords: string[] } {
    const matchedKeywords: string[] = []
    const lowerText = text.toLowerCase()
    let confidence = 0

    // 1️⃣ Incident keywords matching (strong boost)
    const incidentKeywords = INCIDENT_KEYWORDS_MAP[incidentType] || []
    for (const kw of incidentKeywords) {
      if (
        lowerText.includes(kw.toLowerCase()) &&
        (section.title.toLowerCase().includes(kw.toLowerCase()) ||
          section.description.toLowerCase().includes(kw.toLowerCase()))
      ) {
        confidence += 80 // strong boost
        matchedKeywords.push(kw)
      }
    }

    // 2️⃣ Only if no incident keywords matched, do generic word matching (low weight)
    if (matchedKeywords.length === 0) {
      const titleWords = section.title.toLowerCase().split(/\s+/)
      const matchedTitle = titleWords.filter((word) => lowerText.includes(word))
      confidence += (matchedTitle.length / titleWords.length) * 20

      const descWords = section.description.toLowerCase().split(/\s+/)
      const matchedDesc = descWords.filter((word) => lowerText.includes(word))
      confidence += (matchedDesc.length / descWords.length) * 10
    }

    confidence = Math.min(confidence, 100)

    const reasoning =
      matchedKeywords.length > 0
        ? `Matched incident keywords: ${matchedKeywords.join(", ")}`
        : `Matched words in title/description.`

    return { confidence, reasoning, matchedKeywords }
  }
}

export const bnsSuggestionService = new BNSSuggestionService()
  