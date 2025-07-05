import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationsService, Reservation } from '@/lib/apis/api.reservations'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ReservationForm } from './reservation-form'

const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true'

export function Reservations() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const queryClient = useQueryClient()

    const { data: reservationsResponse, isLoading } = useQuery({
        queryKey: ['reservations', page, pageSize],
        queryFn: () => reservationsService.getAll(page, pageSize)
    })

    const reservations = reservationsResponse?.results || []

    const deleteMutation = useMutation({
        mutationFn: (id: number) => reservationsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
            toast.success('Reservation deleted successfully')
        },
        onError: (error) => {
            console.error('Delete error:', error)
            toast.error('Failed to delete reservation')
        }
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: Reservation['status'] }) =>
            reservationsService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
            toast.success('Reservation status updated successfully')
        },
        onError: (error) => {
            console.error('Status update error:', error)
            toast.error('Failed to update reservation status')
        }
    })

    const handleEdit = (reservation: Reservation) => {
        setSelectedReservation(reservation)
        setIsOpen(true)
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleStatusChange = (id: number, status: Reservation['status']) => {
        updateStatusMutation.mutate({ id, status })
    }

    const columns: ColumnDef<Reservation>[] = [
        {
            accessorKey: 'id',
            header: 'ID'
        },
        {
            accessorKey: 'parking_lot_name',
            header: 'Parking Lot'
        },
        {
            accessorKey: 'parking_space',
            header: 'Space',
            cell: ({ row }) => row.original.parking_space.space_number
        },
        {
            accessorKey: 'user_name',
            header: 'User'
        },
        {
            accessorKey: 'vehicle_plate',
            header: 'Vehicle Plate'
        },
        {
            accessorKey: 'start_time',
            header: 'Start Time',
            cell: ({ row }) => (
                <div>{format(new Date(row.getValue('start_time')), 'MMM d, yyyy h:mm a')}</div>
            )
        },
        {
            accessorKey: 'end_time',
            header: 'End Time',
            cell: ({ row }) => (
                <div>{format(new Date(row.getValue('end_time')), 'MMM d, yyyy h:mm a')}</div>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as Reservation['status']
                return (
                    <Badge
                        variant={
                            status === 'active'
                                ? 'success'
                                : status === 'completed'
                                ? 'secondary'
                                : 'destructive'
                        }
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                )
            }
        },
        {
            accessorKey: 'total_cost',
            header: 'Total Cost',
            cell: ({ row }) => `₱${parseFloat(row.getValue('total_cost')).toFixed(2)}`
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const reservation = row.original
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
                            <DropdownMenuItem onClick={() => handleEdit(reservation)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {reservation.status === 'active' && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => handleStatusChange(reservation.id, 'completed')}
                                    >
                                        Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                    >
                                        Cancel Reservation
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(reservation.id)}
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-muted-foreground">Loading reservations...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Reservations</h2>
                        {TEST_MODE && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                TEST MODE
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground">
                        Manage parking reservations and their status
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 p-0"
                    onClick={() => {
                        setSelectedReservation(null)
                        setIsOpen(true)
                    }}
                    aria-label="Add Reservation"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={reservations}
                searchKey="vehicle_plate"
                totalCount={reservationsResponse?.count ?? 0}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-full max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedReservation ? 'Edit Reservation' : 'Add New Reservation'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedReservation
                                ? 'Update the reservation details below.'
                                : 'Fill in the details to create a new reservation.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ReservationForm
                        onSubmit={(data) => {
                            if (selectedReservation) {
                                reservationsService
                                    .update(selectedReservation.id, data)
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ['reservations'] })
                                        setIsOpen(false)
                                        setSelectedReservation(null)
                                        toast.success('Reservation updated successfully')
                                    })
                                    .catch((error) => {
                                        console.error('Update error:', error)
                                        toast.error('Failed to update reservation')
                                    })
                            } else {
                                reservationsService
                                    .create(data)
                                    .then(() => {
                                        queryClient.invalidateQueries({ queryKey: ['reservations'] })
                                        setIsOpen(false)
                                        toast.success('Reservation created successfully')
                                    })
                                    .catch((error) => {
                                        console.error('Create error:', error)
                                        toast.error('Failed to create reservation')
                                    })
                            }
                        }}
                        initialValues={selectedReservation || undefined}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
} 