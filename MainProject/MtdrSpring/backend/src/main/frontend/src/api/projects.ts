import { apiClient } from "./client";
import {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectsResponse,
} from "../interfaces/project";

export const getProjects = {
  all: async (): Promise<ProjectsResponse> => {
    return apiClient.get("/projects");
  },
  byId: async (projectId: number): Promise<Project> => {
    return apiClient.get(`/projects/${projectId}`);
  },
  byName: async (projectName: string): Promise<Project[]> => {
    return apiClient.get(`/projects/name/${projectName}`);
  },
  byStatus: async (status: string): Promise<Project[]> => {
    return apiClient.get(`/projects/status/${status}`);
  },
};

export const createProject = async (
  projectData: ProjectCreate
): Promise<Project> => {
  return apiClient.post("/projects", projectData);
};

export const updateProject = async (
  projectId: number,
  projectData: ProjectUpdate
): Promise<Project> => {
  return apiClient.put(`/projects/${projectId}`, projectData);
};

export const deleteProject = async (projectId: number): Promise<void> => {
  return apiClient.delete(`/projects/${projectId}`);
};

export const restoreProject = async (projectId: number): Promise<void> => {
  return apiClient.post(`/projects/${projectId}/restore`, {});
};
