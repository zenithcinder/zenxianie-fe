import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { useApiError } from './use-api-error'
import { api } from '@/lib/apis/api.base'

interface QueryConfig<TData, TError> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
}

interface MutationConfig<TData, TVariables, TError> extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError, variables: TVariables) => void
}

export function useApiQuery<TData = unknown, TError = unknown>(
  key: string[],
  url: string,
  config?: QueryConfig<TData, TError>
) {
  const { handleError } = useApiError()

  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: async () => {
      try {
        const response = await api.get<TData>(url)
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    ...config,
  })
}

export function useApiMutation<TData = unknown, TVariables = unknown, TError = unknown>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  config?: MutationConfig<TData, TVariables, TError>
) {
  const { handleError } = useApiError()

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      try {
        const response = await api[method]<TData>(url, variables)
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    ...config,
  })
}

// Example usage:
/*
const { data, isLoading } = useApiQuery(['users'], '/api/users', {
  onSuccess: (data) => {
    console.log('Users loaded:', data)
  }
})

const { mutate } = useApiMutation('/api/users', 'post', {
  onSuccess: (data) => {
    console.log('User created:', data)
  }
})
*/ 