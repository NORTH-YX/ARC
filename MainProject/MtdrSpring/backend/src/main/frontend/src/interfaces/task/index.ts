export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  workModality: string;
  telegramId: string;
  phoneNumber: string;
  creationDate: string;
  deletedAt: string | null;
  teamId: number;
}

export interface Sprint {
  sprintId: number;
  sprintName: string;
  projectId: number;
  status: string;
  creationDate: string;
  estimatedFinishDate: string;
  deletedAt: string | null;
}

export interface Task {
  taskId: number;
  taskName: string;
  description: string;
  priority: number;
  status: string;
  creationDate: string;
  estimatedFinishDate: string | null;
  realFinishDate: string | null;
  estimatedHours: number;
  realHours: number;
  deletedAt: string | null;
  user: User;
  sprint: Sprint;
}

export interface TaskCreate {
  taskName: string;
  description: string;
  priority: number;
  status: string;
  estimatedFinishDate?: string;
  estimatedHours: number;
  userId: number;
  sprintId: number;
}

export interface TaskUpdate {
  taskName?: string;
  description?: string;
  priority?: number;
  status?: string;
  estimatedFinishDate?: string;
  realFinishDate?: string;
  estimatedHours?: number;
  realHours?: number;
  userId?: number;
  sprintId?: number;
}

export interface TasksResponse extends Array<Task> {} 