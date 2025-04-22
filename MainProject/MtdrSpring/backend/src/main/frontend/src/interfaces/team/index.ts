import { Project } from "../project";
import { User } from "../user";

export interface Team {
    teamId: number;
    teamName: string;
    manager: User;
    project?: Project | null;
    creationDate?: string | null;
    deletedAt?: string | null;
}