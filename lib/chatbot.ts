export interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
  metadata?: {
    step?: string
    data?: any
  }
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  currentStep: string
  collectedData: Partial<ComplaintData>
  isCompleted: boolean
  createdFIRId?: string
  createdAt: string
}

export interface ComplaintData {
  complainantName: string
  complainantPhone: string
  complainantAddress: string
  incidentType: string
  incidentLocation: string
  incidentDateTime: string
  description: string
  priority: "Low" | "Medium" | "High" | "Critical"
  fatherHusbandName: string
  dateOfBirth: string
  nationality: string
  occupation: string
  policeStation: string
  district: string
  directionDistance: string
  beatNumber: string
  informationType: "Written" | "Oral"
  reasonForDelay: string
  propertiesInvolved: string
}

const CHAT_STEPS = {
  GREETING: "greeting",
  NAME: "name",
  PHONE: "phone",
  ADDRESS: "address",
  FATHER_HUSBAND: "father_husband",
  DOB: "dob",
  NATIONALITY: "nationality",
  OCCUPATION: "occupation",
  DISTRICT: "district",
  POLICE_STATION: "police_station",
  BEAT_NUMBER: "beat_number",
  DIRECTION_DISTANCE: "direction_distance",
  INCIDENT_TYPE: "incident_type",
  LOCATION: "location",
  DATE_TIME: "date_time",
  INFORMATION_TYPE: "information_type",
  DESCRIPTION: "description",
  REASON_FOR_DELAY: "reason_for_delay",
  PROPERTIES_INVOLVED: "properties_involved",
  PRIORITY: "priority",
  CONFIRMATION: "confirmation",
  COMPLETED: "completed",
}

const INCIDENT_TYPES = [
  "Theft",
  "Robbery",
  "Burglary",
  "Assault",
  "Domestic Violence",
  "Fraud",
  "Cybercrime",
  "Drug Offense",
  "Traffic Violation",
  "Vandalism",
  "Missing Person",
  "Other",
]

import { createFIR } from "./fir"

export class ChatbotService {
  private sessions: Map<string, ChatSession> = new Map()

  createSession(): ChatSession {
    const sessionId = Date.now().toString()
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      currentStep: CHAT_STEPS.GREETING,
      collectedData: {},
      isCompleted: false,
      createdAt: new Date().toISOString(),
    }

    this.sessions.set(sessionId, session)
    this.addBotMessage(session, this.getGreetingMessage())

