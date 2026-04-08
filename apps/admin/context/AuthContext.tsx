'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  role: 'admin' | 'viewer'
  name: string
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Attempt silent refresh on mount — uses HTTP-only cookie
  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/refresh`,
        {},
        { withCredentials: true } // sends the HTTP-only refresh cookie
      )
      const { accessToken: newToken, user: newUser } = res.data
      setAccessToken(newToken)
      setUser(newUser)
      return newToken
    } catch {
      setAccessToken(null)
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshToken().finally(() => setIsLoading(false))
  }, [refreshToken])

  // Axios interceptor — attach access token to every request
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    })

    const resInterceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true
          const newToken = await refreshToken()
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`
            return axios(original)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(reqInterceptor)
      axios.interceptors.response.eject(resInterceptor)
    }
  }, [accessToken, refreshToken])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password },
        { withCredentials: true } // receive HTTP-only refresh cookie
      )
      setAccessToken(res.data.accessToken)
      setUser(res.data.user)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true })
    } finally {
      setAccessToken(null)
      setUser(null)
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
