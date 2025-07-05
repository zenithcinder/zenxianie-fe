import { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/apis/api.base'
import { API_ENDPOINTS, LoginResponse, User } from '@/lib/apis/api.constants'

interface AuthContextType {
    user: User | null
    setUser: (user: User | null) => void
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const UserAuthContext = createContext<AuthContextType | undefined>(undefined)

export function UserAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('user_token')
            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                // Set the token in API headers
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`

                // Fetch user profile
                const profileResponse = await api.get<User>(API_ENDPOINTS.AUTH.PROFILE)
                const userData = profileResponse.data
                console.log('👈👈👈👈👈')
                console.log(userData)
                // Verify that the user is not an admin
                if (userData.role !== 'user') {
                    throw new Error('Unauthorized access')
                }

                setUser(userData)
            } catch (error) {
                console.error('Auth initialization failed:', error)
                // Clear invalid tokens
                localStorage.removeItem('user_token')
                localStorage.removeItem('user_refresh_token')
                delete api.defaults.headers.common['Authorization']
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = useCallback(
        async (email: string, password: string) => {
            try {
                setIsLoading(true)
                const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
                    email,
                    password
                })
                const { access, refresh } = response.data

                // Set the tokens in localStorage and API headers
                localStorage.setItem('user_token', access)
                localStorage.setItem('user_refresh_token', refresh)
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`

                // Fetch user profile
                const profileResponse = await api.get<User>(API_ENDPOINTS.AUTH.PROFILE)
                const userData = profileResponse.data

                // Verify that the user is not an admin
                if (userData.role !== 'user') {
                    throw new Error('Unauthorized access')
                }

                setUser(userData)
                toast.success(`Welcome back, ${userData.username}!`)
                navigate('/user')
            } catch (error) {
                console.error('Login failed:', error)
                toast.error('Invalid credentials')
                throw error
            } finally {
                setIsLoading(false)
            }
        },
        [navigate]
    )

    const logout = useCallback(async () => {
        try {
            // Call logout endpoint to blacklist the token
            await api.post(API_ENDPOINTS.AUTH.LOGOUT)
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            localStorage.removeItem('user_token')
            localStorage.removeItem('user_refresh_token')
            delete api.defaults.headers.common['Authorization']
            setUser(null)
            navigate('/login')
        }
    }, [navigate])

    const contextValue = useMemo(
        () => ({
            user,
            setUser,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user && user.role === 'user',
        }),
        [user, isLoading, login, logout]
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return <UserAuthContext.Provider value={contextValue}>{children}</UserAuthContext.Provider>
}

export function useUserAuth() {
    const context = useContext(UserAuthContext)
    if (context === undefined) {
        throw new Error('useUserAuth must be used within a UserAuthProvider')
    }
    return context
}
