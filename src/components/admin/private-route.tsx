import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/context/admin/auth'

export default function PrivateRoute() {
    const { isAuthenticated, isLoading } = useAdminAuth()

    if (isLoading) {
        return <div>Loading...</div> // You can replace this with a proper loading component
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />
    }

    return <Outlet />
}
