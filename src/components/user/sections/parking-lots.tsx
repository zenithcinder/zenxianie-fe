import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin } from 'lucide-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useApiQuery, useApiMutation } from '@/hooks/use-api-query'
import { API_ENDPOINTS, BASE_API_URL } from '@/lib/apis/api.constants'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ParkingLot, ParkingSpace } from '@/lib/apis/api.parking-lot'
import { Reservation, CreateReservationRequest } from '@/lib/apis/api.reservations'

// Fix for default marker icon
const icon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export default function ParkingLots() {
    const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null)
    const [showMap, setShowMap] = useState(false)
    const [showReservation, setShowReservation] = useState(false)
    const [vehiclePlate, setVehiclePlate] = useState('')
    const [notes, setNotes] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [selectedSpace, setSelectedSpace] = useState<string>('')
    const queryClient = useQueryClient()

    // Fetch parking lots using the correct endpoint
    const { data: parkingLotsResponse, isLoading } = useApiQuery<PaginatedResponse<ParkingLot>>(
        ['parking-lots'],
        `${BASE_API_URL}${API_ENDPOINTS.USER.PARKING_LOTS}`
    )

    // Fetch available spaces when a parking lot is selected
    const { data: availableSpaces } = useApiQuery<ParkingSpace[]>(
        ['availableSpaces', selectedLot?.id?.toString() ?? ''],
        selectedLot ? `${BASE_API_URL}${API_ENDPOINTS.USER.PARKING_LOT_DETAILS(selectedLot.id)}available-spaces/` : '',
        {
            enabled: !!selectedLot
        }
    )

    const parkingLots = parkingLotsResponse?.results || []

    // Create reservation using the correct endpoint
    const createReservation = useApiMutation<Reservation, CreateReservationRequest>(
        `${BASE_API_URL}${API_ENDPOINTS.USER.RESERVATIONS}`,
        'post',
        {
            onSuccess: () => {
                // Invalidate both parking lots and reservations queries
                queryClient.invalidateQueries({ queryKey: ['parking-lots'] })
                queryClient.invalidateQueries({ queryKey: ['reservations'] })
                queryClient.invalidateQueries({ queryKey: ['availableSpaces', selectedLot?.id] })
                
                toast.success('Parking space reserved successfully!')
                setShowReservation(false)
                resetForm()
            },
            onError: (error: unknown) => {
                const errorMessage = error instanceof Error ? error.message : 'Failed to create reservation'
                toast.error(errorMessage)
            }
        }
    )

    const resetForm = () => {
        setVehiclePlate('')
        setNotes('')
        setStartTime('')
        setEndTime('')
        setSelectedLot(null)
        setSelectedSpace('')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading parking lots...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {parkingLotsResponse && (
                <p className="text-sm text-muted-foreground">
                    Total parking lots: {parkingLotsResponse.count}
                </p>
            )}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {parkingLots.map((lot) => (
                    <Card key={lot.id}>
                        <CardHeader>
                            <CardTitle>{lot.name}</CardTitle>
                            <CardDescription>{lot.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Available Spaces:</span>
                                    <Badge variant={lot.available_spaces > 0 ? 'default' : 'destructive'}>
                                        {lot.available_spaces} / {lot.total_spaces}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <Badge variant={lot.status === 'active' ? 'default' : lot.status === 'maintenance' ? 'warning' : 'destructive'}>
                                        {lot.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Hourly Rate:</span>
                                    <span className="text-sm text-muted-foreground">
                                        ₱{parseFloat(lot.hourly_rate).toFixed(2)}/hour
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Coordinates:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {parseFloat(lot.latitude).toFixed(6)}, {parseFloat(lot.longitude).toFixed(6)}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedLot(lot)
                                            setShowMap(true)
                                        }}
                                    >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        View Map
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedLot(lot)
                                            setShowReservation(true)
                                        }}
                                        disabled={lot.available_spaces === 0 || lot.status !== 'active'}
                                    >
                                        Reserve
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Map Dialog */}
            <Dialog open={showMap} onOpenChange={setShowMap}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Parking Lot Location</DialogTitle>
                        <DialogDescription>
                            {selectedLot?.name} - {selectedLot?.address}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="h-[400px] w-full">
                        <MapContainer
                            center={[parseFloat(selectedLot?.latitude || '0'), parseFloat(selectedLot?.longitude || '0')]}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {selectedLot && (
                                <Marker
                                    position={[parseFloat(selectedLot.latitude), parseFloat(selectedLot.longitude)]}
                                    icon={icon}
                                />
                            )}
                        </MapContainer>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reservation Dialog */}
            <Dialog open={showReservation} onOpenChange={setShowReservation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reserve Parking Space</DialogTitle>
                        <DialogDescription>
                            {selectedLot?.name} - {selectedLot?.address}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="space">Parking Space</Label>
                            <Select
                                value={selectedSpace}
                                onValueChange={setSelectedSpace}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a parking space" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSpaces?.map((space) => (
                                        <SelectItem key={space.id} value={space.id.toString()}>
                                            Space {space.space_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicle">Vehicle Plate</Label>
                            <Input
                                id="vehicle"
                                value={vehiclePlate}
                                onChange={(e) => setVehiclePlate(e.target.value)}
                                placeholder="Enter vehicle plate number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="start">Start Time</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end">End Time</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Input
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any special instructions or notes"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowReservation(false)
                                    resetForm()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (!selectedLot || !selectedSpace || !vehiclePlate || !startTime || !endTime) {
                                        toast.error('Please fill in all required fields')
                                        return
                                    }
                                    createReservation.mutate({
                                        parking_lot: selectedLot.id,
                                        parking_space: parseInt(selectedSpace),
                                        vehicle_plate: vehiclePlate,
                                        start_time: startTime,
                                        end_time: endTime,
                                        notes: notes
                                    })
                                }}
                                disabled={createReservation.isPending}
                            >
                                {createReservation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Reservation'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
