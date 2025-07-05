import { API_ENDPOINTS, BASE_API_URL } from '@/lib/apis/api.constants'
import { api } from './api.base'

export interface Reservation {
    id: number
    parking_lot: number
    parking_lot_name: string
    parking_space: {
        id: number
        parking_lot: number
        space_number: string
        status: string
    }
    user: {
        id: number
        email: string
        username: string
    }
    user_name: string
    vehicle_plate: string
    notes: string
    start_time: string
    end_time: string
    status: 'active' | 'completed' | 'cancelled' | 'expired' | 'pending'
    duration: number
    total_cost: string
    created_at: string
    updated_at: string
}

export interface CreateReservationRequest {
    parking_lot: number
    parking_space: number
    vehicle_plate: string
    notes?: string
    start_time: string
    end_time: string
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export const reservationsService = {
    // Get all reservations (admin only)
    getAll: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Reservation>> => {
        const { data } = await api.get<PaginatedResponse<Reservation>>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.RESERVATIONS}`, {
            params: {
                page,
                page_size: pageSize
            }
        })
        return data
    },

    // Get a single reservation (admin only)
    getById: async (id: number): Promise<Reservation> => {
        const { data } = await api.get<Reservation>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.RESERVATION_DETAILS(id)}`)
        return data
    },

    // Create a new reservation (user only)
    create: async (reservation: CreateReservationRequest): Promise<Reservation> => {
        const { data } = await api.post<Reservation>(`${BASE_API_URL}${API_ENDPOINTS.USER.RESERVATIONS}`, reservation)
        return data
    },

    // Update a reservation (admin only)
    update: async (id: number, reservation: Partial<CreateReservationRequest>): Promise<Reservation> => {
        const { data } = await api.patch<Reservation>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.RESERVATION_DETAILS(id)}`, reservation)
        return data
    },

    // Delete a reservation (admin only)
    delete: async (id: number): Promise<void> => {
        await api.delete(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.RESERVATION_DETAILS(id)}`)
    },

    // Cancel a reservation (user only)
    cancel: async (id: number): Promise<void> => {
        await api.post(`${BASE_API_URL}${API_ENDPOINTS.USER.CANCEL_RESERVATION(id)}`)
    },

    // Update reservation status (admin only)
    updateStatus: async (id: number, status: 'active' | 'completed' | 'cancelled'): Promise<Reservation> => {
        const { data } = await api.patch<Reservation>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.RESERVATION_STATUS(id)}`, { status })
        return data
    },

    // Get user's reservations (user only)
    getUserReservations: async (): Promise<PaginatedResponse<Reservation>> => {
        const { data } = await api.get<PaginatedResponse<Reservation>>(`${BASE_API_URL}${API_ENDPOINTS.USER.RESERVATIONS}`)
        return data
    },

    // Get user's reservation details (user only)
    getUserReservationDetails: async (id: number): Promise<Reservation> => {
        const { data } = await api.get<Reservation>(`${BASE_API_URL}${API_ENDPOINTS.USER.RESERVATION_DETAILS(id)}`)
        return data
    },

    // Get user's active reservations
    getActiveReservations: async (): Promise<PaginatedResponse<Reservation>> => {
        const { data } = await api.get<PaginatedResponse<Reservation>>(`${BASE_API_URL}${API_ENDPOINTS.USER.ACTIVE_RESERVATIONS}`)
        return data
    },

    // Get user's pending reservations
    getPendingReservations: async (): Promise<PaginatedResponse<Reservation>> => {
        const { data } = await api.get<PaginatedResponse<Reservation>>(`${BASE_API_URL}${API_ENDPOINTS.USER.PENDING_RESERVATIONS}`)
        return data
    },

    // Get user's expired reservations
    getExpiredReservations: async (): Promise<PaginatedResponse<Reservation>> => {
        const { data } = await api.get<PaginatedResponse<Reservation>>(`${BASE_API_URL}${API_ENDPOINTS.USER.EXPIRED_RESERVATIONS}`)
        return data
    },

    // Get user's cancelled reservations
    getCancelledReservations: async (): Promise<PaginatedResponse<Reservation>> => {
        const { data } = await api.get<PaginatedResponse<Reservation>>(`${BASE_API_URL}${API_ENDPOINTS.USER.CANCELLED_RESERVATIONS}`)
        return data
    }
} 