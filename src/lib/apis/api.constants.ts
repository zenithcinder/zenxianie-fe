/**
 * API Endpoints for Zenxianie Backend
 * Base URL: http://localhost:8000
 */

// Common Types
export interface User {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
    role: 'admin' | 'user'
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

// Auth Types
export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access: string
    refresh: string
}

export interface RegisterRequest {
    email: string
    username: string
    password: string
    password2: string
    first_name: string
    last_name: string
    role: string
}

export interface ChangePasswordRequest {
    old_password: string
    new_password: string
    new_password2: string
}

export interface ChangePasswordResponse {
    detail: string
}

// Parking Types
export interface ParkingLot {
    id: number
    name: string
    address: string
    latitude: string
    longitude: string
    total_spaces: number
    available_spaces: number
    status: string
    hourly_rate: string
}

export interface ParkingSpace {
    id: number
    space_number: string
    status: string
}

export interface ParkingLotDetail extends ParkingLot {
    spaces: ParkingSpace[]
}

// Reservation Types
export interface CreateReservationRequest {
    parking_lot: number
    parking_space: number
    start_time: string
    end_time: string
    vehicle_plate: string
    notes?: string
}

export interface Reservation {
    id: number
    parking_lot: {
        id: number
        name: string
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
    status: string
    notes?: string
    total_cost: string
    created_at: string
}

export interface CancelReservationResponse {
    id: number
    status: string
    cancelled_at: string
}

// Report Types
export interface DailySummaryResponse {
    total_revenue: number
    daily_reservations: number
    parking_utilization: number
    average_duration: number
    revenue_change: number
    reservation_change: number
    utilization_change: number
    duration_change: number
}

export interface MonthlyReportResponse {
    year: number
    month: number
    total_revenue: number
    total_reservations: number
    average_duration: number
    average_occupancy_rate: number
    peak_day: string
    created_at: string
    updated_at: string
}

export interface DateRangeReportResponse {
    start_date: string
    end_date: string
    total_revenue: number
    total_reservations: number
    average_duration: number
    average_occupancy_rate: number
    daily_data: Array<{
        date: string
        reservations: number
    }>
    revenue_data: Array<{
        date: string
        revenue: number
    }>
}

export interface ParkingLotReportResponse {
    parking_lot: number
    parking_lot_name: string
    date: string
    total_revenue: number
    total_reservations: number
    occupancy_rate: number
    average_duration: number
    peak_hour: string
    created_at: string
    updated_at: string
}

export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8000'

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/api/auth/login/',
        REGISTER: '/api/auth/register/',
        LOGOUT: '/api/auth/logout/',
        REFRESH_TOKEN: '/api/auth/refresh-token/',
        VERIFY_EMAIL: '/api/auth/verify-email/',
        RESET_PASSWORD: '/api/auth/reset-password/',
        CHANGE_PASSWORD: '/api/auth/change-password/',
        PROFILE: '/api/auth/profile/'
    },

    // User endpoints
    USER: {
        PROFILE: '/api/user/profile/',
        RESERVATIONS: '/api/user/reservations/',
        RESERVATION_DETAILS: (id: number) => `/api/reservations/${id}/`,
        CANCEL_RESERVATION: (id: number) => `/api/reservations/${id}/cancel/`,
        ACTIVE_RESERVATIONS: '/api/reservations/active/',
        PENDING_RESERVATIONS: '/api/reservations/pending/',
        EXPIRED_RESERVATIONS: '/api/reservations/expired/',
        CANCELLED_RESERVATIONS: '/api/reservations/cancelled/',
        PARKING_LOTS: '/api/user/parking-lots/',
        PARKING_LOT_DETAILS: (id: number) => `/api/user/parking-lots/${id}/`,
        NOTIFICATIONS: '/api/user/notifications/',
        NOTIFICATION_MARK_READ: (id: string) => `/api/user/notifications/${id}/mark-read/`,
        WS_TOKEN: '/api/auth/token/ws/',
        PAYMENTS: '/api/user/payments/',
        POINTS: '/api/user/points/',
        API: '/api/user/api/'
    },

    // Admin endpoints
    ADMIN: {
        // User management
        USERS: '/api/admin/users/',
        USER_DETAILS: (id: number) => `/api/admin/users/${id}/`,
        USER_STATUS: (id: number) => `/api/admin/users/${id}/status/`,

        // Parking lot management
        PARKING_LOTS: '/api/admin/parking-lots/',
        PARKING_LOT_DETAILS: (id: number) => `/api/admin/parking-lots/${id}/`,
        PARKING_LOT_STATUS: (id: number) => `/api/admin/parking-lots/${id}/status/`,
        PARKING_LOT_SPACES: (id: number) => `/api/admin/parking-lots/${id}/spaces/`,
        PARKING_LOT_AVAILABLE_SPACES: (id: number) => `/api/admin/parking-lots/${id}/available-spaces/`,
        PARKING_LOT_OCCUPANCY_RATE: (id: number) => `/api/admin/parking-lots/${id}/occupancy-rate/`,
        PARKING_LOT_SEARCH: '/api/admin/parking-lots/search/',
        PARKING_LOT_ACTIVE: '/api/admin/parking-lots/active/',
        PARKING_LOT_WITH_AVAILABLE_SPACES: '/api/admin/parking-lots/with-available-spaces/',

        // Reservation management
        RESERVATIONS: '/api/admin/reservations/',
        RESERVATION_DETAILS: (id: number) => `/api/admin/reservations/${id}/`,
        RESERVATION_STATUS: (id: number) => `/api/admin/reservations/${id}/status/`,

        // Reports
        REPORTS: {
            BASE: '/api/admin/reports/',
            SUMMARY: '/api/admin/reports/summary/',
            DAILY: '/api/admin/reports/daily/',
            MONTHLY: '/api/admin/reports/monthly/',
            DATE_RANGE: '/api/admin/reports/date_range/',
            EXPORT: '/api/admin/reports/export/',
            DAILY_RESERVATIONS: '/api/admin/reports/daily_reservations/',
            REVENUE: '/api/admin/reports/revenue/',
            PEAK_HOURS: '/api/admin/reports/peak_hours/',
            USER_DEMOGRAPHICS: '/api/admin/reports/user_demographics/',
            PARKING_LOT: (id: number) => `/api/admin/reports/${id}/parking_lot/`
        }
    },

    // Payment endpoints
    PAYMENTS: {
        BASE: '/api/user/payments/',
    },

    // Admin payment endpoints
    ADMIN_PAYMENTS: {
        BASE: '/api/admin/payments/',
    },
} as const
