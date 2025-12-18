export interface FIR {
  id: string
  firNumber: string
  dateTime: string
  complainantName: string
  complainantPhone: string
  complainantAddress: string
  incidentType: string
  incidentLocation: string
  incidentDateTime: string
  description: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Registered" | "Under Investigation" | "Evidence Collection" | "Pending" | "Closed"
  assignedOfficer: string
  bnsSection?: string
  bnsSections?: string[] // Array of suggested BNS sections
  createdBy: string
  createdAt: string
  updatedAt: string
  fatherHusbandName?: string
  dateOfBirth?: string
  nationality?: string
  occupation?: string
  policeStation?: string
  district?: string
  directionDistance?: string
  beatNumber?: string
  informationType?: string
  reasonForDelay?: string
  propertiesInvolved?: string
}

export interface FIRFormData {
  complainantName: string
  complainantPhone: string
  complainantAddress: string
  incidentType: string
  incidentLocation: string
  incidentDateTime: string
  description: string
  priority: "Low" | "Medium" | "High" | "Critical"
  fatherHusbandName?: string
  dateOfBirth?: string
  nationality?: string
  occupation?: string
  policeStation?: string
  district?: string
  directionDistance?: string
  beatNumber?: string
  informationType?: "Written" | "Oral"
  reasonForDelay?: string
  propertiesInvolved?: string
}

// Mock FIR data
const mockFIRs: FIR[] = [
  {
    id: "1",
    firNumber: "FIR001/2024",
    dateTime: "2024-01-15T10:30:00Z",
    complainantName: "Rajesh Kumar",
    complainantPhone: "+91-9876543210",
    complainantAddress: "123 Main Street, Delhi",
    incidentType: "Theft",
    incidentLocation: "Market Street, Central Delhi",
    incidentDateTime: "2024-01-15T08:00:00Z",
    description: "Mobile phone and wallet stolen from pocket while shopping in crowded market area.",
    priority: "High",
    status: "Under Investigation",
    assignedOfficer: "PO001",
    bnsSection: "Section 303 - Theft",
    createdBy: "PO001",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    firNumber: "FIR002/2024",
    dateTime: "2024-01-14T14:15:00Z",
    complainantName: "Priya Sharma",
    complainantPhone: "+91-9876543211",
    complainantAddress: "456 Park Avenue, Delhi",
    incidentType: "Assault",
    incidentLocation: "Park Avenue, South Delhi",
    incidentDateTime: "2024-01-14T12:00:00Z",
    description: "Physical assault by unknown person during evening walk in the park.",
    priority: "Medium",
    status: "Evidence Collection",
    assignedOfficer: "PO001",
    bnsSection: "Section 115 - Voluntarily causing hurt",
    createdBy: "SI001",
    createdAt: "2024-01-14T14:15:00Z",
    updatedAt: "2024-01-14T14:15:00Z",
  },
  {
    id: "3",
    firNumber: "FIR003/2024",
    dateTime: "2024-01-13T16:45:00Z",
    complainantName: "Amit Patel",
    complainantPhone: "+91-9876543212",
    complainantAddress: "789 Business District, Delhi",
    incidentType: "Fraud",
    incidentLocation: "Online/Digital",
    incidentDateTime: "2024-01-10T00:00:00Z",
    description: "Online banking fraud - unauthorized transactions totaling Rs. 50,000 from savings account.",
    priority: "Low",
    status: "Pending",
    assignedOfficer: "PO001",
    bnsSection: "Section 318 - Cheating",
    createdBy: "PO001",
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
]

const firStorage: FIR[] = [...mockFIRs]

export const getAllFIRs = async (): Promise<FIR[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...firStorage].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const getFIRById = async (id: string): Promise<FIR | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return firStorage.find((fir) => fir.id === id) || null
}

export const createFIR = async (formData: FIRFormData, createdBy: string, bnsSections?: string[]): Promise<FIR> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newFIR: FIR = {
    id: Date.now().toString(),
    firNumber: `FIR${String(firStorage.length + 1).padStart(3, "0")}/2024`,
    dateTime: new Date().toISOString(),
    ...formData,
    status: "Registered",
    assignedOfficer: createdBy,
    bnsSection: bnsSections?.[0], // Primary section
    bnsSections: bnsSections, // All suggested sections
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  firStorage.push(newFIR)
  return newFIR
}

export const updateFIR = async (id: string, formData: FIRFormData, bnsSections?: string[]): Promise<FIR | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const firIndex = firStorage.findIndex((fir) => fir.id === id)
  if (firIndex === -1) return null

  firStorage[firIndex] = {
    ...firStorage[firIndex],
    ...formData,
    bnsSection: bnsSections?.[0],
    bnsSections: bnsSections,
    updatedAt: new Date().toISOString(),
  }

  return firStorage[firIndex]
}

export const updateFIRStatus = async (id: string, status: FIR["status"]): Promise<FIR | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const firIndex = firStorage.findIndex((fir) => fir.id === id)
  if (firIndex === -1) return null

  firStorage[firIndex] = {
    ...firStorage[firIndex],
    status,
    updatedAt: new Date().toISOString(),
  }

  return firStorage[firIndex]
}

export const searchFIRs = async (query: string): Promise<FIR[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!query.trim()) return getAllFIRs()

  const lowercaseQuery = query.toLowerCase()
  return firStorage.filter(
    (fir) =>
      fir.firNumber.toLowerCase().includes(lowercaseQuery) ||
      fir.complainantName.toLowerCase().includes(lowercaseQuery) ||
      fir.incidentType.toLowerCase().includes(lowercaseQuery) ||
      fir.incidentLocation.toLowerCase().includes(lowercaseQuery) ||
      fir.description.toLowerCase().includes(lowercaseQuery),
  )
}

export const getIncidentTypes = () => [
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
