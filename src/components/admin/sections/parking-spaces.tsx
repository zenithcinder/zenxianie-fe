import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { parkingLotsService, ParkingSpace } from '@/lib/apis/api.parking-lot'
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
import { API_ENDPOINTS, BASE_API_URL } from '@/lib/apis/api.constants'
import { api } from '@/lib/apis/api.base'

interface ParkingSpacesProps {
    parkingLotId: number
}

export function ParkingSpaces({ parkingLotId }: ParkingSpacesProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null)
    const [spaceNumber, setSpaceNumber] = useState('')
    const [status, setStatus] = useState<'available' | 'occupied' | 'reserved' | 'maintenance'>('available')
    const queryClient = useQueryClient()

    // Fetch parking spaces
    const { data: spaces, isLoading } = useQuery({
        queryKey: ['parkingSpaces', parkingLotId],
        queryFn: () => parkingLotsService.getSpaces(parkingLotId)
    })

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: { space_number: string; status: string }) => {
            const response = await api.post<ParkingSpace>(
                `${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_SPACES(parkingLotId)}`,
                data
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parkingSpaces', parkingLotId] })
            setIsOpen(false)
            setSpaceNumber('')
            setStatus('available')
            toast.success('Parking space created successfully')
        },
        onError: (error) => {
            console.error('Create error:', error)
            toast.error('Failed to create parking space')
        }
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: { space_number: string; status: string } }) => {
            const response = await api.patch<ParkingSpace>(
                `${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_SPACES(parkingLotId)}/${id}`,
                data
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parkingSpaces', parkingLotId] })
            setIsOpen(false)
            setSelectedSpace(null)
            setSpaceNumber('')
            setStatus('available')
            toast.success('Parking space updated successfully')
        },
        onError: (error) => {
            console.error('Update error:', error)
            toast.error('Failed to update parking space')
        }
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_SPACES(parkingLotId)}/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parkingSpaces', parkingLotId] })
            toast.success('Parking space deleted successfully')
        },
        onError: (error) => {
            console.error('Delete error:', error)
            toast.error('Failed to delete parking space')
        }
    })

    const handleEdit = (space: ParkingSpace) => {
        setSelectedSpace(space)
        setSpaceNumber(space.space_number)
        setStatus(space.status as 'available' | 'occupied' | 'reserved' | 'maintenance')
        setIsOpen(true)
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this parking space?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            space_number: spaceNumber,
            status
        }

        if (selectedSpace) {
            updateMutation.mutate({ id: selectedSpace.id, data })
        } else {
            createMutation.mutate(data)
        }
    }

    const columns: ColumnDef<ParkingSpace>[] = [
        {
            accessorKey: 'space_number',
            header: 'Space Number'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string
                return (
                    <Badge
                        variant={
                            status === 'available'
                                ? 'success'
                                : status === 'reserved'
                                ? 'warning'
                                : status === 'maintenance'
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
            id: 'actions',
            cell: ({ row }) => {
                const space = row.original
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
                            <DropdownMenuItem onClick={() => handleEdit(space)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(space.id)}
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
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Parking Spaces</h2>
                <Button onClick={() => setIsOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Space
                </Button>
            </div>

            <DataTable 
                columns={columns} 
                data={spaces || []} 
                searchKey="space_number"
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSpace ? 'Edit Parking Space' : 'Add Parking Space'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedSpace
                                ? 'Update the parking space details below.'
                                : 'Fill in the details to create a new parking space.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="spaceNumber">Space Number</Label>
                            <Input
                                id="spaceNumber"
                                value={spaceNumber}
                                onChange={(e) => setSpaceNumber(e.target.value)}
                                placeholder="Enter space number"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={status}
                                onValueChange={(value: 'available' | 'occupied' | 'reserved' | 'maintenance') =>
                                    setStatus(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsOpen(false)
                                    setSelectedSpace(null)
                                    setSpaceNumber('')
                                    setStatus('available')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {selectedSpace ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
} 