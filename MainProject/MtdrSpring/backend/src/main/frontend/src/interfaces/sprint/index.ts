export interface Sprint {
  sprintName: string;
  projectId: number;
  status: string;
  creationDate: string;
  estimatedFinishDate: string;
  deletedAt: string | null;
  sprintId: number;
}
