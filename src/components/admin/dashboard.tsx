import { FC } from 'react'
import {
    useAdminDashboard,
    getSectionTitle,
    getSectionDescription
} from '@/context/admin/dashboard'
import { Card } from '@/components/ui/card'
import { Overview } from './sections/overview'
import { ParkingLots } from './sections/parking-lots'
import { ParkingSpaces } from './sections/parking-spaces'
import { Reservations } from './sections/reservations'
import { Users } from './sections/users'
import { Reports } from './sections/reports'
import { Settings } from './sections/settings'

const AdminDashboard: FC = () => {
    const { activeSection } = useAdminDashboard()

    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return <Overview />
            case 'parking-lots':
                return <ParkingLots />
            case 'parking-spaces':
                return <ParkingSpaces parkingLotId={0} />
            case 'reservations':
                return <Reservations />
            case 'users':
                return <Users />
            case 'reports':
                return <Reports />
            case 'settings':
                return <Settings />
            default:
                return <Overview />
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {getSectionTitle(activeSection) || 'Unknown Section'}
                    </h2>
                    <p className="text-muted-foreground">{getSectionDescription(activeSection)}</p>
                </div>
            </div>
            <div className="grid gap-4">
                <Card className="p-6">{renderSection()}</Card>
            </div>
        </div>
    )
}

export default AdminDashboard
