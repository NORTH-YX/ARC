import { useEffect, useRef } from 'react';
import KpiBook from '../domain/KpiBook';
import { Kpis } from '../domain/types';

export function useDataInitialization(data: Kpis | undefined, store: any) {
  const isInitialized = useRef(false);
  const kpisRef = useRef<Kpis | null>(null);

  useEffect(() => {
    if (!data) return;
    
    const kpis = data;
    
    // Only initialize if tasks have changed or haven't been initialized yet
    if (!isInitialized.current || JSON.stringify(kpisRef.current) !== JSON.stringify(kpis)) {
      const kpiBookInstance = new KpiBook(kpis);
      store.setKpiBook(kpiBookInstance);
      store.setKpis(kpis);
      isInitialized.current = true;
      kpisRef.current = kpis;
    }
  }, [data, store]);
} 