export interface User {
  id: string
  badgeNumber: string
  name: string
  rank: string
  station: string
  role: "officer" | "admin"
}

export interface LoginCredentials {
  badgeNumber: string
  password: string
}

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    badgeNumber: "PO001",
    password: "password123",
    name: "Officer John Smith",
    rank: "Police Officer",
    station: "Central Station",
    role: "officer",
  },
  {
    id: "2",
    badgeNumber: "SI001",
    password: "admin123",
    name: "Inspector Sarah Johnson",
    rank: "Sub Inspector",
    station: "Central Station",
    role: "admin",
  },
]

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.badgeNumber === credentials.badgeNumber && u.password === credentials.password)

  if (user) {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem("fir_user", JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  }

  return null
}

export const logout = () => {
  localStorage.removeItem("fir_user")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("fir_user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}
