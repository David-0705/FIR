import { searchBNSSections, getAllBNSSectionsSorted, type BNSSection } from "./bns-data"

export interface BNSSuggestion {
  section: BNSSection
  confidence: number
  reasoning: string
  matchedKeywords: string[]
}

export class BNSSuggestionService {
  async suggestBNSSections(incidentType: string, description: string, location?: string): Promise<BNSSuggestion[]> {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const text = `${incidentType} ${description} ${location || ""}`.toLowerCase()
    const suggestions: BNSSuggestion[] = []
    const allSections = getAllBNSSectionsSorted()

    for (const section of allSections) {
      const analysis = this.analyzeComplaintContext(text, section)

      if (analysis.confidence > 15) {
        suggestions.push({
          section,
          confidence: Math.round(analysis.confidence),
          reasoning: analysis.reasoning,
          matchedKeywords: analysis.matchedKeywords,
        })
      }
    }

    // Sort by confidence and return top 5-10 suggestions
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10)
  }

  private analyzeComplaintContext(
    text: string,
    section: BNSSection,
  ): {
    confidence: number
    reasoning: string
    matchedKeywords: string[]
  } {
    const matchedKeywords: string[] = []
    let confidence = 0

    // 1. Direct keyword matching
    if (section.keywords) {
      let keywordMatches = 0
      for (const keyword of section.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          matchedKeywords.push(keyword)
          keywordMatches++
        }
      }

      const keywordDensity = section.keywords.length > 0 ? keywordMatches / section.keywords.length : 0
      confidence += keywordDensity * 40
    }

    // 2. Title and description matching
    if (
      section.title
        .toLowerCase()
        .split(" ")
        .some((word) => text.includes(word))
    ) {
      confidence += 15
    }

    if (
      section.description
        .toLowerCase()
        .split(" ")
        .some((word) => text.includes(word))
    ) {
      confidence += 10
    }

    // 3. Severity analysis based on punishment
    if (section.punishment) {
      const punishmentLower = section.punishment.toLowerCase()

      if (text.includes("death") && punishmentLower.includes("death")) {
        confidence += 25
      }
      if (text.includes("grievous") && punishmentLower.includes("grievous")) {
        confidence += 20
      }
      if (text.includes("murder") && punishmentLower.includes("life")) {
        confidence += 20
      }
      if (text.includes("theft") && punishmentLower.includes("theft")) {
        confidence += 15
      }
      if (text.includes("robbery") && punishmentLower.includes("robbery")) {
        confidence += 20
      }
    }

    // Cap confidence at 100
    confidence = Math.min(confidence, 100)

    const reasoning = this.generateReasoning(section, matchedKeywords, confidence)

    return { confidence, reasoning, matchedKeywords }
  }

  private generateReasoning(section: BNSSection, matchedKeywords: string[], confidence: number): string {
    let reasoning = ""

    if (confidence > 80) {
      reasoning = `High confidence match (${confidence}%) - `
    } else if (confidence > 60) {
      reasoning = `Strong match (${confidence}%) - `
    } else if (confidence > 40) {
      reasoning = `Moderate match (${confidence}%) - `
    } else {
      reasoning = `Possible match (${confidence}%) - `
    }

    const reasons = []

    if (matchedKeywords.length > 0) {
      reasons.push(`keywords: ${matchedKeywords.slice(0, 3).join(", ")}`)
    }

    if (section.punishment) {
      reasons.push(`punishment applicable: ${section.punishment.split(",")[0]}`)
    }

    if (reasons.length > 0) {
      reasoning += reasons.join(", ") + "."
    } else {
      reasoning += "based on incident analysis."
    }

    return reasoning
  }

  searchBNSSections(query: string): BNSSection[] {
    return searchBNSSections(query)
  }
}

export const bnsSuggestionService = new BNSSuggestionService()
