export interface Project {
    projectId: number;
    projectName: string;
    description: string;
    status: string;
    startDate: string;
    estimatedFinishDate?: string | null;
    realFinishDate?: string | null;
    deletedAt?: string | null;
  };
  
export interface ProjectCreate {
    projectName: string;
    description: string;
    status: string;
    startDate: string;
    estimatedFinishDate?: string | null;
    realFinishDate?: string | null;
  };

export interface ProjectUpdate {
    projectId: number;
    projectName?: string;
    description?: string;
    status?: string;
    startDate?: string;
    estimatedFinishDate?: string | null;
    realFinishDate?: string | null;
  };

export interface ProjectsResponse {
    projects: Project[];
    count: number;
    status: string;
  };