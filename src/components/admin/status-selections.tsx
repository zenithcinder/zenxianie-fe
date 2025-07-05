import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

export type ParkingLotStatus = 'active' | 'maintenance' | 'closed'

interface StatusSelectionsProps {
    status: ParkingLotStatus
    setStatus: (status: ParkingLotStatus) => void
}

export function StatusSelections({ status, setStatus }: StatusSelectionsProps) {
    return (
        <Select value={status} onValueChange={(value: ParkingLotStatus) => setStatus(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
        </Select>
    )
}
