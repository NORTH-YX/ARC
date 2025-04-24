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

import {
  createTask,
  updateTask,
  deleteTask,
  restoreTask
} from "../../../api/tasks";

import { Task, TaskCreate, TaskUpdate } from "../../../interfaces/task";

export default class ProjectBook {
  private projects: Project[];
  private projectTasks: Map<number, Task[]>;
  public injectable: any[];

  constructor(projects: Project[]) {
    this.projects = projects || [];
    this.projectTasks = new Map<number, Task[]>();

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
      this.createTask,
      this.updateTask,
      this.deleteTask,
      this.restoreTask,
      this.getTaskById,
      this.getTasksByProject,
      this.setProjectTasks,
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
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.restoreTask = this.restoreTask.bind(this);
    this.getTaskById = this.getTaskById.bind(this);
    this.getTasksByProject = this.getTasksByProject.bind(this);
    this.setProjectTasks = this.setProjectTasks.bind(this);
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

  // Task-related methods
  setProjectTasks(projectId: number, tasks: Task[]): void {
    this.projectTasks.set(projectId, tasks);
  }

  getTasksByProject(projectId: number): Task[] {
    return this.projectTasks.get(projectId) || [];
  }

  getTaskById(taskId: number): Task | undefined {
    for (const tasks of this.projectTasks.values()) {
      const task = tasks.find(task => task.taskId === taskId);
      if (task) return task;
    }
    return undefined;
  }

  async createTask(projectId: number, taskData: TaskCreate): Promise<Task> {
    const response = await createTask(taskData);
    
    const projectTasks = this.projectTasks.get(projectId) || [];
    projectTasks.push(response);
    this.projectTasks.set(projectId, projectTasks);
    
    return response;
  }

  async updateTask(taskId: number, taskData: TaskUpdate): Promise<Task> {
    console.log("Updating task:", taskId, taskData);
    
    // Find the task to update first
    let taskToUpdate: Task | undefined;
    let projectIdWithTask: number | undefined;
    
    // Look for the task in all projects
    for (const [projectId, tasks] of this.projectTasks.entries()) {
      const task = tasks.find(t => t.taskId === taskId);
      if (task) {
        taskToUpdate = task;
        projectIdWithTask = projectId;
        break;
      }
    }
    
    if (!taskToUpdate || projectIdWithTask === undefined) {
      console.error("Task not found for optimistic update");
      // If we can't find the task, we still try the API call
      return await updateTask(taskId, taskData);
    }
    
    // Create optimistically updated task (for immediate UI update)
    const optimisticTask = { ...taskToUpdate, ...taskData };
    
    // Apply optimistic update to local state
    if (projectIdWithTask !== undefined) {
      const projectTasks = this.projectTasks.get(projectIdWithTask) || [];
      const updatedTasks = projectTasks.map(task => 
        task.taskId === taskId ? optimisticTask : task
      );
      this.projectTasks.set(projectIdWithTask, updatedTasks);
    }
    
    try {
      // Now make the actual API call
      const response = await updateTask(taskId, taskData);
      
      // Update with the real response data (might have additional server-side changes)
      if (projectIdWithTask !== undefined) {
        const projectTasks = this.projectTasks.get(projectIdWithTask) || [];
        const updatedTasks = projectTasks.map(task => 
          task.taskId === taskId ? { ...task, ...response } : task
        );
        this.projectTasks.set(projectIdWithTask, updatedTasks);
      }
      
      return response;
    } catch (error) {
      console.error("Error updating task:", error);
      // In case of error, return the optimistic task anyway
      // The store will handle rolling back if needed
      throw error;
    }
  }

  async deleteTask(taskId: number): Promise<boolean> {
    try {
      await deleteTask(taskId);
      
      for (const [projectId, tasks] of this.projectTasks.entries()) {
        const updatedTasks = tasks.filter(task => task.taskId !== taskId);
        if (updatedTasks.length !== tasks.length) {
          this.projectTasks.set(projectId, updatedTasks);
          break;
        }
      }
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }

  async restoreTask(taskId: number): Promise<boolean> {
    try {
      await restoreTask(taskId);
      
      for (const [projectId, tasks] of this.projectTasks.entries()) {
        const task = tasks.find(task => task.taskId === taskId);
        if (task) {
          task.deletedAt = null;
          this.projectTasks.set(projectId, [...tasks]);
          break;
        }
      }
      return true;
    } catch (error) {
      console.error("Error restoring task:", error);
      return false;
    }
  }
}
