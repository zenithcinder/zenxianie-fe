import { FC, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { api } from '@/lib/apis/api.base'
import { AddUserDialog } from './add-user-dialog'
import { EditUserDialog } from './edit-user-dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { API_ENDPOINTS } from '@/lib/apis/api.constants'
import { PaginatedResponse, usersService } from '@/lib/apis/api.users'

interface User {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
    role: 'user' | 'admin'
    status: 'active' | 'inactive'
    avatar_url: string | null
    created_at: string
    updated_at: string
}

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="font-medium">{row.original.id}</div>
    },
    {
        accessorKey: 'first_name',
        header: 'First Name'
    },
    {
        accessorKey: 'last_name',
        header: 'Last Name'
    },
    {
        accessorKey: 'username',
        header: 'Username'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
            <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
                {row.original.role}
            </Badge>
        )
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.status === 'active' ? 'success' : 'destructive'}>
                {row.original.status}
            </Badge>
        )
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => <span>{new Date(row.original.created_at).toLocaleString()}</span>
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: ({ row }) => <span>{new Date(row.original.updated_at).toLocaleString()}</span>
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const queryClient = useQueryClient()

            const deleteUser = useMutation({
                mutationFn: async (id: number) => {
                    const response = await api.delete(API_ENDPOINTS.ADMIN.USER_DETAILS(id))
                    return response.data
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['users'] })
                    toast.success('User deleted successfully')
                },
                onError: () => {
                    toast.error('Failed to delete user')
                }
            })

            return (
                <div className="flex items-center gap-2">
                    <EditUserDialog user={row.original} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    user and remove their data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deleteUser.mutate(row.original.id)}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        }
    }
]

export const Users: FC = () => {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const { data: usersResponse, isLoading } = useQuery<PaginatedResponse<User>>({
        queryKey: ['users', page, pageSize],
        queryFn: () => usersService.getAll(page, pageSize)
    })

    const deleteUser = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete<User>(API_ENDPOINTS.ADMIN.USER_DETAILS(id))
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User deleted successfully')
        },
        onError: () => {
            toast.error('Failed to delete user')
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-muted-foreground">Loading users...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-muted-foreground">
                        Manage users and their roles within the system
                    </p>
                </div>
                <AddUserDialog />
            </div>
            <DataTable 
                columns={columns} 
                data={usersResponse?.results ?? []} 
                searchKey="username"
                totalCount={usersResponse?.count ?? 0}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize)
                    setPage(1) // Reset to first page when changing page size
                }}
            />
        </div>
    )
}
