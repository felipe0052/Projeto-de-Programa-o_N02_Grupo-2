"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { login as apiLogin, signup as apiSignup, type LoginResponse } from "./api"

interface User {
  id: number
  name: string
  role: "student" | "instructor" | "admin"
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: "student" | "instructor") => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, senha: string) => {
    setIsLoading(true)
    const res: LoginResponse = await apiLogin(email, senha)
    const role = res.admin
      ? "admin"
      : res.roles.includes("INSTRUTOR")
        ? "instructor"
        : "student"
    setUser({ id: res.id, name: res.nome, role })
    setToken(res.jwt)
    try {
      localStorage.setItem("jwt", res.jwt)
    } catch {}
    setIsLoading(false)
  }

  const signup = async (name: string, email: string, _password: string, role: "student" | "instructor") => {
    setIsLoading(true)
    const roleCode = role === "instructor" ? "INSTRUTOR" : "ALUNO"
    const res: LoginResponse = await apiSignup(name, email, roleCode)
    const roleMapped = res.admin ? "admin" : res.roles.includes("INSTRUTOR") ? "instructor" : "student"
    setUser({ id: res.id, name: res.nome, role: roleMapped })
    setToken(res.jwt)
    try {
      localStorage.setItem("jwt", res.jwt)
    } catch {}
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem("jwt")
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
