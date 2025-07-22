import { useState, useEffect } from 'react';

interface AnalyticsData {
  location: string;
  score: number;
  metrics: {
    footfall: number;
    competition: number;
    accessibility: number;
  };
}

export const useAnalytics = (locationId: string) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Здесь будет реальный API запрос
        const response = await Promise.resolve({
          location: 'Центральный район',
          score: 85,
          metrics: {
            footfall: 1200,
            competition: 3,
            accessibility: 90,
          },
        });
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [locationId]);

  return { data, loading, error };
}; 