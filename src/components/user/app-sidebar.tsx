'use client'

import { Command, LucideIcon } from 'lucide-react'

import { SectionNavigation } from '@/components/user/nav-main'
// import { NavProjects } from '@/components/user/nav-projects'
import { NavUser, NavUserPropType } from '@/components/user/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar
} from '@/components/ui/sidebar'
import { ModeToggle } from '../theme.toggle'
import { useWebSocket } from '@/context/websocket'
import { useEffect } from 'react'
import { toast } from 'sonner'

export interface AppSidebarNavigationType<SEC_TYPE> {
    title: string
    icon?: LucideIcon
    isActive?: boolean
    items?: { title: string; section: SEC_TYPE }[]
}

export function AppSidebar<SEC_TYPE>({
    navigation,
    user,
    header,
    activeSection,
    updateSection,
    onLogout,
    onNotificationClick
}: {
    user: NavUserPropType
    header: { title: string; description: string }
    activeSection: SEC_TYPE
    navigation: AppSidebarNavigationType<SEC_TYPE>[]
    onLogout: () => void
    onNotificationClick: () => void
    updateSection: (section: SEC_TYPE) => void
}) {
    const { state } = useSidebar()
    const { notifications } = useWebSocket()

    useEffect(() => {
        notifications.map((value) => {
            toast(value.message)
        })
    }, [notifications])

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row items-center gap-2 mt-2">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shrink-0">
                        <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                        <span className="truncate font-medium">{header.title}</span>
                        <span className="truncate text-xs">{header.description}</span>
                    </div>

                    {state === 'expanded' && (
                        <div>
                            <ModeToggle />
                        </div>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SectionNavigation
                    label="Services"
                    currentSection={activeSection}
                    onSectionNavigation={(section) => {
                        updateSection(section)
                    }}
                    items={navigation}
                />
                {/* {user?.userType === 'admin' && <NavProjects projects={projects} />} */}
            </SidebarContent>

            <SidebarFooter>
                {user && (
                    <NavUser
                        onNotificationClick={onNotificationClick}
                        user={user}
                        onLogout={onLogout}
                    />
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
