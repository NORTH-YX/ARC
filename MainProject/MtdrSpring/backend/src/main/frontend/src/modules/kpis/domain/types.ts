export interface KpiProject {
  name: string;
  id: number;
  tasa_cumplimiento?: number;
  tareas_completadas?: number;
  tareas_a_tiempo?: number;
  desviacion_promedio_dias?: number;
  desviacion_promedio_horas?: number;
}

export interface KpiSprint {
  name: string;
  id: number;
  tasa_cumplimiento?: number;
  tareas_completadas?: number;
  tareas_a_tiempo?: number;
  desviacion_promedio_dias?: number;
  desviacion_promedio_horas?: number;
}

export interface KpiUser {
  name: string;
  id: number;
  tasa_cumplimiento?: number;
  tareas_completadas?: number;
  tareas_a_tiempo?: number;
  desviacion_promedio_dias?: number;
  desviacion_promedio_horas?: number;
}

export interface ComplianceRate {
  projects: KpiProject[];
  sprints: KpiSprint[];
  users: KpiUser[];
}

export interface EstimationPrecision {
  projects: KpiProject[];
  sprints: KpiSprint[];
  users: KpiUser[];
}

export interface Kpis {
  compliance_rate: ComplianceRate;
  estimation_precision: EstimationPrecision;
}

export interface KpisResponse {
  kpis: Kpis;
  count: number;
  status: string;
}

export interface KpiState {
  kpis: Kpis | null;
  loading: boolean;
  error: string | null;
} 