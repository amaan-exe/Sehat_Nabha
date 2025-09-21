"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "patient" | "doctor" | "pharmacist" | "admin"
type Language = "en" | "hi" | "pa"

interface User {
  id: string
  phone: string
  role: UserRole
  name: string
  language: Language
  aadhaar?: string
  verified: boolean
}

interface AuthContextType {
  user: User | null
  login: (phone: string, otp: string, role: UserRole, language: Language) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("sehat-nabha-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("[v0] Error parsing stored user:", error)
        localStorage.removeItem("sehat-nabha-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (phone: string, otp: string, role: UserRole, language: Language): Promise<boolean> => {
    try {
      // Simulate OTP verification
      console.log("[v0] Verifying login:", { phone, otp, role, language })

      // In a real app, this would make an API call
      if (otp === "123456" || otp.length === 6) {
        const newUser: User = {
          id: Date.now().toString(),
          phone,
          role,
          name: `${role.charAt(0).toUpperCase() + role.slice(1)} ${phone.slice(-4)}`,
          language,
          verified: true,
        }

        setUser(newUser)
        localStorage.setItem("sehat-nabha-user", JSON.stringify(newUser))
        return true
      }
      return false
    } catch (error) {
      console.error("[v0] Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sehat-nabha-user")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("sehat-nabha-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
