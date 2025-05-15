import { Kpis, KpisResponse } from "../interfaces/kpis";
import { apiClient } from "./client";

export const getKpis = {
  all: async (): Promise<KpisResponse> => {
    return apiClient.get("/tasks/kpis");
  },
  bySprint: async (): Promise<Kpis> => {
    return apiClient.get(`/tasks/kpis/sprint`);
  },
};