import { createContext, useContext, useState, ReactNode, FC, useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type UserDashboardSection =
    | 'overview'
    | 'parking-lots'
    | 'reservations'
    | 'profile'
    | 'admin-users'
    | 'admin-settings'
    | 'admin-reports'

export interface UserDashboardHeaderTitle {
    title: string
    description: string
}

interface UserDashboardContextType {
    activeSection: UserDashboardSection
    isAdmin: boolean
    headerTitle: UserDashboardHeaderTitle
    updateSection: (section: UserDashboardSection) => void
    setActiveSection: (section: UserDashboardSection) => void
    setIsAdmin: (isAdmin: boolean) => void
}

const UserDashboardContext = createContext<UserDashboardContextType | undefined>(undefined)

const UserDashboardProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState<UserDashboardSection>('overview')
    const [isAdmin, setIsAdmin] = useState(false)
    const [headerTitle, setHeaderTitle] = useState<UserDashboardHeaderTitle>({
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
        const section = searchParams.get('section') as UserDashboardSection

        if (section && Object.keys(sectionTitles).includes(section)) {
            setActiveSection(section)
            console.log(`Active section set to: ${section}`)
        } else {
            setActiveSection('overview')
        }
    }, [location.search])

    // Function to update section and URL
    const updateSection = useCallback(
        (section: UserDashboardSection) => {
            setActiveSection(section)
            const searchParams = new URLSearchParams(location.search)
            searchParams.set('section', section)
            navigate({
                pathname: location.pathname,
                search: searchParams.toString()
            })
        },
        [location.search, location.pathname, navigate]
    )

    return (
        <UserDashboardContext.Provider
            value={useMemo(
                () => ({
                    activeSection,
                    updateSection,
                    setActiveSection: updateSection,
                    isAdmin,
                    setIsAdmin,
                    headerTitle
                }),
                [activeSection, isAdmin, headerTitle, updateSection]
            )}
        >
            {children}
        </UserDashboardContext.Provider>
    )
}

const useUserDashboard = (): UserDashboardContextType => {
    const context = useContext(UserDashboardContext)
    if (!context) {
        throw new Error('useUserDashboard must be used within a UserDashboardProvider')
    }
    return context
}

const sectionTitles: Record<UserDashboardSection, string> = {
    overview: 'Dashboard Overview',
    'parking-lots': 'Parking Lots',
    reservations: 'Reservations',
    profile: 'Profile',
    'admin-users': 'User Management',
    'admin-settings': 'System Settings',
    'admin-reports': 'Reports & Analytics'
}

const sectionDescriptions: Record<UserDashboardSection, string> = {
    overview: 'View your dashboard overview and quick actions',
    'parking-lots': 'Manage and view parking lot information',
    reservations: 'View and manage your parking reservations',
    profile: 'Manage your account settings and preferences',
    'admin-users': 'Manage system users and permissions',
    'admin-settings': 'Configure system settings and preferences',
    'admin-reports': 'View system reports and analytics'
}

// Helper function to check if a section is admin-only
export const isAdminSection = (section: UserDashboardSection): boolean =>
    section.startsWith('admin-')

// Helper function to get section title
export const getSectionTitle = (section: UserDashboardSection): string => sectionTitles[section]

// Helper function to get section description
export const getSectionDescription = (section: UserDashboardSection): string =>
    sectionDescriptions[section]

export { UserDashboardProvider, useUserDashboard }
