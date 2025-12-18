// First, let's define the proper data structure
export interface BNSSection {
  section_number: string
  title: string
  description: string
  punishment?: string
  keywords?: string[]
  category?: string
  cognizable?: string
  bailable?: string
  court?: string
  explanation?: string[]
  illustration?: string[]
  exception?: string[]
}

// BNS Sections database with comprehensive data
// This is a sample with common crime sections - in production this would be imported from the JSON file
export const BNS_SECTIONS_DATABASE: BNSSection[] = [
  {
    section_number: "103",
    title: "Hurt",
    description: "Whoever intentionally causes bodily pain, disease, or infirmity to any person is said to cause hurt.",
    punishment: "Imprisonment up to 6 months and/or fine up to Rs. 500",
    keywords: ["hurt", "bodily pain", "injury", "assault"],
    category: "Crimes Against Body",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
  {
    section_number: "104",
    title: "Wrongful Restraint",
    description: "Whoever wrongfully restrains any person is said to wrongfully restrain that person.",
    punishment: "Imprisonment up to 1 month and/or fine up to Rs. 250",
    keywords: ["restraint", "restrict", "detention", "confinement"],
    category: "Crimes Against Liberty",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
  {
    section_number: "105",
    title: "Wrongful Confinement",
    description: "Whoever wrongfully confines any person is said to wrongfully confine that person.",
    punishment: "Imprisonment up to 1 year and/or fine up to Rs. 1000",
    keywords: ["confinement", "imprisonment", "lock", "detention"],
    category: "Crimes Against Liberty",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
  {
    section_number: "106",
    title: "Criminal Force",
    description:
      "Whoever intentionally uses force to any person, without that person's consent, in order by means of such force to cause, or knowing it to be likely that by means of such force he will cause death, or hurt, or fear of injury or of death to that person, is said to use criminal force.",
    punishment: "Imprisonment up to 3 months and/or fine up to Rs. 250",
    keywords: ["force", "criminal", "violent", "aggressive"],
    category: "Crimes Against Body",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
  {
    section_number: "107",
    title: "Abetment of Offence",
    description:
      "Abetment of the commission of an offence which is capital in its nature, in cases in which no express provision is made by this Code for the punishment of abetment, shall, if the offence be committed in consequence of the abetment, be punished with death or life imprisonment.",
    punishment: "Variable based on principal offence",
    keywords: ["abetment", "conspiracy", "instigate", "encourage"],
    category: "General Criminal Law",
    cognizable: "Yes",
    bailable: "Non-bailable",
    court: "Sessions",
  },
  {
    section_number: "152",
    title: "Wrongful Confinement for Extortion",
    description: "Wrongful confinement to extort property or to constrain to an illegal act.",
    punishment: "Imprisonment up to 2 years and/or fine up to Rs. 2000",
    keywords: ["extortion", "confinement", "ransom", "blackmail"],
    category: "Extortion Offences",
    cognizable: "Yes",
    bailable: "Non-bailable",
    court: "Sessions",
  },
  {
    section_number: "158",
    title: "Causing Disappearance of Evidence of Offence",
    description: "Causing disappearance of evidence with intent to screen offender from punishment.",
    punishment: "Imprisonment up to 7 years and fine up to Rs. 1 lakh",
    keywords: ["evidence", "destruction", "tampering", "obstruction"],
    category: "Obstruction of Justice",
    cognizable: "Yes",
    bailable: "Non-bailable",
    court: "Sessions",
  },
  {
    section_number: "191",
    title: "Giving False Evidence",
    description:
      "Whoever being legally bound by oath or legal obligation makes any statement which is false and which he knows or believes to be false or does not believe to be true.",
    punishment: "Imprisonment up to 7 years and fine up to Rs. 1 lakh",
    keywords: ["perjury", "false", "lying", "testimony"],
    category: "Perjury",
    cognizable: "Yes",
    bailable: "Non-bailable",
    court: "Sessions",
  },
  {
    section_number: "351",
    title: "Punishment for Criminal Intimidation",
    description:
      "Criminal intimidation by an anonymous communication or a communication in which the name of the accused is concealed.",
    punishment: "Imprisonment up to 3 months and/or fine up to Rs. 250",
    keywords: ["threat", "intimidation", "extortion", "blackmail"],
    category: "Crimes Against Body",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
  {
    section_number: "356",
    title: "Theft",
    description:
      "Theft is the taking of personal property by another with intent to deprive the owner of use or possession, either permanently or temporarily.",
    punishment: "Imprisonment up to 3 years and/or fine up to Rs. 5000",
    keywords: ["theft", "stealing", "robbery", "larceny"],
    category: "Theft and Robbery",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
  {
    section_number: "357",
    title: "Punishment for Theft",
    description:
      "Whoever commits theft shall, for the first conviction, be punished with imprisonment which may extend to three years, or with fine which may extend to five thousand rupees, or with both.",
    punishment: "Imprisonment up to 3 years and/or fine up to Rs. 5000",
    keywords: ["theft", "stealing", "punishment"],
    category: "Theft and Robbery",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
  {
    section_number: "370",
    title: "Trafficking in Human Beings",
    description:
      "Whoever recruits, transports, transfers, harbours, transfers, buys, sells or exchanges or facilitates acquisition, sale, purchase, transfer, harboring or exchange of a person.",
    punishment: "Rigorous imprisonment up to 10 years and fine up to Rs. 10 lakhs",
    keywords: ["trafficking", "human", "smuggling", "abduction"],
    category: "Crimes Against Women",
    cognizable: "Yes",
    bailable: "Non-bailable",
    court: "Sessions",
  },
  {
    section_number: "376",
    title: "Punishment for Rape",
    description:
      "Whoever commits rape shall be punished with imprisonment of either description for a term which shall not be less than ten years, but which may be for life.",
    punishment: "Rigorous imprisonment not less than 10 years to life",
    keywords: ["rape", "sexual assault", "sexual violence"],
    category: "Crimes Against Women",
    cognizable: "Yes",
    bailable: "Non-bailable",
    court: "Sessions",
  },
  {
    section_number: "506",
    title: "Criminal Intimidation",
    description:
      "Whoever commits the offence of criminal intimidation shall be punished with imprisonment which may extend to three months, or with fine which may extend to Rs. 250.",
    punishment: "Imprisonment up to 3 months and/or fine up to Rs. 250",
    keywords: ["intimidation", "threat", "warning", "danger"],
    category: "Crimes Against Body",
    cognizable: "No",
    bailable: "Bailable",
    court: "Magistrate",
  },
]

// Function to search BNS sections by section number, title, keywords, or description
export function searchBNSSections(query: string): BNSSection[] {
  const lowerQuery = query.toLowerCase()

  return BNS_SECTIONS_DATABASE.filter(
    (section) =>
      section.section_number.toLowerCase().includes(lowerQuery) ||
      section.title.toLowerCase().includes(lowerQuery) ||
      section.description.toLowerCase().includes(lowerQuery) ||
      section.keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery)) ||
      section.punishment?.toLowerCase().includes(lowerQuery),
  )
}

// Function to get a specific BNS section by section number
export function getBNSSection(sectionNumber: string): BNSSection | undefined {
  return BNS_SECTIONS_DATABASE.find((s) => s.section_number === sectionNumber)
}

// Function to get all BNS sections sorted by section number
export function getAllBNSSectionsSorted(): BNSSection[] {
  return [...BNS_SECTIONS_DATABASE].sort((a, b) => {
    const numA = Number.parseInt(a.section_number)
    const numB = Number.parseInt(b.section_number)
    return numA - numB
  })
}

// Function to get sections by category
export function getBNSSectionsByCategory(category: string): BNSSection[] {
  return BNS_SECTIONS_DATABASE.filter((s) => s.category === category)
}

// Get all unique categories
export function getAllBNSCategories(): string[] {
  const categories = new Set<string>()
  BNS_SECTIONS_DATABASE.forEach((section) => {
    if (section.category) categories.add(section.category)
  })
  return Array.from(categories).sort()
}
