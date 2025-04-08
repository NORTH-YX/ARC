import {
    Project,
    ProjectCreate,
    ProjectUpdate,
  } from "../../../interfaces/project";
  
  import {
    createProject,
    updateProject,
    deleteProject,
    restoreProject,
  } from "../../../api/projects";
  
  export default class ProjectBook {
    private projects: Project[];
    public injectable: any[];
  
    constructor(projects: Project[]) {
      this.projects = projects || [];
  
      // Define which methods should be injectable into the store
      this.injectable = [
        this.createProject,
        this.updateProject,
        this.deleteProject,
        this.restoreProject,
        this.getProjectById,
        this.getProjectsByName,
        this.getProjectsByStatus,
        this.getProjects,
      ];
  
      // Bind methods to maintain correct 'this' context
      this.createProject = this.createProject.bind(this);
      this.updateProject = this.updateProject.bind(this);
      this.deleteProject = this.deleteProject.bind(this);
      this.restoreProject = this.restoreProject.bind(this);
      this.getProjectById = this.getProjectById.bind(this);
      this.getProjectsByName = this.getProjectsByName.bind(this);
      this.getProjectsByStatus = this.getProjectsByStatus.bind(this);
      this.getProjects = this.getProjects.bind(this);
    }
    getProjects(): Project[] {
      return this.projects;
    }
    getProjectById(projectId: number): Project | undefined {
      return this.projects.find((project) => project.projectId === projectId);
    }
    getProjectsByName(projectName: string): Project[] {
      return this.projects.filter(
        (project) => project.projectName === projectName
      );
    }
    getProjectsByStatus(status: string): Project[] {
      return this.projects.filter((project) => project.status === status);
    }
    async createProject(projectData: ProjectCreate): Promise<Project> {
      const response = await createProject(projectData);
      this.projects.push(response);
      return response;
    }
    async updateProject(
      projectId: number,
      projectData: ProjectUpdate
    ): Promise<Project> {
      const response = await updateProject(projectId, projectData);
      const index = this.projects.findIndex(
        (project) => project.projectId === projectId
      );
      if (index !== -1) {
        this.projects[index] = response;
      }
      return response;
    }
    async deleteProject(projectId: number): Promise<void> {
      await deleteProject(projectId);
      this.projects = this.projects.filter(
        (project) => project.projectId !== projectId
      );
    }
    async restoreProject(projectId: number): Promise<void> {
      await restoreProject(projectId);
      const project = this.projects.find(
        (project) => project.projectId === projectId
      );
      if (project) {
        project.deletedAt = null; // Assuming deletedAt is the field to be reset
      }
    }
  }