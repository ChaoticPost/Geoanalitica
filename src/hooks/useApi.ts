import { useState, useCallback } from 'react'
import { ApiResponse } from '@/types'
import { api } from '@/services/api';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async (endpoint: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<ApiResponse<T>>(endpoint)
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchData }
}

export default useApi 