import { useState } from 'react'
import { MapPicker, OnLocationClickType } from '@/components/admin/map-picker'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { parkingLotsService, ParkingLot, CreateParkingLotRequest } from '@/lib/apis/api.parking-lot'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusSelections, ParkingLotStatus } from '../../admin/status-selections'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/ui/data-table'

export function ParkingLots() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null)
    const [status, setStatus] = useState<ParkingLotStatus>('active')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const queryClient = useQueryClient()

    const { data: parkingLotsResponse, isLoading } = useQuery({
        queryKey: ['parkingLots', page, pageSize],
        queryFn: () => parkingLotsService.getAll(page, pageSize)
    })

    const parkingLots = parkingLotsResponse?.results || []

    const createMutation = useMutation({
        mutationFn: (data: CreateParkingLotRequest) => parkingLotsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parkingLots'] })
            setIsOpen(false)
            setSelectedLot(null)
            setStatus('active')
            toast.success('Parking lot created successfully')
        },
        onError: (error) => {
            console.error('Create error:', error)
            toast.error('Failed to create parking lot')
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateParkingLotRequest }) =>
            parkingLotsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parkingLots'] })
            setIsOpen(false)
            setSelectedLot(null)
            setStatus('active')
            toast.success('Parking lot updated successfully')
        },
        onError: (error) => {
            console.error('Update error:', error)
            toast.error('Failed to update parking lot')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => parkingLotsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parkingLots'] })
            toast.success('Parking lot deleted successfully')
        },
        onError: (error) => {
            console.error('Delete error:', error)
            toast.error('Failed to delete parking lot')
        }
    })

    const handleLocationSelect = (location: OnLocationClickType) => {
        const newLot: CreateParkingLotRequest = {
            name: location.name,
            address: location.address,
            latitude: location.lat.toString(),
            longitude: location.lng.toString(),
            total_spaces: location.total_spaces,
            hourly_rate: location.hourly_rate.toString(),
            available_spaces: location.total_spaces, // Initially, all spaces are available
            status // Include status in the request
        }

        if (selectedLot) {
            // First update the parking lot details
            updateMutation.mutate({ id: selectedLot.id, data: newLot })
            // Then update the status if it has changed
            if (status !== selectedLot.status) {
                parkingLotsService
                    .updateStatus(selectedLot.id, status)
                    .then(() => {
                        queryClient.invalidateQueries({ queryKey: ['parkingLots'] })
                        toast.success('Parking lot status updated successfully')
                    })
                    .catch((error) => {
                        console.error('Status update error:', error)
                        toast.error('Failed to update parking lot status')
                    })
            }
        } else {
            createMutation.mutate(newLot)
        }
    }

    const handleEdit = (lot: ParkingLot) => {
        setSelectedLot(lot)
        setStatus(lot.status)
        setIsOpen(true)
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this parking lot?')) {
            deleteMutation.mutate(id)
        }
    }

    const columns: ColumnDef<ParkingLot>[] = [
        {
            accessorKey: 'name',
            header: 'Name'
        },
        {
            accessorKey: 'address',
            header: 'Address'
        },
        {
            accessorKey: 'total_spaces',
            header: 'Total Spaces'
        },
        {
            accessorKey: 'available_spaces',
            header: 'Available Spaces',
            cell: ({ row }) => {
                const lot = row.original
                return (
                    <Badge variant={lot.available_spaces > 0 ? 'default' : 'destructive'}>
                        {lot.available_spaces} / {lot.total_spaces}
                    </Badge>
                )
            }
        },
        {
            accessorKey: 'hourly_rate',
            header: 'Hourly Rate',
            cell: ({ row }) => {
                const rate = parseFloat(row.original.hourly_rate)
                return `₱${rate.toFixed(2)}/hour`
            }
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge
                        variant={
                            status === 'active'
                                ? 'default'
                                : status === 'maintenance'
                                ? 'warning'
                                : 'destructive'
                        }
                    >
                        {status}
                    </Badge>
                )
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const lot = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(lot)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(lot.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <CardTitle>Parking Lots</CardTitle>
                <Button onClick={() => setIsOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Parking Lot
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={parkingLots}
                searchKey="name"
                totalCount={parkingLotsResponse?.count ?? 0}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedLot ? 'Edit Parking Lot' : 'Add New Parking Lot'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLot
                                ? 'Update the parking lot details and location'
                                : 'Enter the parking lot details and select its location on the map'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <StatusSelections
                                status={status}
                                setStatus={setStatus}
                            />
                        </div>

                        <Separator />

                        <MapPicker
                            setStatus={setStatus}
                            status={status}
                            onLocationClick={handleLocationSelect}
                            selectedLot={
                                selectedLot
                                    ? {
                                          name: selectedLot.name,
                                          latitude: selectedLot.latitude,
                                          longitude: selectedLot.longitude,
                                          address: selectedLot.address,
                                          total_spaces: selectedLot.total_spaces,
                                          available_spaces: selectedLot.available_spaces,
                                          hourly_rate: parseFloat(selectedLot.hourly_rate),
                                          status: selectedLot.status
                                      }
                                    : null
                            }
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
