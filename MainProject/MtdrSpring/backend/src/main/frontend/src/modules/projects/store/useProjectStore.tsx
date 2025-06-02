import { create } from "zustand";
import ProjectBook from "../domain/ProjectBook";
import { Project, ProjectCreate } from "../../../interfaces/project/index";
import { Task, TaskCreate, TaskUpdate } from "../../../interfaces/task";
import _ from "lodash";
import { mutate } from "swr";
import { getProjects } from "../../../api/projects";

interface ProjectStoreState {
  projectBook: any;
  selectedProject: Project | null;
  projectSprints: any[] | null;
  projectTasks: any[] | null;
  isLoadingProjectDetails: boolean;
  searchQuery: string;
  filteredProjects: Project[];
  isProjectModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isEditModalOpen: boolean;
  selectedStatus: string | null;
  confirmLoading: boolean;

  // Actions
  setProjectBook: (projectBook: ProjectBook) => void;
  setSelectedProject: (project: Project | null) => void;
  setProjectWithDetails: (projectId: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilteredProjects: (projects: Project[]) => void;
  openProjectModal: () => void;
  closeProjectModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  setSelectedStatus: (status: string | null) => void;
  _updateBook: () => void;

  // These will be injected from ProjectBook
  createProject: (projectData: ProjectCreate) => Promise<Project>;
  updateProject: (
    projectId: number,
    projectData: any
  ) => Promise<Project | undefined>;
  deleteProject: (projectId: number) => Promise<boolean>;
  restoreProject?: (projectId: number) => Promise<boolean>;
  getProjectById?: (projectId: number) => Project | undefined;

  // Task related methods
  createTask?: (projectId: number, taskData: TaskCreate) => Promise<Task>;
  updateTask?: (taskId: number, taskData: TaskUpdate) => Promise<Task>;
  deleteTask?: (taskId: number) => Promise<boolean>;
  restoreTask?: (taskId: number) => Promise<boolean>;
  getTaskById?: (taskId: number) => Task | undefined;
  getTasksByProject?: (projectId: number) => Task[];
  setProjectTasks?: (projectId: number, tasks: Task[]) => void;
}

export default create<ProjectStoreState>((set, get) => ({
  projectBook: null,
  selectedProject: null,
  projectSprints: null,
  projectTasks: null,
  isLoadingProjectDetails: false,
  searchQuery: "",
  filteredProjects: [],
  isProjectModalOpen: false,
  isDeleteModalOpen: false,
  isEditModalOpen: false,
  selectedStatus: null,
  confirmLoading: false,

  createProject: async (projectData: ProjectCreate) => {
    const { projectBook, _updateBook } = get();
    if (!projectBook) return;

    const prevState = _.cloneDeep(projectBook);
    try {
      const result = await projectBook.createProject(projectData);
      _updateBook();
      mutate("projects", undefined, { revalidate: true });
      return result;
    } catch (error) {
      set({ projectBook: prevState });
      throw error;
    }
  },

  updateProject: async (projectId: number, projectData: any) => {
    const { projectBook, _updateBook } = get();
    if (!projectBook) return;

    const prevState = _.cloneDeep(projectBook);
    try {
      const result = await projectBook.updateProject(projectId, projectData);
      _updateBook();
      mutate("projects");
      return result;
    } catch (error) {
      set({ projectBook: prevState });
      throw error;
    }
  },

  deleteProject: async (projectId: number) => {
    const { projectBook, _updateBook } = get();
    if (!projectBook) return false;

    const prevState = _.cloneDeep(projectBook);
    try {
      await projectBook.deleteProject(projectId);
      _updateBook();
      mutate("projects");
      return true;
    } catch (error) {
      set({ projectBook: prevState });
      return false;
    }
  },

  setProjectBook: (projectBook) => {
    if (!projectBook) return;

    // Prepare all the injectable functions first
    const injectableFunctions = projectBook.injectable || [];
    const injectedMethods: Record<string, any> = {};

    injectableFunctions.forEach((funct) => {
      injectedMethods[funct.name] = async (...args: any[]) => {
        const { projectBook, _updateBook } = get();

        // Save the entire state before making changes
        const prevState = _.cloneDeep(projectBook);
        const prevTasks = _.cloneDeep(get().projectTasks);
        const prevSprints = _.cloneDeep(get().projectSprints);
        const prevSelectedProject = _.cloneDeep(get().selectedProject);

        try {
          // For task operations, apply optimistic UI update first
          let optimisticUIApplied = false;
          if (funct.name === "updateTask") {
            const taskId = args[0];
            const taskData = args[1];

            if (get().projectTasks) {
              optimisticUIApplied = true;

              // Get current tasks and apply optimistic update
              const currentTasks = _.cloneDeep(get().projectTasks || []);
              const updatedTasks = currentTasks.map((task) =>
                task.taskId === taskId ? { ...task, ...taskData } : task
              );

              // Get current sprints and apply optimistic update there too
              const currentSprints = _.cloneDeep(get().projectSprints || []);
              currentSprints.forEach((sprint) => {
                if (sprint.tasks) {
                  sprint.tasks = sprint.tasks.map((t: any) =>
                    t.taskId === taskId ? { ...t, ...taskData } : t
                  );
                }
              });

              // Update the UI immediately with optimistic changes
              set({
                projectTasks: updatedTasks,
                projectSprints: currentSprints,
              });
            }
          } else if (funct.name === "deleteTask") {
            const taskId = args[0];

            if (get().projectTasks) {
              optimisticUIApplied = true;

              // Get current tasks and remove the deleted task
              const currentTasks = _.cloneDeep(get().projectTasks || []);
              const updatedTasks = currentTasks.filter(
                (task) => task.taskId !== taskId
              );

              // Get current sprints and remove the task there too
              const currentSprints = _.cloneDeep(get().projectSprints || []);
              currentSprints.forEach((sprint) => {
                if (sprint.tasks) {
                  sprint.tasks = sprint.tasks.filter(
                    (t: any) => t.taskId !== taskId
                  );
                }
              });

              // Update the UI immediately with optimistic changes
              set({
                projectTasks: updatedTasks,
                projectSprints: currentSprints,
              });
            }
          } else if (funct.name === "createTask") {
            const projectId = args[0];
            const taskData = args[1];

            if (get().projectTasks) {
              optimisticUIApplied = true;

              // Create an optimistic task with temporary ID
              const optimisticTask = {
                ...taskData,
                taskId: `temp_${Date.now()}`, // Temporary ID that will be replaced
                status: taskData.status || "To Do",
                project: taskData.project || { projectId },
                sprint: taskData.sprint || { sprintId: null, projectId },
              };

              // Get current tasks and add the new task
              const currentTasks = _.cloneDeep(get().projectTasks || []);
              // Filter out any existing temporary tasks and add the new one
              const updatedTasks = currentTasks
                .filter((t: Task) => !String(t.taskId).startsWith("temp_"))
                .concat(optimisticTask);

              // Get current sprints and add the task to the correct sprint
              const currentSprints = _.cloneDeep(get().projectSprints || []);
              const sprintId = taskData.sprint?.sprintId;

              if (sprintId) {
                const targetSprint = currentSprints.find(
                  (s) => s.sprintId === sprintId
                );
                if (targetSprint) {
                  if (!targetSprint.tasks) {
                    targetSprint.tasks = [];
                  }
                  // Filter out any existing temporary tasks and add the new one
                  targetSprint.tasks = targetSprint.tasks
                    .filter((t: Task) => !String(t.taskId).startsWith("temp_"))
                    .concat(optimisticTask);
                }
              }

              // Update the UI immediately with optimistic changes
              set({
                projectTasks: updatedTasks,
                projectSprints: currentSprints,
              });
            }
          }

          // Call the domain method
          const result = await funct.bind(projectBook)(...args);

          // For task operations, ensure we have a valid result
          if (
            ["createTask", "updateTask"].includes(funct.name) &&
            (!result || !result.taskId)
          ) {
            throw new Error(`Invalid ${funct.name} response from server`);
          }

          // Update store state using the helper method if not already done optimistically
          // or if this is not a task operation
          if (
            !optimisticUIApplied ||
            !["updateTask", "deleteTask", "createTask"].includes(funct.name)
          ) {
            _updateBook();
          }

          // Handle specific cases (like updating selected project)
          if (funct.name === "updateProject" && result) {
            set({ selectedProject: result });
          }

          // If this is a task operation and we have projectTasks loaded, ensure final state matches response
          if (
            ["updateTask", "createTask"].includes(funct.name) &&
            get().projectTasks &&
            result
          ) {
            console.log(
              "Finalizing optimistic task operation with server response"
            );
            const selectedProjectId = get().selectedProject?.projectId;
            if (selectedProjectId) {
              // Get the latest tasks from the domain
              const updatedTasks =
                projectBook.getTasksByProject(selectedProjectId);

              // Update the sprints with the final result
              const updatedSprintsList = _.cloneDeep(
                get().projectSprints || []
              );

              // For create task operations, we need the original task data
              const originalTaskData =
                funct.name === "createTask" ? args[1] : null;

              updatedSprintsList.forEach((sprint) => {
                if (sprint.tasks) {
                  if (funct.name === "createTask" && originalTaskData) {
                    // For create, add the new task with the real ID
                    // Use the original taskData.sprint if result.sprint is undefined
                    const targetSprintId =
                      result.sprint?.sprintId ||
                      originalTaskData.sprint?.sprintId;
                    if (sprint.sprintId === targetSprintId) {
                      // Remove any temporary tasks and add the real one
                      sprint.tasks = sprint.tasks
                        .filter(
                          (t: Task) =>
                            !String(t.taskId).startsWith("temp_") && t.taskId
                        )
                        .concat(result);
                    }
                  } else {
                    // For update, replace the existing task
                    const taskIndex = sprint.tasks.findIndex(
                      (t: Task) => t.taskId === result.taskId
                    );
                    if (taskIndex >= 0) {
                      sprint.tasks[taskIndex] = {
                        ...sprint.tasks[taskIndex],
                        ...result,
                      };
                    }
                  }
                }
              });

              // Set the final state, ensuring we only have valid tasks
              set({
                projectTasks: updatedTasks.filter(
                  (t: Task) => t.taskId && !String(t.taskId).startsWith("temp_")
                ),
                projectSprints: updatedSprintsList,
              });
            }
          }

          return result;
        } catch (error) {
          // On error, restore the previous state
          set({
            projectBook: prevState,
            projectTasks: prevTasks,
            projectSprints: prevSprints,
            selectedProject: prevSelectedProject,
          });
          throw error;
        }
      };
    });

    // Set everything in one batch update
    set({
      projectBook,
      ...injectedMethods,
    });
  },

  _updateBook: () => {
    const { projectBook, selectedProject, searchQuery } = get();

    if (!projectBook) return;

    // Si no hay búsqueda, usar todos los proyectos
    let updatedFilteredProjects = projectBook.getProjects();

    // Si hay un search query, filtrar
    if (searchQuery.trim() !== "") {
      updatedFilteredProjects = updatedFilteredProjects.filter(
        (project: any) =>
          project.projectName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Actualiza el proyecto seleccionado, si existe
    const updatedSelectedProject = selectedProject
      ? updatedFilteredProjects.find(
          (p: any) => p.projectId === selectedProject.projectId
        )
      : null;

    set({
      projectBook: _.cloneDeep(projectBook),
      filteredProjects: updatedFilteredProjects,
      selectedProject: updatedSelectedProject,
    });
  },

  setSelectedProject: (project) => {
    set({ selectedProject: project });

    // If a project is selected, fetch its details (sprints and tasks)
    if (project && project.projectId) {
      get().setProjectWithDetails(project.projectId);
    } else {
      // Clear sprints and tasks if no project is selected
      set({ projectSprints: null, projectTasks: null });
    }
  },

  setProjectWithDetails: async (projectId) => {
    try {
      // Set loading state
      set({ isLoadingProjectDetails: true });

      // Fetch project with sprints and tasks
      const { project, sprints, tasks } = await getProjects.withSprintsAndTasks(
        projectId
      );

      // Ensure tasks is always an array
      const tasksList = Array.isArray(tasks) ? tasks : [];

      // Group tasks by sprint
      const sprintsWithTasks = sprints.map((sprint) => {
        // Safely filter tasks
        const sprintTasks = tasksList.filter(
          (task) =>
            task && task.sprint && task.sprint.sprintId === sprint.sprintId
        );
        return { ...sprint, tasks: sprintTasks };
      });

      // Initialize or update the ProjectBook
      let { projectBook } = get();

      // If projectBook is null, create a new instance with the current project
      if (!projectBook) {
        projectBook = new ProjectBook([project]);
        // Make sure to set it in the store so the injectable methods are available
        get().setProjectBook(projectBook);
      }

      // Now that we have an initialized ProjectBook, set the tasks
      projectBook.setProjectTasks(projectId, tasksList);

      // Update store with all the data
      set({
        selectedProject: project,
        projectSprints: sprintsWithTasks,
        projectTasks: tasksList,
        isLoadingProjectDetails: false,
      });
    } catch (error) {
      console.error("Error fetching project details:", error);
      set({ isLoadingProjectDetails: false });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const projectBook = get().projectBook;
    if (!projectBook) return;

    const projects = projectBook.getProjects();
    const filtered = projects.filter(
      (project: any) =>
        project.projectName.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
    );
    set({ filteredProjects: filtered });
  },

  setFilteredProjects: (projects) => {
    set({ filteredProjects: projects });
  },

  openProjectModal: () => {
    set({ isProjectModalOpen: true });
  },

  closeProjectModal: () => {
    set({ isProjectModalOpen: false, selectedProject: null });
  },

  openDeleteModal: () => {
    set({ isDeleteModalOpen: true });
  },

  closeDeleteModal: () => {
    set({ isDeleteModalOpen: false, selectedProject: null });
  },

  openEditModal: () => {
    set({ isEditModalOpen: true });
  },
  closeEditModal: () => {
    set({ isEditModalOpen: false, selectedProject: null });
  },

  setSelectedStatus: (status) => {
    const projectBook = get().projectBook;
    if (!projectBook || !status) return;
    if (status === "allProjects") {
      const projects = projectBook.getProjects();
      set({ filteredProjects: projects });
      set({ selectedStatus: null });
    } else {
      const projects = projectBook.getProjectsByStatus(status);
      set({ filteredProjects: projects });
      set({ selectedStatus: status });
    }
  },

  createTask: async (projectId: number, taskData: TaskCreate) => {
    const { projectBook } = get();
    if (!projectBook) return;

    const prevState = _.cloneDeep(projectBook);
    const prevTasks = _.cloneDeep(get().projectTasks);
    const prevSprints = _.cloneDeep(get().projectSprints);

    try {
      // Create optimistic task for immediate UI update
      const optimisticTask = {
        ...taskData,
        taskId: `temp_${Date.now()}`,
        status: taskData.status || "To Do",
        creationDate: new Date().toISOString(),
        realFinishDate: null,
        realHours: 0,
        deletedAt: null,
        project: { projectId },
      };

      // Update UI immediately with optimistic data
      if (get().projectTasks) {
        // Update projectTasks
        const currentTasks = _.cloneDeep(get().projectTasks || []);
        const updatedTasks = currentTasks
          .filter((t: Task) => !String(t.taskId).startsWith("temp_"))
          .concat(optimisticTask);

        // Update projectSprints
        const currentSprints = _.cloneDeep(get().projectSprints || []);
        const sprintId = taskData.sprint?.sprintId;

        if (sprintId) {
          const targetSprint = currentSprints.find(
            (s) => s.sprintId === sprintId
          );
          if (targetSprint) {
            if (!targetSprint.tasks) {
              targetSprint.tasks = [];
            }
            targetSprint.tasks = targetSprint.tasks
              .filter((t: Task) => !String(t.taskId).startsWith("temp_"))
              .concat(optimisticTask);
          }
        }

        // Update store with optimistic changes
        set({
          projectTasks: updatedTasks,
          projectSprints: currentSprints,
        });
      }

      // Make the actual API call
      const result = await projectBook.createTask(projectId, taskData);

      if (!result || !result.taskId) {
        throw new Error("Invalid response from server");
      }

      // Update both projectTasks and projectSprints with the real data
      const currentTasks = get().projectTasks || [];
      const validTasks = currentTasks
        .filter((t: Task) => !String(t.taskId).startsWith("temp_"))
        .concat(result);

      const currentSprints = _.cloneDeep(get().projectSprints || []);
      const sprintId = taskData.sprint?.sprintId;

      if (sprintId) {
        const targetSprint = currentSprints.find(
          (s) => s.sprintId === sprintId
        );
        if (targetSprint) {
          targetSprint.tasks = (targetSprint.tasks || [])
            .filter((t: Task) => !String(t.taskId).startsWith("temp_"))
            .concat(result);
        }
      }

      // Update the store with the final state
      projectBook.setProjectTasks(projectId, validTasks);
      set({
        projectBook,
        projectTasks: validTasks,
        projectSprints: currentSprints,
      });

      return result;
    } catch (error) {
      // Restore previous state on error
      set({
        projectBook: prevState,
        projectTasks: prevTasks,
        projectSprints: prevSprints,
      });
      throw error;
    }
  },
}));
