import { apiClient } from "./client";
import {
  Task,
  TaskCreate,
  TaskUpdate,
  TasksResponse,
} from "../interfaces/task";
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
  try {
    const response = await apiClient.post("/tasks", taskData);

    // If the response is a string (success message), try to extract the task ID
    if (typeof response === "string") {
      const match = response.match(/Task created successfully with ID (\d+)/);
      if (!match) {
        throw new Error("Failed to extract task ID from response");
      }
      const taskId = parseInt(match[1], 10);

      // Construct a task object with the data we already have
      const constructedTask: Task = {
        taskId,
        taskName: taskData.taskName,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        creationDate: new Date().toISOString(),
        estimatedFinishDate: taskData.estimatedFinishDate || null,
        realFinishDate: null,
        estimatedHours: taskData.estimatedHours,
        realHours: 0,
        deletedAt: null,
        user: taskData.user as any, // We'll need to fetch user details later if needed
        sprint: taskData.sprint as any, // We'll need to fetch sprint details later if needed
      };

      return constructedTask;
    }

    // If the response is already a Task object, return it
    if (response && typeof response === "object" && "taskId" in response) {
      return response as Task;
    }

    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (
  taskId: number,
  taskData: TaskUpdate
): Promise<Task> => {
  return apiClient.put(`/tasks/${taskId}`, taskData);
};

export const deleteTask = async (taskId: number): Promise<void> => {
  return apiClient.delete(`/tasks/${taskId}`);
};

export const restoreTask = async (taskId: number): Promise<void> => {
  return apiClient.post(`/tasks/${taskId}/restore`, {});
};
