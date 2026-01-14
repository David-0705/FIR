import bnsJson from "./bns.json"

/* ---------------- TYPES ---------------- */

export interface BNSSubSection {
  sub_section: string
  punishment: string
  cognizable: string
  bailable: string
  court: string
}

export interface BNSSection {
  section_number: string
  title: string
  description: string

  // optional / legacy fields (kept, NOT removed)
  punishment?: string
  keywords?: string[]
  category?: string
  cognizable?: string
  bailable?: string
  court?: string
  explanation?: string[]
  illustration?: string[]
  exception?: string[]

  // ✅ NEW (from your real JSON)
  sub_sections?: BNSSubSection[]
}

/* ---------------- DATA ---------------- */

// ✅ SINGLE SOURCE OF TRUTH (your bns.json)
export const BNS_SECTIONS_DATABASE: BNSSection[] =
  bnsJson as BNSSection[]

/* ---------------- HELPERS ---------------- */

// 🔍 Search across section + sub-sections
export function searchBNSSections(query: string): BNSSection[] {
  const q = query.toLowerCase()

  return BNS_SECTIONS_DATABASE.filter((s) => {
    // Section-level checks
    const sectionMatch =
      s.section_number?.toLowerCase().includes(q) ||
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.punishment?.toLowerCase().includes(q) ||
      s.keywords?.some((k) => k?.toLowerCase().includes(q))

    // Sub-section safe checks
    const subSectionMatch =
      s.sub_sections?.some((ss) =>
        [
          ss.sub_section,
          ss.punishment,
          ss.cognizable,
          ss.bailable,
          ss.court,
        ]
          .filter(Boolean) // remove undefined fields
          .some((field) =>
            field!.toLowerCase().includes(q),
          ),
      ) ?? false

    return sectionMatch || subSectionMatch
  })
}


// 📌 Get section by number (e.g. "139")
export function getBNSSection(
  sectionNumber: string,
): BNSSection | undefined {
  return BNS_SECTIONS_DATABASE.find(
    (s) => s.section_number === sectionNumber,
  )
}

// 📚 Get all sections sorted
export function getAllBNSSectionsSorted(): BNSSection[] {
  return [...BNS_SECTIONS_DATABASE].sort(
    (a, b) =>
      Number(a.section_number) - Number(b.section_number),
  )
}

// 🗂️ Category filter (for older data compatibility)
export function getBNSSectionsByCategory(
  category: string,
): BNSSection[] {
  return BNS_SECTIONS_DATABASE.filter(
    (s) => s.category === category,
  )
}

// 🏷️ Unique categories
export function getAllBNSCategories(): string[] {
  return Array.from(
    new Set(
      BNS_SECTIONS_DATABASE
        .map((s) => s.category)
        .filter(Boolean),
    ),
  ) as string[]
}

// ⚖️ Get all punishments (sub-sections) of a section
export function getBNSSubSections(
  sectionNumber: string,
): BNSSubSection[] {
  const section = getBNSSection(sectionNumber)
  return section?.sub_sections ?? []
}
