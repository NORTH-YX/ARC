import { useEffect, useRef } from 'react';
import KpiBook from '../domain/KpiBook';
import { Kpis, KpisResponse } from '../domain/types';

export function useDataInitialization(data: KpisResponse | undefined, store: any) {
  const isInitialized = useRef(false);
  const kpisRef = useRef<Kpis | null>(null);

  useEffect(() => {
    if (!data) return;
    
    const kpis = data;
    
    // Only initialize if tasks have changed or haven't been initialized yet
    if (!isInitialized.current || JSON.stringify(kpisRef.current) !== JSON.stringify(kpis)) {
      const kpiBookInstance = new KpiBook(kpis.kpis);
      store.setKpiBook(kpiBookInstance);
      store.setKpis(kpis.kpis);
      isInitialized.current = true;
      kpisRef.current = kpis.kpis;
    }
  }, [data, store]);
} 