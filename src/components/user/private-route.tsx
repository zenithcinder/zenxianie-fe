import { Navigate, Outlet } from 'react-router-dom'
import { useUserAuth } from '@/context/user/auth'

export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useUserAuth()

  if (isLoading) {
    return <div>Loading...</div> // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" replace />
  }

  return <Outlet />
} 