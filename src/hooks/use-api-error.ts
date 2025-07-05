import axios from 'axios'
import { toast } from 'sonner'

interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export function useApiError() {
  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError
      
      // Handle specific error codes
      switch (error.response?.status) {
        case 400:
          toast.error(apiError?.message || 'Invalid request')
          break
        case 401:
          toast.error('Session expired. Please login again.')
          // Redirect to login page
          window.location.href = '/login'
          break
        case 403:
          toast.error('You do not have permission to perform this action')
          break
        case 404:
          toast.error('Resource not found')
          break
        case 409:
          toast.error(apiError?.message || 'Conflict with current state')
          break
        case 422:
          toast.error(apiError?.message || 'Validation failed')
          break
        case 429:
          toast.error('Too many requests. Please try again later')
          break
        case 500:
          toast.error('Internal server error. Please try again later')
          break
        default:
          toast.error(apiError?.message || 'An unexpected error occurred')
      }

      // Log error details in development
      if (import.meta.env.DEV) {
        console.error('API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        })
      }
    } else {
      // Handle non-Axios errors
      toast.error('An unexpected error occurred')
      console.error('Non-API Error:', error)
    }
  }

  return { handleError }
} 