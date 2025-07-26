import { useState } from 'react';
import { fetchWithNgrok } from '@/utils/fetchWithNgrok';
import apiConfig from '@/config/api';

interface UseApiOptions {
  headers?: Record<string, string>;
}

export const useApi = (options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchApi = async (endpoint: string, fetchOptions: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithNgrok(`${apiConfig.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers: {
          ...apiConfig.headers,
          ...options.headers,
          ...(fetchOptions.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchApi, loading, error };
}; 