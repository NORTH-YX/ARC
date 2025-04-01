import { create } from 'zustand';
import TaskBook from '../domain/TaskBook';
import { Task } from '../../../interfaces/task/index';
import _ from 'lodash';

interface TaskStoreState {
  taskBook: any;
  selectedTask: Task | null;
  searchQuery: string;
  filteredTasks: Task[];
  isTaskModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedSprintId: number | null;
  selectedUserId: number | null;
  selectedStatus: string | null;

  // Actions
  setTaskBook: (taskBook: TaskBook) => void;
  setSelectedTask: (task: Task | null) => void;
  setSearchQuery: (query: string) => void;
  setFilteredTasks: (tasks: Task[]) => void;
  openTaskModal: () => void;
  closeTaskModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  setSelectedSprintId: (sprintId: number | null) => void;
  setSelectedUserId: (userId: number | null) => void;
  setSelectedStatus: (status: string | null) => void;
  _updateBook: () => void;

  // These will be injected from TaskBook
  createTask?: (taskData: any) => Promise<Task>;
  updateTask?: (taskId: number, taskData: any) => Promise<Task | undefined>;
  deleteTask?: (taskId: number) => Promise<boolean>;
  restoreTask?: (taskId: number) => Promise<boolean>;
  getTaskById?: (taskId: number) => Task | undefined;
  getTasksBySprint?: (sprintId: number) => Task[];
  getTasksByUser?: (userId: number) => Task[];
  getTasksByStatus?: (status: string) => Task[];
}

export default create<TaskStoreState>((set, get) => ({
  taskBook: null,
  selectedTask: null,
  searchQuery: '',
  filteredTasks: [],
  isTaskModalOpen: false,
  isDeleteModalOpen: false,
  selectedSprintId: null,
  selectedUserId: null,
  selectedStatus: null,

  setTaskBook: (taskBook) => {
    if (!taskBook) return;

    // Prepare all the injectable functions first
    const injectableFunctions = taskBook.injectable || [];
    const injectedMethods: Record<string, any> = {};
    
    injectableFunctions.forEach((funct) => {
      injectedMethods[funct.name] = async (...args: any[]) => {
        const { taskBook, _updateBook } = get();
        const prevState = _.cloneDeep(taskBook);
        
        try {
          // Call the domain method
          const result = await funct.bind(taskBook)(...args);
          
          // Update store state using the helper method
          _updateBook();
          
          // Handle specific cases (like updating selected item)
          if (funct.name === 'updateTask' && result) {
            set({ selectedTask: result });
          }
          return result;
        } catch (error) {
          // Rollback on error
          set({ taskBook: prevState });
          throw error;
        }
      };
    });

    // Set everything in one batch update
    set({
      taskBook,
      ...injectedMethods
    });
  },

  _updateBook: () => {
    const { taskBook, selectedTask, filteredTasks } = get();
    
    if (!taskBook) return;
    
    // Create new reference for taskBook
    const updatedTaskBook = _.cloneDeep(taskBook);
    
    // Update filtered tasks
    const updatedFilteredTasks = filteredTasks.map(task => {
      const updated = updatedTaskBook.tasks.find((t: any) => t.taskId === task.taskId);

      return updated || task;
    });
    
    // Update selected task if exists
    const updatedSelectedTask = selectedTask 
      ? updatedTaskBook.tasks.find((t: any) => t.taskId === selectedTask.taskId)
      : null;
    
    set({ 
      taskBook: updatedTaskBook,
      filteredTasks: updatedFilteredTasks,
      selectedTask: updatedSelectedTask
    });
  },

  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const taskBook = get().taskBook;
    if (!taskBook) return;

    const tasks = taskBook.getTasks();
    const filtered = tasks.filter((task: any) => 
      task.taskName.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
    set({ filteredTasks: filtered });
  },

  setFilteredTasks: (tasks) => {
    set({ filteredTasks: tasks });
  },

  openTaskModal: () => {
    set({ isTaskModalOpen: true });
  },

  closeTaskModal: () => {
    set({ isTaskModalOpen: false, selectedTask: null });
  },

  openDeleteModal: () => {
    set({ isDeleteModalOpen: true });
  },

  closeDeleteModal: () => {
    set({ isDeleteModalOpen: false, selectedTask: null });
  },

  setSelectedSprintId: (sprintId) => {
    set({ selectedSprintId: sprintId });
    const taskBook = get().taskBook;
    if (!taskBook || !sprintId) return;

    const tasks = taskBook.getTasksBySprint(sprintId);
    set({ filteredTasks: tasks });
  },

  setSelectedUserId: (userId) => {
    set({ selectedUserId: userId });
    const taskBook = get().taskBook;
    if (!taskBook || !userId) return;

    const tasks = taskBook.getTasksByUser(userId);
    set({ filteredTasks: tasks });
  },

  setSelectedStatus: (status) => {
    set({ selectedStatus: status });
    const taskBook = get().taskBook;
    if (!taskBook || !status) return;

    const tasks = taskBook.getTasksByStatus(status);
    set({ filteredTasks: tasks });
  },
}));