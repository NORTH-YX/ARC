import { create } from "zustand";
import TaskBook from "../domain/TaskBook";
import { Task, TaskCreate } from "../../../interfaces/task/index";
import _ from "lodash";

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
  dateRange: [Date | null, Date | null];
  searchText: string;

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
  setDateRange: (range: [Date | null, Date | null]) => void;
  setSearchText: (text: string) => void;
  getTasksBySprint: (sprintId: number) => Promise<Task[]>;
  getFilteredTasks: () => Task[];
  _updateBook: () => void;
  updateTaskInState: (task: Task) => void;

  // These will be injected from TaskBook
  createTask: (taskData: TaskCreate) => Promise<Task>;
  updateTask?: (taskId: number, taskData: any) => Promise<Task | undefined>;
  deleteTask?: (taskId: number) => Promise<boolean>;
  restoreTask?: (taskId: number) => Promise<boolean>;
  getTaskById?: (taskId: number) => Task | undefined;
  getTasksByUser?: (userId: number) => Task[];
  getTasksByStatus?: (status: string) => Task[];
}

export default create<TaskStoreState>((set, get) => ({
  taskBook: null,
  selectedTask: null,
  searchQuery: "",
  filteredTasks: [],
  isTaskModalOpen: false,
  isDeleteModalOpen: false,
  selectedSprintId: null,
  selectedUserId: null,
  selectedStatus: null,
  dateRange: [null, null],
  searchText: "",

  createTask: async (taskData: TaskCreate) => {
  const { taskBook, _updateBook } = get();
  if (!taskBook) {
    console.warn("⚠️ taskBook is undefined. Cannot create task.");
    return;
  }

  const prevState = _.cloneDeep(taskBook);

  try {
    console.log("📤 Creating task with data:", taskData);

    const result = await taskBook.createTask(taskData); // método del dominio
    console.log("✅ Task created successfully:", result);

    _updateBook(); // actualizar estado local
    return result;
  } catch (error) {
    console.error("❌ Error creating task:", error);
    set({ taskBook: prevState }); // rollback
    throw error;
  }
},



  setTaskBook: (taskBook) => {
    console.log("Setting task book:", taskBook);
    if (!taskBook) return;

    // Prepare all the injectable functions first
    const injectableFunctions = taskBook.injectable || [];
    const injectedMethods: Record<string, any> = {};

    injectableFunctions.forEach((funct) => {
      injectedMethods[funct.name] = async (...args: any[]) => {
        const { taskBook, updateTaskInState } = get();
        const prevState = _.cloneDeep(taskBook);
        console.log("Previous state:", prevState);

        try {
          // For updateTask, apply optimistic update first
          if (funct.name === "updateTask") {
            const [taskId, updates] = args;
            const currentTask = taskBook.getTaskById(taskId);
            if (currentTask) {
              // Apply optimistic update
              const optimisticTask = {
                ...currentTask,
                ...updates,
              };
              updateTaskInState(optimisticTask);
            }
          }

          // Call the domain method
          const result = await funct.bind(taskBook)(...args);

          console.log("Result:", result);

          // For non-update operations, update the whole book
          if (funct.name !== "updateTask") {
            get()._updateBook();
          }

          // Handle specific cases (like updating selected item)
          if (funct.name === "updateTask" && result) {
            set({ selectedTask: result });
          }
          return result;
        } catch (error) {
          // Rollback on error
          set({ taskBook: prevState });
          get()._updateBook(); // Make sure UI reflects the rollback
          throw error;
        }
      };
    });

    // Set everything in one batch update
    set({
      taskBook,
      ...injectedMethods,
    });
  },

  _updateBook: () => {
    const { taskBook, selectedTask, filteredTasks } = get();

    if (!taskBook) return;

    // Create new reference for taskBook
    const updatedTaskBook = _.cloneDeep(taskBook);

    // Update filtered tasks
    const updatedFilteredTasks = filteredTasks.map((task) => {
      const updated = updatedTaskBook.tasks.find(
        (t: any) => t.taskId === task.taskId
      );

      return updated || task;
    });

    // Update selected task if exists
    const updatedSelectedTask = selectedTask
      ? updatedTaskBook.tasks.find((t: any) => t.taskId === selectedTask.taskId)
      : null;

    set({
      taskBook: updatedTaskBook,
      filteredTasks: updatedFilteredTasks,
      selectedTask: updatedSelectedTask,
    });
  },

  updateTaskInState: (task: Task) => {
    const { taskBook, filteredTasks } = get();

    if (!taskBook) return;

    // Update in TaskBook's tasks array
    const taskIndex = taskBook.tasks.findIndex(
      (t: Task) => t.taskId === task.taskId
    );
    if (taskIndex !== -1) {
      taskBook.tasks[taskIndex] = task;
    }

    // Update in filteredTasks if present
    const filteredIndex = filteredTasks.findIndex(
      (t) => t.taskId === task.taskId
    );
    if (filteredIndex !== -1) {
      const updatedFilteredTasks = [...filteredTasks];
      updatedFilteredTasks[filteredIndex] = task;
      set({ filteredTasks: updatedFilteredTasks });
    }

    // Update taskBook reference
    set({ taskBook: { ...taskBook } });
  },

  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const taskBook = get().taskBook;
    if (!taskBook) return;

    const tasks = taskBook.getTasks();
    const filtered = tasks.filter(
      (task: any) =>
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
    if (!taskBook) return;

    // If sprintId is null, reset to all tasks
    if (sprintId === null) {
      set({ filteredTasks: taskBook.getTasks() });
      return;
    }

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

  setDateRange: (range) => {
    set({ dateRange: range });
  },

  setSearchText: (text) => {
    set({ searchText: text });
  },

  getFilteredTasks: () => {
    const { taskBook, filteredTasks, dateRange, searchText } = get();
    
    if (!taskBook) return [];
    
    let filtered = filteredTasks.length > 0 ? filteredTasks : taskBook.getTasks();
    
    // Filter by date range if both dates are set
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((task: Task) => {
        const creationDate = new Date(task.creationDate);
        return creationDate >= dateRange[0]! && creationDate <= dateRange[1]!;
      });
    }
    
    // Filter by search text
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter((task: Task) => 
        task.taskName.toLowerCase().includes(lowerSearchText) ||
        (task.user?.name && task.user.name.toLowerCase().includes(lowerSearchText))
      );
    }
    
    return filtered;
  },

  getTasksBySprint: async (sprintId) => {
    const { taskBook } = get();
    if (!taskBook) return [];

    try {
      // Obtenemos todas las tareas (este método podría ser asíncrono)
      const allTasks = await taskBook.getTasks();

      // Filtramos las tareas por el sprintId
      const tasksForSprint = allTasks.filter(
        (task: Task) => task?.sprint?.sprintId === sprintId
      );

      return tasksForSprint;
    } catch (error) {
      console.error("Error fetching tasks by sprint:", error);
      return [];
    }
  },
}));
