import { Task } from "../task";

export interface Sprint {
  sprintName: string;
  projectId: number;
  status: string;
  creationDate: string;
  estimatedFinishDate: string;
  deletedAt: string | null;
  sprintId: number;
  tasks?: Task[];
}

export interface SprintUpdate {
  sprintName?: string;
  projectId?: number;
  status?: string;
  creationDate?: string;
  estimatedFinishDate?: string;
  deletedAt?: string | null;
  sprintId?: number;
}

export interface SprintCreate {
  sprintName: string;
  status: string;
  creationDate: string;
  estimatedFinishDate: string;
}
