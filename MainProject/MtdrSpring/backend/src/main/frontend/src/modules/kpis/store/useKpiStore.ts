import { create } from 'zustand';
import { KpiState, Kpis } from '../domain/types';
import KpiBook from '../domain/KpiBook';
import _ from 'lodash';

interface KpiStore extends KpiState {
  kpiBook: KpiBook | null;
  setKpis: (kpis: Kpis) => void;
  setKpiBook: (kpiBook: KpiBook) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  _updateBook: () => void;
}

const initialState: KpiState = {
  kpis: null,
  loading: false,
  error: null,
};

export const useKpiStore = create<KpiStore>((set, get) => ({
  ...initialState,
  kpiBook: null,
  setKpis: (kpis) => set({ kpis }),
  setKpiBook: (kpiBook) => {
    if (!kpiBook) return;

    // Prepare all the injectable functions first
    const injectableFunctions = kpiBook.injectable || [];
    const injectedMethods: Record<string, any> = {};
    
    injectableFunctions.forEach((funct) => {
      injectedMethods[funct.name] = async (...args: any[]) => {
        const { kpiBook, _updateBook } = get();
        const prevState = _.cloneDeep(kpiBook);
        
        try {
          // Call the domain method
          const result = await funct.bind(kpiBook)(...args);
          
          // Update store state using the helper method
          _updateBook();
          
          return result;
        } catch (error) {
          // Rollback on error
          set({ kpiBook: prevState });
          throw error;
        }
      };
    });

    // Set everything in one batch update
    set({
      kpiBook,
      ...injectedMethods
    });
  },
  _updateBook: () => {
    const { kpiBook } = get();
    
    if (!kpiBook) return;
    
    // Create new reference for kpiBook
    const updatedKpiBook = _.cloneDeep(kpiBook);
    
    set({ 
      kpiBook: updatedKpiBook,
      kpis: updatedKpiBook.getKpis()
    });
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
})); 