    return session
  }

  async processMessage(sessionId: string, userMessage: string): Promise<ChatMessage[]> {
    const session = this.sessions.get(sessionId)
    if (!session) throw new Error("Session not found")

    this.addUserMessage(session, userMessage)
    const botResponse = await this.processStep(session, userMessage)
    this.addBotMessage(session, botResponse)

    return session.messages
  }

  private async processStep(session: ChatSession, userInput: string): Promise<string> {
    const step = session.currentStep
    const data = session.collectedData

    switch (step) {
      case CHAT_STEPS.GREETING:
        session.currentStep = CHAT_STEPS.NAME
        return "Hello! I'm your AI Assistant for filing police complaints. I'll help you register a First Information Report (FIR) by collecting all necessary details.\n\nThis process will take about 10-15 minutes. Let's start with your personal information.\n\nWhat is your full name?"

      case CHAT_STEPS.NAME:
        if (userInput.trim().length < 2) {
          return "Please provide your full name (at least 2 characters)."
        }
        ;(data as any).complainantName = userInput.trim()
        session.currentStep = CHAT_STEPS.PHONE
        return `Thank you, ${data.complainantName}. What is your phone number? (Please provide a 10-digit number or with country code)`

      case CHAT_STEPS.PHONE:
        const phoneRegex = /^[+]?[0-9\-\s()]{10,15}$/
        if (!phoneRegex.test(userInput.trim())) {
          return "Please provide a valid phone number (10-15 digits)."
        }
        ;(data as any).complainantPhone = userInput.trim()
        session.currentStep = CHAT_STEPS.ADDRESS
        return "What is your complete address? (Include street, area, city, state, and zip code)"

      case CHAT_STEPS.ADDRESS:
        if (userInput.trim().length < 10) {
          return "Please provide your complete address (at least 10 characters)."
        }
        ;(data as any).complainantAddress = userInput.trim()
        session.currentStep = CHAT_STEPS.FATHER_HUSBAND
        return "What is your father's or husband's name? (If not applicable, you can type 'N/A')"

      case CHAT_STEPS.FATHER_HUSBAND:
        ;(data as any).fatherHusbandName = userInput.trim() || "N/A"
        session.currentStep = CHAT_STEPS.DOB
        return "What is your date of birth? (Format: YYYY-MM-DD or you can type 'N/A')"

      case CHAT_STEPS.DOB:
        ;(data as any).dateOfBirth = userInput.trim() || "N/A"
        session.currentStep = CHAT_STEPS.NATIONALITY
        return "What is your nationality?"

      case CHAT_STEPS.NATIONALITY:
        ;(data as any).nationality = userInput.trim() || "Indian"
        session.currentStep = CHAT_STEPS.OCCUPATION
        return "What is your occupation?"

      case CHAT_STEPS.OCCUPATION:
        ;(data as any).occupation = userInput.trim() || "Not specified"
        session.currentStep = CHAT_STEPS.DISTRICT
        return "Now let's collect incident location details. What is the district where this incident occurred?"

      case CHAT_STEPS.DISTRICT:
        ;(data as any).district = userInput.trim()
        session.currentStep = CHAT_STEPS.POLICE_STATION
        return "Which Police Station has jurisdiction over this area? (Enter the police station name)"

      case CHAT_STEPS.POLICE_STATION:
        ;(data as any).policeStation = userInput.trim()
        session.currentStep = CHAT_STEPS.BEAT_NUMBER
        return "What is the beat number? (If you don't know, type 'Unknown')"

      case CHAT_STEPS.BEAT_NUMBER:
        ;(data as any).beatNumber = userInput.trim() || "Unknown"
        session.currentStep = CHAT_STEPS.DIRECTION_DISTANCE
        return "What is the direction and distance from the police station? (e.g., '2 km North' or 'Unknown')"

      case CHAT_STEPS.DIRECTION_DISTANCE:
        ;(data as any).directionDistance = userInput.trim() || "Unknown"
        session.currentStep = CHAT_STEPS.INCIDENT_TYPE
        return `What type of incident would you like to report?\n\nAvailable options:\n${INCIDENT_TYPES.map((type, index) => `${index + 1}. ${type}`).join("\n")}\n\nYou can type the number or the incident type.`

      case CHAT_STEPS.INCIDENT_TYPE:
        const incidentType = this.parseIncidentType(userInput)
        if (!incidentType) {
          return `Please select a valid incident type:\n${INCIDENT_TYPES.map((type, index) => `${index + 1}. ${type}`).join("\n")}`
        }
        ;(data as any).incidentType = incidentType
        session.currentStep = CHAT_STEPS.LOCATION
        return "Where did this incident occur? Please provide the specific location details."

      case CHAT_STEPS.LOCATION:
        if (userInput.trim().length < 5) {
          return "Please provide more details about the incident location."
        }
        ;(data as any).incidentLocation = userInput.trim()
        session.currentStep = CHAT_STEPS.DATE_TIME
        return "When did this incident occur? Please provide the date and time (e.g., 'January 15, 2024 at 3:30 PM' or 'yesterday evening')."

      case CHAT_STEPS.DATE_TIME:
        const dateTime = this.parseDateTime(userInput)
        if (!dateTime) {
          return "Please provide a valid date and time."
        }
        ;(data as any).incidentDateTime = dateTime
        session.currentStep = CHAT_STEPS.INFORMATION_TYPE
        return "Is this information being reported in written form or orally?\n\n1. Written\n2. Oral\n\nPlease type 1 or 2."

      case CHAT_STEPS.INFORMATION_TYPE:
        const infoType = userInput.toLowerCase().includes("oral") || userInput.trim() === "2" ? "Oral" : "Written"
        ;(data as any).informationType = infoType
        session.currentStep = CHAT_STEPS.DESCRIPTION
        return "Please provide a detailed description of what happened. Include as much relevant information as possible. (At least 20 characters)"

      case CHAT_STEPS.DESCRIPTION:
        if (userInput.trim().length < 20) {
          return "Please provide a more detailed description (at least 20 characters) of what happened."
        }
        ;(data as any).description = userInput.trim()
        session.currentStep = CHAT_STEPS.REASON_FOR_DELAY
        return "Was there any delay in reporting this incident? If yes, please explain the reason. (If no delay, type 'No delay')"

      case CHAT_STEPS.REASON_FOR_DELAY:
        ;(data as any).reasonForDelay = userInput.trim() || "No delay"
        session.currentStep = CHAT_STEPS.PROPERTIES_INVOLVED
        return "Were any properties involved or stolen? If yes, please list them. (If no, type 'None')"

      case CHAT_STEPS.PROPERTIES_INVOLVED:
        ;(data as any).propertiesInvolved = userInput.trim() || "None"
        session.currentStep = CHAT_STEPS.PRIORITY
        return "How would you rate the priority of this incident?\n\n1. Low - Minor issues, no immediate danger\n2. Medium - Moderate concern, needs attention\n3. High - Serious matter, requires prompt action\n4. Critical - Emergency, immediate response needed\n\nPlease type the number or priority level."

      case CHAT_STEPS.PRIORITY:
        const priority = this.parsePriority(userInput)
        if (!priority) {
          return "Please select a valid priority:\n1. Low\n2. Medium\n3. High\n4. Critical"
        }
        ;(data as any).priority = priority
        session.currentStep = CHAT_STEPS.CONFIRMATION
        return this.generateConfirmationMessage(data as ComplaintData)

      case CHAT_STEPS.CONFIRMATION:
        if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("confirm")) {
          try {
            const bnsSuggestions = await this.suggestBNSSection(data as ComplaintData)
            const bnsArray = bnsSuggestions.length > 0 ? bnsSuggestions.map((s) => s.section) : []

            const badgeNumber = "CHATBOT001"

            const newFIR = await createFIR(
              {
                complainantName: data.complainantName || "",
                complainantPhone: data.complainantPhone || "",
                complainantAddress: data.complainantAddress || "",
                incidentType: data.incidentType || "",
                incidentLocation: data.incidentLocation || "",
                incidentDateTime: data.incidentDateTime || "",
                description: data.description || "",
                priority: data.priority || "Medium",
                fatherHusbandName: data.fatherHusbandName || "N/A",
                dateOfBirth: data.dateOfBirth || "N/A",
                nationality: data.nationality || "Indian",
                occupation: data.occupation || "",
                policeStation: data.policeStation || "",
                district: data.district || "",
                directionDistance: data.directionDistance || "",
                beatNumber: data.beatNumber || "",
                informationType: data.informationType || "Written",
                reasonForDelay: data.reasonForDelay || "",
                propertiesInvolved: data.propertiesInvolved || "",
              },
              badgeNumber,
              bnsArray,
            )

            session.currentStep = CHAT_STEPS.COMPLETED
            session.isCompleted = true
            session.createdFIRId = newFIR.id

            let response =
              "✅ Perfect! Your complaint has been recorded and will be processed shortly. A police officer will contact you soon.\n\n"
            response += `📋 FIR Number: ${newFIR.firNumber}\n`
            response += `🔗 Reference ID: ${newFIR.id}\n\n`

            if (bnsSuggestions.length > 0) {
              response += `📜 Applicable BNS Sections:\n`
              bnsSuggestions.slice(0, 5).forEach((s, i) => {
                response += `${i + 1}. ${s.section} (${s.confidence}% match)\n`
              })
              response += `\n`
            }

            response +=
              "You can now download your FIR PDF using the download button at the top. Is there anything else I can help you with?"
            return response
          } catch (error) {
            console.error("Error creating FIR from chatbot:", error)
            session.currentStep = CHAT_STEPS.COMPLETED
            session.isCompleted = true
            return "Your complaint has been recorded successfully! A police officer will contact you soon for further details."
          }
        } else if (userInput.toLowerCase().includes("no") || userInput.toLowerCase().includes("edit")) {
          session.currentStep = CHAT_STEPS.NAME
          session.collectedData = {}
          return "No problem! Let's start over. What is your full name?"
        } else {
          return "Please type 'yes' to confirm and submit your complaint, or 'no' to start over."
        }

      case CHAT_STEPS.COMPLETED:
        return "Your complaint has already been submitted. You can download your FIR PDF using the button at the top. Is there anything else I can help you with? You can start a new complaint by typing 'new complaint'."

      default:
        return "I'm sorry, something went wrong. Let's start over. What is your full name?"
    }
  }

  private parseIncidentType(input: string): string | null {
    const trimmed = input.trim().toLowerCase()
    const num = Number.parseInt(trimmed)
    if (num >= 1 && num <= INCIDENT_TYPES.length) {
      return INCIDENT_TYPES[num - 1]
    }
    const match = INCIDENT_TYPES.find(
      (type) =>
        type.toLowerCase() === trimmed || type.toLowerCase().includes(trimmed) || trimmed.includes(type.toLowerCase()),
    )
    return match || null
  }

  private parsePriority(input: string): ComplaintData["priority"] | null {
    const trimmed = input.trim().toLowerCase()
    if (trimmed === "1" || trimmed.includes("low")) return "Low"
    if (trimmed === "2" || trimmed.includes("medium")) return "Medium"
    if (trimmed === "3" || trimmed.includes("high")) return "High"
    if (trimmed === "4" || trimmed.includes("critical") || trimmed.includes("emergency")) return "Critical"
    return null
  }

  private parseDateTime(input: string): string | null {
    const now = new Date()
    const trimmed = input.trim().toLowerCase()

    try {
      if (trimmed.includes("today")) {
        return now.toISOString()
      }
      if (trimmed.includes("yesterday")) {
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        return yesterday.toISOString()
      }
      if (trimmed.includes("morning")) {
        const morning = new Date(now)
        morning.setHours(8, 0, 0, 0)
        return morning.toISOString()
      }
      if (trimmed.includes("evening") || trimmed.includes("tonight")) {
        const evening = new Date(now)
        evening.setHours(18, 0, 0, 0)
        return evening.toISOString()
      }

      const parsed = new Date(input)
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString()
      }

      return now.toISOString()
    } catch {
      return now.toISOString()
    }
  }

  private generateConfirmationMessage(data: ComplaintData): string {
    return (
      `Please review your FIR details:\n\n` +
      `👤 Complainant Name: ${data.complainantName}\n` +
      `📞 Phone: ${data.complainantPhone}\n` +
      `📍 Address: ${data.complainantAddress}\n` +
      `👨‍👩‍👧 Father's/Husband's Name: ${data.fatherHusbandName}\n` +
      `📅 Date of Birth: ${data.dateOfBirth}\n` +
      `🌍 Nationality: ${data.nationality}\n` +
      `💼 Occupation: ${data.occupation}\n\n` +
      `📍 Location Details:\n` +
      `District: ${data.district} | PS: ${data.policeStation}\n` +
      `Beat No: ${data.beatNumber} | Direction: ${data.directionDistance}\n\n` +
      `🚨 Incident Type: ${data.incidentType}\n` +
      `📍 Incident Location: ${data.incidentLocation}\n` +
      `📅 Date/Time: ${new Date(data.incidentDateTime).toLocaleString()}\n` +
      `📝 Description: ${data.description.substring(0, 100)}...\n` +
      `⚠️ Priority: ${data.priority}\n` +
      `📋 Information Type: ${data.informationType}\n\n` +
      `Is this information correct? Type 'yes' to submit or 'no' to start over.`
    )
  }

  private getGreetingMessage(): string {
    return "Hello! I'm your AI Assistant for filing police complaints. I'll help you register a First Information Report (FIR) by collecting all necessary details.\n\nThis process will take about 10-15 minutes. Are you ready to begin?"
  }

  private addUserMessage(session: ChatSession, content: string) {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toISOString(),
    }
    session.messages.push(message)
  }

  private addBotMessage(session: ChatSession, content: string) {
    const message: ChatMessage = {
      id: Date.now().toString() + "_bot",
      type: "bot",
      content,
      timestamp: new Date().toISOString(),
      metadata: {
        step: session.currentStep,
        data: { ...session.collectedData },
      },
    }
    session.messages.push(message)
  }

  getSession(sessionId: string): ChatSession | null {
    return this.sessions.get(sessionId) || null
  }

  private async suggestBNSSection(data: ComplaintData): Promise<Array<{ section: string; confidence: number }>> {
    try {
      const { bnsSuggestionService } = await import("./bns-suggestions")
      const suggestions = await bnsSuggestionService.suggestBNSSections(
        data.incidentType,
        data.description,
        data.incidentLocation,
      )

      return suggestions
        .filter((s) => s.confidence > 40)
        .slice(0, 5)
        .map((s) => ({
          section: `${s.section.section_number} - ${s.section.title}`,
          confidence: Math.round(s.confidence),
        }))
    } catch (error) {
      console.error("Error getting BNS suggestions:", error)
      return []
    }
  }
}

export const chatbotService = new ChatbotService()
