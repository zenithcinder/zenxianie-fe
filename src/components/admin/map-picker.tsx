import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ZoomIn, ZoomOut, Navigation, MapPin } from 'lucide-react'
import { useTheme } from '@/components/theme.provider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LeafletMouseEvent } from 'leaflet'
import { ParkingLot } from '@/lib/apis/api.parking-lot'
import { ParkingLotStatus, StatusSelections } from './status-selections'

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

interface LocationMarkerProps {
    position: [number, number] | null
    setPosition: (position: [number, number]) => void
    onPositionChange: (position: [number, number]) => void
}

function LocationMarker({ position, setPosition, onPositionChange }: LocationMarkerProps) {
    useMapEvents({
        click(e) {
            const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng]
            setPosition(newPosition)
            onPositionChange(newPosition)
        }
    })

    return position ? <Marker position={position} icon={icon} /> : null
}

function MapControls() {
    const map = useMap()

    const zoomIn = () => {
        map.zoomIn()
    }

    const zoomOut = () => {
        map.zoomOut()
    }

    const locateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    map.setView([latitude, longitude], 15)
                },
                (error) => {
                    console.error('Error getting location:', error)
                }
            )
        }
    }

    return (
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background shadow-md"
                            onClick={zoomIn}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background shadow-md"
                            onClick={zoomOut}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background shadow-md"
                            onClick={locateMe}
                        >
                            <Navigation className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Locate Me</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export type OnLocationClickType = {
    name: string
    lat: number
    lng: number
    address: string
    total_spaces: number
    available_spaces: number
    hourly_rate: number
}

interface MapPickerPropsType {
    status: ParkingLotStatus
    setStatus: (status: ParkingLotStatus) => void
    onLocationClick: (location: OnLocationClickType) => void
    selectedLot?: {
        name: string
        latitude: string
        longitude: string
        address: string
        total_spaces: number
        available_spaces: number
        hourly_rate: number
        status: ParkingLotStatus
    } | null
}

export function MapPicker({ onLocationClick, selectedLot, setStatus, status }: MapPickerPropsType) {
    const [position, setPosition] = useState<[number, number] | null>(
        selectedLot ? [parseFloat(selectedLot.latitude), parseFloat(selectedLot.longitude)] : null
    )
    const [locationName, setLocationName] = useState(selectedLot?.name || '')
    const [address, setAddress] = useState(selectedLot?.address || '')
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)
    const [totalSpaces, setTotalSpaces] = useState<number>(selectedLot?.total_spaces || 0)
    const [availableSpaces, setAvailableSpaces] = useState<number>(
        selectedLot?.available_spaces || 0
    )
    const [hourlyRate, setHourlyRate] = useState<number>(selectedLot?.hourly_rate || 0)
    const { theme } = useTheme()

    useEffect(() => {
        if (selectedLot) {
            setLocationName(selectedLot.name || '')
            setAddress(selectedLot.address || '')
            setTotalSpaces(selectedLot.total_spaces || 0)
            setAvailableSpaces(selectedLot.available_spaces || 0)
            setHourlyRate(selectedLot.hourly_rate || 0)
            if (selectedLot.latitude && selectedLot.longitude) {
                setPosition([parseFloat(selectedLot.latitude), parseFloat(selectedLot.longitude)])
            }
        }
    }, [selectedLot])

    const handleMapClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        setIsLoadingAddress(true)

        // Reverse geocode to get address
        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        )
            .then((res) => res.json())
            .then((data) => {
                setAddress(data.display_name)
                setIsLoadingAddress(false)
            })
            .catch((error) => {
                console.error('Error fetching address:', error)
                setIsLoadingAddress(false)
            })
    }

    const handleSubmit = () => {
        if (position && locationName) {
            // Format coordinates to have no more than 9 digits total
            const lat = position[0].toFixed(6)
            const lng = position[1].toFixed(6)

            onLocationClick({
                name: locationName,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                address: address,
                total_spaces: totalSpaces,
                available_spaces: availableSpaces,
                hourly_rate: hourlyRate
            })
        }
    }

    return (
        <div className="relative w-full flex md:flex-row flex-col gap-4 md:min-h-[600px] min-h-full overflow-y-scroll">
            <div className="flex-2 w-full rounded-md border overflow-hidden min-h-[200px]">
                <MapContainer
                    center={position || [52.377956, 4.897070]} // Amsterdam, Netherlands coordinates
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url={
                            theme === 'dark'
                                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {position && <Marker position={position} icon={icon} />}
                    <MapEvents onMapClick={handleMapClick} />
                    <MapControls />
                </MapContainer>
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <div className="space-y-2">
                    <Label htmlFor="locationName">Location Name</Label>
                    <Input
                        id="locationName"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="Enter location name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={isLoadingAddress ? 'Loading address...' : 'Enter address'}
                        disabled={isLoadingAddress}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="totalSpaces">Total Spaces</Label>
                    <Input
                        id="totalSpaces"
                        type="number"
                        value={totalSpaces}
                        onChange={(e) => setTotalSpaces(parseInt(e.target.value) || 0)}
                        min="0"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="availableSpaces">Available Spaces</Label>
                    <Input
                        id="availableSpaces"
                        type="number"
                        value={availableSpaces}
                        onChange={(e) => setAvailableSpaces(parseInt(e.target.value) || 0)}
                        min="0"
                        max={totalSpaces}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                        min="0"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Status</Label>
                    <StatusSelections status={status} setStatus={setStatus} />
                </div>
                {position && (
                    <div className="text-sm text-muted-foreground">
                        Selected coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button className='w-full' onClick={handleSubmit} disabled={!position || !locationName}>
                        {selectedLot ? 'Update Location' : 'Add Location'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

function MapEvents({ onMapClick }: { onMapClick: (e: LeafletMouseEvent) => void }) {
    const map = useMap()
    useEffect(() => {
        map.on('click', onMapClick)
        return () => {
            map.off('click', onMapClick)
        }
    }, [map, onMapClick])
    return null
}
