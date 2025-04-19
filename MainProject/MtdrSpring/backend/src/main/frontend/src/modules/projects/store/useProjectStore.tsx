import { create } from "zustand";
import ProjectBook from "../domain/ProjectBook";
import { Project, ProjectCreate } from "../../../interfaces/project/index";
import _ from "lodash";
import { mutate } from "swr";

interface ProjectStoreState {
  projectBook: any;
  selectedProject: Project | null;
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
}

export default create<ProjectStoreState>((set, get) => ({
  projectBook: null,
  selectedProject: null,
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
        const prevState = _.cloneDeep(projectBook);

        try {
          // Call the domain method
          const result = await funct.bind(projectBook)(...args);

          // Update store state using the helper method
          _updateBook();

          // Handle specific cases (like updating selected project)
          if (funct.name === "updateProject" && result) {
            set({ selectedProject: result });
          }
          return result;
        } catch (error) {
          // Rollback on error
          set({ projectBook: prevState });
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
    const { projectBook, selectedProject, searchQuery, filteredProjects } =
      get();

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
}));
