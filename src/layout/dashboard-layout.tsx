import { Outlet } from 'react-router-dom'
import { UserDashboardProvider } from '@/context/user/dashboard'

export default function UserDashboardLayout() {
    return (
        <UserDashboardProvider>
            <main className="flex-1">
                <Outlet />
            </main>
        </UserDashboardProvider>
    )
}
