import { User } from "../user";
import { Sprint } from "../sprint";

export interface Task {
  taskId: number;
  taskName: string;
  description: string;
  priority: number;
  status: string;
  creationDate: string;
  estimatedFinishDate: string;
  realFinishDate: string | null;
  deletedAt: string | null;
  user: User;
  sprint: Sprint;
}
