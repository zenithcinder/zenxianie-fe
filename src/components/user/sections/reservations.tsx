import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { api } from '@/lib/apis/api.base'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { API_ENDPOINTS, BASE_API_URL } from '@/lib/apis/api.constants'

interface Reservation {
    id: number
    parking_lot: {
        id: number
        name: string
        address: string
    }
    parking_space: {
        id: number
        space_number: string
    }
    user: {
        id: number
        username: string
        email: string
    }
    vehicle_plate: string
    start_time: string
    end_time: string
    status: 'active' | 'completed' | 'cancelled'
    notes?: string
    total_cost: string
    created_at: string
}

interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export default function Reservations() {
    const queryClient = useQueryClient()

    const { data: reservationsResponse, isLoading } = useQuery<PaginatedResponse<Reservation>>({
        queryKey: ['reservations'],
        queryFn: async () => {
            const response = await api.get<PaginatedResponse<Reservation>>(`${BASE_API_URL}${API_ENDPOINTS.USER.RESERVATIONS}`)
            return response.data
        }
    })

    const cancelReservation = useMutation({
        mutationFn: async (reservationId: number) => {
            const response = await api.post<Reservation>(`${BASE_API_URL}${API_ENDPOINTS.USER.CANCEL_RESERVATION(reservationId)}`)
            return response.data
        },
        onSuccess: (data) => {
            // Invalidate both reservations and parking lots queries
            queryClient.invalidateQueries({ queryKey: ['reservations'] })
            queryClient.invalidateQueries({ queryKey: ['parking-lots'] })
            queryClient.invalidateQueries({ queryKey: ['availableSpaces', data.parking_lot.id] })
            toast.success('Reservation cancelled successfully')
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to cancel reservation'
            toast.error(errorMessage)
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading reservations...</span>
                </div>
            </div>
        )
    }

    const getStatusBadge = (status: Reservation['status']) => {
        const variants = {
            active: 'success',
            completed: 'default',
            cancelled: 'destructive'
        } as const

        return (
            <Badge variant={variants[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    const reservations = reservationsResponse?.results || []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Reservations</h1>
                <p className="text-muted-foreground">View and manage your parking reservations</p>
            </div>

            {reservations.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground">You have no reservations yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {reservations.map((reservation) => (
                        <Card key={reservation.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{reservation.parking_lot.name}</CardTitle>
                                        <CardDescription>
                                            {format(new Date(reservation.start_time), 'PPP p')} - {format(new Date(reservation.end_time), 'p')}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(reservation.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Parking Space</span>
                                            <span className="font-medium">{reservation.parking_space.space_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Vehicle Plate</span>
                                            <span className="font-medium">{reservation.vehicle_plate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Cost</span>
                                            <span className="font-medium">₱{parseFloat(reservation.total_cost).toFixed(2)}</span>
                                        </div>
                                        {reservation.notes && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Notes</span>
                                                <span className="font-medium">{reservation.notes}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Created At</span>
                                            <span className="font-medium">
                                                {format(new Date(reservation.created_at), 'PPP p')}
                                            </span>
                                        </div>
                                    </div>
                                    {reservation.status === 'active' && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" className="w-full">
                                                    Cancel Reservation
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to cancel this reservation? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>No, keep it</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => cancelReservation.mutate(reservation.id)}
                                                        disabled={cancelReservation.isPending}
                                                    >
                                                        {cancelReservation.isPending ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Cancelling...
                                                            </>
                                                        ) : (
                                                            'Yes, cancel it'
                                                        )}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
