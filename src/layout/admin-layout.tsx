import { Outlet } from 'react-router-dom'
import { AdminDashboardProvider } from '@/context/admin/dashboard'
import { AdminAuthProvider } from '@/context/admin/auth'

export default function AdminLayout() {
    return (
        <AdminAuthProvider>
            <AdminDashboardProvider>
                <main className="flex-1">
                    <Outlet />
                </main>
            </AdminDashboardProvider>
        </AdminAuthProvider>
    )
} 