import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/apis/api.base'
import {User as AdminUser, API_ENDPOINTS, LoginResponse} from '@/lib/apis/api.constants'


interface AdminAuthContextType {
    admin: AdminUser | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('admin_token')
                if (token) {
                    // Set the token in the API headers
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

                    const response = await api.get<AdminUser>(API_ENDPOINTS.AUTH.PROFILE)
                    setAdmin(response.data)
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                localStorage.removeItem('admin_token')
                localStorage.removeItem('admin_refresh_token')
                delete api.defaults.headers.common['Authorization']
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true)
            const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
                email,
                password
            })
            const { access, refresh } = response.data


            // Set the tokens in localStorage and API headers
            localStorage.setItem('admin_token', access)
            localStorage.setItem('admin_refresh_token', refresh)
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`

            // Fetch admin profile
            const profileResponse = await api.get<AdminUser>(API_ENDPOINTS.AUTH.PROFILE)
            const adminData = profileResponse.data
            console.log('User profile:', adminData)
            console.log('User role:', adminData.role === 'admin')
            // Verify that the user is an admin
            if (adminData.role !== 'admin') {
                throw new Error('Unauthorized access')
            }

            setAdmin(adminData)
            toast.success(`Welcome back, ${adminData.username}!`)
            navigate('/admin')
        } catch (error) {
            console.error('Login failed:', error)
            toast.error('Invalid credentials')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            // Call logout endpoint to blacklist the token
            await api.post(API_ENDPOINTS.AUTH.LOGOUT)
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_refresh_token')
            delete api.defaults.headers.common['Authorization']
            setAdmin(null)
            toast.success('Logged out successfully')
            navigate('/admin/login')
        }
    }

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                isAuthenticated: !!admin,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    )
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext)
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider')
    }
    return context
}
