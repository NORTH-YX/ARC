export interface Task {
  taskId: number;
  taskName: string;
  description: string;
  priority: number;
  status: string;
  sprintId: number;
  userId: number;
  creationDate: string;
  estimatedFinishDate?: string;
  realFinishDate?: string;
  deletedAt?: string;
}

export interface TaskCreate extends Omit<Task, 'taskId' | 'creationDate' | 'deletedAt' | 'realFinishDate'> {}

export interface TaskUpdate extends Partial<TaskCreate> {
  taskId: number;
}

export interface TasksResponse {
  tasks: Task[];
} 