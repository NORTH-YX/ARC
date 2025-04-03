import { Task, TaskCreate, TaskUpdate } from '../../../interfaces/task/index';
import { createTask, updateTask, deleteTask, restoreTask } from '../../../api/tasks';

export default class TaskBook {
  private tasks: Task[];
  public injectable: any[];

  constructor(tasks: Task[]) {
    this.tasks = tasks || [];
    
    // Define which methods should be injectable into the store
    this.injectable = [
      this.createTask,
      this.updateTask,
      this.deleteTask,
      this.restoreTask,
      this.getTaskById,
      this.getTasksBySprint,
      this.getTasksByUser,
      this.getTasksByStatus,
      this.getTasks
    ];
    
    // Bind methods to maintain correct 'this' context
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.restoreTask = this.restoreTask.bind(this);
    this.getTaskById = this.getTaskById.bind(this);
    this.getTasksBySprint = this.getTasksBySprint.bind(this);
    this.getTasksByUser = this.getTasksByUser.bind(this);
    this.getTasksByStatus = this.getTasksByStatus.bind(this);
    this.getTasks = this.getTasks.bind(this);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(taskId: number): Task | undefined {
    return this.tasks.find(task => task.taskId === taskId);
  }

  getTasksBySprint(sprintId: number): Task[] {
    return this.tasks.filter(task => task.sprint.sprintId === sprintId);
  }

  getTasksByUser(userId: number): Task[] {
    return this.tasks.filter(task => task.user.userId === userId);
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await createTask(taskData);
    this.tasks.push(response);
    return response;
  }

  async updateTask(taskId: number, taskData: TaskUpdate): Promise<Task | undefined> {
    const taskIndex = this.tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex === -1) return undefined;

    const response = await updateTask(taskId, taskData);
    this.tasks[taskIndex] = response;
    return response;
  }

  async deleteTask(taskId: number): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex === -1) return false;

    await deleteTask(taskId);
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      deletedAt: new Date().toISOString(),
    };
    return true;
  }

  async restoreTask(taskId: number): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex === -1) return false;

    await restoreTask(taskId);
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      deletedAt: null,
    };
    return true;
  }
} 