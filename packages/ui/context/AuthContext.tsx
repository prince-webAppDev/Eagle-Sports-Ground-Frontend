'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../lib/api'

interface User {
    id: string
    email: string
    role: 'admin' | 'viewer'
    username: string
    name?: string
}

interface AuthContextType {
    user: User | null
    accessToken: string | null
    isLoading: boolean
    login: (username: string, password: string) => Promise<User>
    logout: () => Promise<void>
    refreshToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const refreshToken = useCallback(async (): Promise<string | null> => {
        try {
            const res = await api.post(
                `/api/auth/refresh`,
                {},
                { withCredentials: true }
            )
            const { accessToken: newToken, admin: newUser } = res.data.data
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

    useEffect(() => {
        const reqInterceptor = api.interceptors.request.use((config) => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`
            }
            return config
        })

        const resInterceptor = api.interceptors.response.use(
            (res) => res,
            async (error) => {
                const original = error.config
                const isAuthRequest = original.url?.includes('/api/auth/login') ||
                    original.url?.includes('/api/auth/refresh') ||
                    original.url?.includes('/api/auth/logout')

                if (error.response?.status === 401 && !original._retry && !isAuthRequest) {
                    original._retry = true
                    const newToken = await refreshToken()
                    if (newToken) {
                        original.headers.Authorization = `Bearer ${newToken}`
                        return api(original)
                    }
                }
                return Promise.reject(error)
            }
        )

        return () => {
            api.interceptors.request.eject(reqInterceptor)
            api.interceptors.response.eject(resInterceptor)
        }
    }, [accessToken, refreshToken])

    const login = async (username: string, password: string): Promise<User> => {
        setIsLoading(true)
        try {
            const res = await api.post(
                `/api/auth/login`,
                { username, password },
                { withCredentials: true }
            )
            const { accessToken: token, admin } = res.data.data
            setAccessToken(token)
            setUser(admin)
            return admin
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            await api.post(`/api/auth/logout`, {}, { withCredentials: true })
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
