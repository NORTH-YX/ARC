
export interface Kpis {
  complianceRate: number;
  estimationPrecision: number;
}

export interface KpisResponse {
  kpis: Kpis;
  count: number;
  status: string;
}
