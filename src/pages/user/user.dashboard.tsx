import { AppSidebar, AppSidebarNavigationType } from '@/components/user/app-sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserDashboardSection, useUserDashboard } from '@/context/user/dashboard'
import ParkingLots from '@/components/user/sections/parking-lots'
import Reservations from '@/components/user/sections/reservations'
import Profile from '@/components/user/sections/profile'
import { useUserAuth } from '@/context/user/auth'
import { SquareTerminal } from 'lucide-react'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { WebSocketProvider } from '@/context/websocket'

const nav = [
    {
        title: 'Access',
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
                title: 'Overview',
                section: 'overview' as UserDashboardSection
            },
            {
                title: 'Parking Lots',
                section: 'parking-lots' as UserDashboardSection
            },
            {
                title: 'Reservations',
                section: 'reservations' as UserDashboardSection
            },
            {
                title: 'Profile',
                section: 'profile' as UserDashboardSection
            }
        ]
    }
] as AppSidebarNavigationType<UserDashboardSection>[]

export default function Dashboard() {
    const { activeSection, setActiveSection, headerTitle } = useUserDashboard()
    const { user, logout } = useUserAuth()

    const renderContent = () => {
        switch (activeSection) {
            case 'parking-lots':
                return <ParkingLots />
            case 'reservations':
                return <Reservations />
            case 'profile':
                return <Profile />
            case 'overview':
            default:
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="col-span-1">
                                <Reservations />
                            </div>
                            <div className="col-span-1">
                                <ParkingLots />
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <WebSocketProvider>
            <SidebarProvider>
                <AppSidebar
                    onNotificationClick={() => {}}
                    onLogout={logout}
                    navigation={nav}
                    user={{
                        username: user?.username || 'Admin',
                        email: user?.email || 'admin@example.com',
                        avatarUrl: user?.avatar_url || '/avatars/default.jpg',
                        userType: user?.role || 'Admin'
                    }}
                    header={headerTitle}
                    activeSection={activeSection}
                    updateSection={(section: UserDashboardSection) => {
                        setActiveSection(section)
                    }}
                />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        {headerTitle.title}
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{activeSection}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <ErrorBoundary
                            renderFallback={() => (
                                <div className="text-red-500">
                                    Something went wrong while loading this section.
                                </div>
                            )}
                        >
                            {renderContent()}
                        </ErrorBoundary>
                        {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </WebSocketProvider>
    )
}
