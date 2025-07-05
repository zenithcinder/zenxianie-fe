import { API_ENDPOINTS, BASE_API_URL, ParkingLotReportResponse } from '@/lib/apis/api.constants'
import { api } from './api.base'

export interface DateRangeParams {
    start_date: string
    end_date: string
}

export interface DailyReport {
    id: number
    date: string
    total_revenue: string
    total_reservations: number
    average_duration: number
    peak_hour: string
    occupancy_rate: number
    created_at: string
    updated_at: string
}

export interface MonthlyReport {
    id: number
    year: number
    month: number
    total_revenue: string
    total_reservations: number
    average_duration: number
    average_occupancy_rate: number
    peak_day: string
    created_at: string
    updated_at: string
}

export interface DailyReservation {
    date: string
    reservations: number
}

export interface RevenueData {
    date: string
    revenue: number
}

export interface PeakHourData {
    hour: string
    usage: number
}

export interface UserDemographic {
    name: string
    value: number
}

export interface ReportSummary {
    total_revenue: string
    daily_reservations: number
    parking_utilization: number
    average_duration: number
    revenue_change: string
    reservation_change: number
    utilization_change: number
    duration_change: number
}

export interface DateRangeReport {
    start_date: string
    end_date: string
    total_revenue: string
    total_reservations: number
    average_duration: number
    average_occupancy_rate: number
    daily_data: DailyReservation[]
    revenue_data: RevenueData[]
}

export const reportsService = {
    // Get report summary (admin only)
    getSummary: async (): Promise<ReportSummary> => {
        const { data } = await api.get<ReportSummary>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.SUMMARY}`)
        return data
    },

    // Get daily report (admin only)
    getDailyReport: async (date?: string): Promise<DailyReport> => {
        const { data } = await api.get<DailyReport>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.DAILY}`, {
            params: date ? { date } : undefined
        })
        return data
    },

    // Get monthly report (admin only)
    getMonthlyReport: async (): Promise<MonthlyReport> => {
        const { data } = await api.get<MonthlyReport>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.MONTHLY}`)
        return data
    },

    // Get date range report (admin only)
    getDateRangeReport: async (params: DateRangeParams): Promise<DateRangeReport> => {
        const { data } = await api.get<DateRangeReport>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.DATE_RANGE}`, {
            params
        })
        return data
    },

    // Get daily reservations (admin only)
    getDailyReservations: async (): Promise<DailyReservation[]> => {
        const { data } = await api.get<DailyReservation[]>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.DAILY_RESERVATIONS}`)
        return data
    },

    // Get revenue data (admin only)
    getRevenueData: async (): Promise<RevenueData[]> => {
        const { data } = await api.get<RevenueData[]>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.REVENUE}`)
        return data
    },

    // Get peak hours data (admin only)
    getPeakHours: async (): Promise<PeakHourData[]> => {
        const { data } = await api.get<PeakHourData[]>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.PEAK_HOURS}`)
        return data
    },

    // Get user demographics (admin only)
    getUserDemographics: async (): Promise<UserDemographic[]> => {
        const { data } = await api.get<UserDemographic[]>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.USER_DEMOGRAPHICS}`)
        return data
    },

    // Get parking lot report (admin only)
    getParkingLotReport: async (id: number, date?: string): Promise<ParkingLotReportResponse> => {
        const { data } = await api.get<ParkingLotReportResponse>(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.PARKING_LOT(id)}`, {
            params: date ? { date } : undefined
        })
        return data
    },

    // Export report (admin only)
    exportReport: async (type: 'daily' | 'monthly' | 'parking_lot', params: DateRangeParams): Promise<Blob> => {
        const response = await api.get(`${BASE_API_URL}${API_ENDPOINTS.ADMIN.REPORTS.EXPORT}`, {
            params: { type, ...params },
            responseType: 'blob'
        })
        return response.data as Blob
    }
} 