import { createContext, useContext, useState, ReactNode, FC, useMemo } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type AdminDashboardSection =
    | 'overview'
    | 'parking-lots'
    | 'parking-spaces'
    | 'reservations'
    | 'users'
    | 'reports'
    | 'settings'

export interface DashboardHeaderTitle {
    title: string
    description: string
}

interface AdminDashboardContextType {
    activeSection: AdminDashboardSection
    headerTitle: DashboardHeaderTitle
    setActiveSection: (section: AdminDashboardSection) => void
}

const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined)

const AdminDashboardProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState<AdminDashboardSection>('overview')
    const [headerTitle, setHeaderTitle] = useState<DashboardHeaderTitle>({
        title: '',
        description: ''
    })

    useEffect(() => {
        setHeaderTitle({
            title: import.meta.env.VITE_APP_TITLE || '',
            description: import.meta.env.VITE_SHORT_APP_DESC || ''
        })
    }, [])

    // Update activeSection based on URL search parameter
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const section = searchParams.get('section') as AdminDashboardSection
        
        if (section && Object.keys(sectionTitles).includes(section)) {
            setActiveSection(section)
        } else {
            setActiveSection('overview')
        }
    }, [location.search])

    // Function to update section and URL
    const updateSection = (section: AdminDashboardSection) => {
        setActiveSection(section)
        const searchParams = new URLSearchParams(location.search)
        searchParams.set('section', section)
        navigate({
            pathname: location.pathname,
            search: searchParams.toString()
        })
    }

    return (
        <AdminDashboardContext.Provider
            value={useMemo(
                () => ({ 
                    activeSection, 
                    setActiveSection: updateSection, 
                    headerTitle 
                }),
                [activeSection, headerTitle, location.pathname]
            )}
        >
            {children}
        </AdminDashboardContext.Provider>
    )
}

const useAdminDashboard = (): AdminDashboardContextType => {
    const context = useContext(AdminDashboardContext)
    if (!context) {
        throw new Error('useAdminDashboard must be used within an AdminDashboardProvider')
    }
    return context
}

const sectionTitles: Record<AdminDashboardSection, string> = {
    overview: 'Dashboard Overview',
    'parking-lots': 'Parking Lots Management',
    'parking-spaces': 'Parking Spaces Management',
    reservations: 'Reservations Management',
    users: 'User Management',
    reports: 'Reports & Analytics',
    settings: 'System Settings'
}

const sectionDescriptions: Record<AdminDashboardSection, string> = {
    overview: 'View your dashboard overview and quick actions',
    'parking-lots': 'Manage parking locations and slots',
    'parking-spaces': 'Manage individual parking spaces and their status',
    reservations: 'View and manage all parking reservations',
    users: 'Manage user accounts and permissions',
    reports: 'View system reports and analytics',
    settings: 'Configure system settings and preferences'
}

// Helper function to get section title
export const getSectionTitle = (section: AdminDashboardSection): string => sectionTitles[section]

// Helper function to get section description
export const getSectionDescription = (section: AdminDashboardSection): string =>
    sectionDescriptions[section]

export { AdminDashboardProvider, useAdminDashboard } 