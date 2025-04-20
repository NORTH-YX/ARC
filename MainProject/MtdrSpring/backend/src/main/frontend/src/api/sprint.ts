import { apiClient } from "./client";
import { Sprint, SprintUpdate, SprintCreate } from "../interfaces/sprint";

export const getSprints = {
  all: async (): Promise<Sprint[]> => {
    return apiClient.get("/sprints");
  },
  byId: async (sprintId: number): Promise<Sprint> => {
    return apiClient.get(`/sprints/${sprintId}`);
  },
  byProjectId: async (projectId: number): Promise<Sprint[]> => {
    return apiClient.get(`/sprints/project/${projectId}`);
  },
};

export const createSprint = async (
  sprintData: SprintCreate
): Promise<Sprint> => {
  return apiClient.post("/sprints", sprintData);
};

export const updateSprint = async (
  sprintId: number,
  sprintData: SprintUpdate
): Promise<Sprint> => {
  return apiClient.put(`/sprints/${sprintId}`, sprintData);
};

export const deleteSprint = async (sprintId: number): Promise<void> => {
  return apiClient.delete(`/sprints/${sprintId}`);
};

export const restoreSprint = async (sprintId: number): Promise<void> => {
  return apiClient.post(`/sprints/${sprintId}/restore`, {});
};
