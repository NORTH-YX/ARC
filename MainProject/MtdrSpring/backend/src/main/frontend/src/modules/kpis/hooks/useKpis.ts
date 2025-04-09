import { useEffect } from 'react';
import { useKpiStore } from '../store/useKpiStore';
import { Kpis } from '../domain/types';

export const useKpis = () => {
  const { kpis, loading, error, setKpis, setLoading, setError } = useKpiStore();

  const fetchKpis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/kpis');
      if (!response.ok) {
        throw new Error('Failed to fetch KPIs');
      }
      
      const data: Kpis = await response.json();
      setKpis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  return {
    kpis,
    loading,
    error,
    refetch: fetchKpis,
  };
}; 