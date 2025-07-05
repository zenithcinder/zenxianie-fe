import { API_ENDPOINTS, BASE_API_URL } from '@/lib/apis/api.constants'
import { api } from './api.base'

export interface User {
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

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export const usersService = {
    // Get all users (admin only)
    getAll: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<User>> => {
        const { data } = await api.get<PaginatedResponse<User>>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.USERS}`, {
            params: {
                page,
                page_size: pageSize
            }
        })
        return data
    },

    // Get a single user (admin only)
    getById: async (id: string): Promise<User> => {
        const { data } = await api.get<User>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.USER_DETAILS(Number(id))}`)
        return data
    },

    // Create a new user (admin only)
    create: async (user: Omit<User, 'id'>): Promise<User> => {
        const { data } = await api.post<User>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.USERS}`, user)
        return data
    },

    // Update a user (admin only)
    update: async (id: string, user: Partial<User>): Promise<User> => {
        const { data } = await api.patch<User>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.USER_DETAILS(Number(id))}`, user)
        return data
    },

    // Delete a user (admin only)
    delete: async (id: string): Promise<void> => {
        await api.delete(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.USER_DETAILS(Number(id))}`)
    },

    // Update user status (admin only)
    updateStatus: async (id: string, status: 'active' | 'inactive'): Promise<User> => {
        const { data } = await api.patch<User>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.USER_STATUS(Number(id))}`, { status })
        return data
    }
} 