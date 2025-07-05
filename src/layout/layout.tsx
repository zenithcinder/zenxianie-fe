import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="min-h-screen relative">
            <Outlet />
        </div>
    )
}
