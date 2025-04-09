import { create } from 'zustand';
import { KpiState, Kpis } from '../domain/types';

interface KpiStore extends KpiState {
  setKpis: (kpis: Kpis) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: KpiState = {
  kpis: null,
  loading: false,
  error: null,
};

export const useKpiStore = create<KpiStore>((set) => ({
  ...initialState,
  setKpis: (kpis) => set({ kpis }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
})); 