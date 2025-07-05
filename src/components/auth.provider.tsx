import { useLocation } from 'react-router-dom'
import { UserAuthProvider } from '@/context/user/auth'
import { AdminAuthProvider } from '@/context/admin/auth'

interface AuthProviderProps {
    children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const location = useLocation()
    const path = location.pathname

    // Check if the current path is for admin routes
    if (path.startsWith('/admin')) {
        return <AdminAuthProvider>{children}</AdminAuthProvider>
    }

    // Check if the current path is for user routes
    if (
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path.startsWith('/user') ||
        path.startsWith('/')
    ) {
        return <UserAuthProvider>{children}</UserAuthProvider>
    }

    // For public routes, render children without any auth provider
    return <>{children}</>
}
