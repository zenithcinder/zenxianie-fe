import axios from 'axios'
import {
    API_ENDPOINTS,
    User,
    LoginResponse,
    BASE_API_URL} from './api.constants'

// Feature flag for test mode
const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true'

export const api = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    // Only use withCredentials in test mode
    withCredentials: TEST_MODE
})

// Helper function to ensure URLs start with /api
const ensureApiPrefix = (url: string) => {
    // Skip prefix for production URLs that already include the full path
    if (url.startsWith('http')) {
        return url
    }

    // Only add /api prefix in test mode
    if (TEST_MODE && !url.startsWith('/api/')) {
        return `/api${url.startsWith('/') ? url : `/${url}`}`
    }
    return url
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // Ensure all URLs have /api prefix in test mode
    if (config.url && TEST_MODE) {
        config.url = ensureApiPrefix(config.url)
    }

    return config
})
api.interceptors.request.use((config) => {
    if (config.data) {
        console.log('Request Data:', JSON.stringify(config.data, null, 2))
    }
    return config
})
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                const response = await axios.post<LoginResponse>(
                    `${BASE_API_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
                    { refresh: refreshToken }
                )

                const { access } = response.data
                localStorage.setItem('access_token', access)

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access}`
                }
                return api(originalRequest)
            } catch (error) {
                console.error('Token refresh failed:', error)
                // Clear all auth-related data
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user')
                // Redirect to login
                window.location.href = '/login'
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token')
}

// Helper function to get current user
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user')
    return userStr ? (JSON.parse(userStr) as User) : null
}
