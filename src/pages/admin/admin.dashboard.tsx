import { AdminDashboardSection, useAdminDashboard } from '@/context/admin/dashboard'
import { ParkingLots } from '@/components/admin/sections/parking-lots'
import { Reservations } from '@/components/admin/sections/reservations'
import { Users } from '@/components/admin/sections/users'
import { Reports } from '@/components/admin/sections/reports'
import { Settings } from '@/components/admin/sections/settings'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar, AppSidebarNavigationType } from '@/components/user/app-sidebar'
import { Separator } from '@radix-ui/react-separator'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { useAdminAuth } from '@/context/admin/auth'
import { SquareTerminal } from 'lucide-react'
import ErrorBoundary from '@/components/common/ErrorBoundary'

const nav = [
    {
        title: 'Access',
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
                title: 'Overview',
                section: 'overview'
            },
            {
                title: 'Parking Lots',
                section: 'parking-lots'
            },
            {
                title: 'Reservations',
                section: 'reservations'
            },
            // {
            //     title: 'Parking Spaces',
            //     section: 'parking-spaces'
            // },
            {
                title: 'Users',
                section: 'users'
            },
            {
                title: 'Reports',
                section: 'reports'
            },
            {
                title: 'Settings',
                section: 'settings'
            }
        ]
    }
] as AppSidebarNavigationType<AdminDashboardSection>[]
export default function AdminDashboard() {
    const { activeSection, setActiveSection, headerTitle } = useAdminDashboard()
    const { admin, logout } = useAdminAuth()

    const renderContent = () => {
        switch (activeSection) {
            case 'parking-lots':
                return <ParkingLots />
            case 'reservations':
                return <Reservations />
            // case 'parking-spaces':
            //     return <ParkingSpaces parkingLotId={0} />
            case 'users':
                return <Users />
            case 'reports':
                return <Reports />
            case 'settings':
                return <Settings />
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
                            <div className="col-span-1">
                                <Users />
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar
                onNotificationClick={()=>{}}
                onLogout={logout}
                navigation={nav}
                user={{
                    username: admin?.username || 'Admin',
                    email: admin?.email || 'admin@example.com',
                    avatarUrl: admin?.avatar_url || '/avatars/default.jpg',
                    userType: admin?.role || 'Admin'
                }}
                header={headerTitle}
                activeSection={activeSection}
                updateSection={(section: AdminDashboardSection) => {
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
                    <div className="">
                        <div>
                            <ErrorBoundary
                                renderFallback={() => (
                                    <div className="text-red-500">
                                        Something went wrong while loading this section.
                                    </div>
                                )}
                            >
                                {renderContent()}
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
