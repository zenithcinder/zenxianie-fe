import { API_ENDPOINTS, BASE_API_URL } from '@/lib/apis/api.constants'
import { api } from './api.base'

export interface ParkingLot {
    id: number
    name: string
    address: string
    latitude: string
    longitude: string
    total_spaces: number
    available_spaces: number
    status: 'active' | 'maintenance' | 'closed'
    hourly_rate: string
}

export interface ParkingSpace {
    id: number
    parking_lot: number
    space_number: string
    status: 'available' | 'occupied' | 'reserved' | 'maintenance'
}

export interface CreateParkingLotRequest {
    name: string
    address: string
    latitude: string
    longitude: string
    total_spaces: number
    hourly_rate: string
    available_spaces: number
    status: 'active' | 'maintenance' | 'closed'
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export const parkingLotsService = {
    // Get all parking lots
    getAll: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<ParkingLot>> => {
        const { data } = await api.get<PaginatedResponse<ParkingLot>>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOTS}`, {
            params: {
                page,
                page_size: pageSize
            }
        })
        return data
    },

    // Get a single parking lot
    getById: async (id: number): Promise<ParkingLot> => {
        const { data } = await api.get<ParkingLot>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_DETAILS(id)}`)
        return data
    },

    // Create a new parking lot
    create: async (parkingLot: CreateParkingLotRequest): Promise<ParkingLot> => {
        const { data } = await api.post<ParkingLot>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOTS}`, parkingLot)
        return data
    },

    // Update a parking lot
    update: async (id: number, parkingLot: Partial<CreateParkingLotRequest>): Promise<ParkingLot> => {
        const { data } = await api.patch<ParkingLot>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_DETAILS(id)}`, parkingLot)
        return data
    },

    // Delete a parking lot
    delete: async (id: number): Promise<void> => {
        await api.delete(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_DETAILS(id)}`)
    },

    // Update parking lot status
    updateStatus: async (id: number, status: ParkingLot['status']): Promise<ParkingLot> => {
        const { data } = await api.patch<ParkingLot>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_STATUS(id)}`, { status })
        return data
    },

    // Get parking lot spaces
    getSpaces: async (id: number): Promise<ParkingSpace[]> => {
        const { data } = await api.get<ParkingSpace[]>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_SPACES(id)}`)
        return data
    },

    // Get available spaces
    getAvailableSpaces: async (id: number): Promise<ParkingSpace[]> => {
        const { data } = await api.get<ParkingSpace[]>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_AVAILABLE_SPACES(id)}`)
        return data
    },

    // Get occupancy rate
    getOccupancyRate: async (id: number): Promise<{ occupancy_rate: number }> => {
        const { data } = await api.get<{ occupancy_rate: number }>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_OCCUPANCY_RATE(id)}`)
        return data
    },

    // Search parking lots
    search: async (query: string): Promise<PaginatedResponse<ParkingLot>> => {
        const { data } = await api.get<PaginatedResponse<ParkingLot>>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_SEARCH}`, {
            params: { q: query }
        })
        return data
    },

    // Get active parking lots
    getActive: async (): Promise<PaginatedResponse<ParkingLot>> => {
        const { data } = await api.get<PaginatedResponse<ParkingLot>>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_ACTIVE}`)
        return data
    },

    // Get parking lots with available spaces
    getWithAvailableSpaces: async (minSpaces: number = 1): Promise<PaginatedResponse<ParkingLot>> => {
        const { data } = await api.get<PaginatedResponse<ParkingLot>>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.PARKING_LOT_WITH_AVAILABLE_SPACES}`, {
            params: { min_spaces: minSpaces }
        })
        return data
    }
} 