import { createApiClient } from "./client";
import { Task } from "../interfaces/task";

export interface TaskResponse {
  tasks: Task[];
}

export const getTasks = {
  task: async (): Promise<TaskResponse> => {
    const client = createApiClient();
    return client.get("/tasks");
  },
};
