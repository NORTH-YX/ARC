import { apiClient } from "./client";
import { Task, TaskCreate, TaskUpdate, TasksResponse } from "../interfaces/task";
import { KpisResponse } from "../modules/kpis/domain/types";

export const getTasks = {
  all: async (): Promise<TasksResponse> => {
    return apiClient.get("/tasks");
  },
  byId: async (taskId: number): Promise<Task> => {
    return apiClient.get(`/tasks/${taskId}`);
  },
  bySprint: async (sprintId: number): Promise<TasksResponse> => {
    return apiClient.get(`/tasks/sprint/${sprintId}`);
  },
  byUser: async (userId: number): Promise<TasksResponse> => {
    return apiClient.get(`/tasks/user/${userId}`);
  },
  kpis: async (): Promise<KpisResponse> => {
    return apiClient.get("/tasks/kpis");
  },
};

export const createTask = async (taskData: TaskCreate): Promise<Task> => {
  return apiClient.post("/tasks", taskData);
};

export const updateTask = async (taskId: number, taskData: TaskUpdate): Promise<Task> => {
  return apiClient.put(`/tasks/${taskId}`, taskData);
  
};

export const deleteTask = async (taskId: number): Promise<void> => {
  return apiClient.delete(`/tasks/${taskId}`);
};

export const restoreTask = async (taskId: number): Promise<void> => {
  return apiClient.post(`/tasks/${taskId}/restore`, {});
};