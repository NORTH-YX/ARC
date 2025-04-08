import { create } from "zustand";
import ProjectBook from "../domain/ProjectBook";
import { Project } from "../../../interfaces/project/index";
import _ from "lodash";

interface ProjectStoreState {
  projectBook: any;
  selectedProject: Project | null;
  searchQuery: string;
  filteredProjects: Project[];
  isProjectModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedStatus: string | null;

  // Actions
  setProjectBook: (projectBook: ProjectBook) => void;
  setSelectedProject: (project: Project | null) => void;
  setSearchQuery: (query: string) => void;
  setFilteredProjects: (projects: Project[]) => void;
  openProjectModal: () => void;
  closeProjectModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  setSelectedStatus: (status: string | null) => void;
  _updateBook: () => void;

  // These will be injected from ProjectBook
  createProject?: (projectData: any) => Promise<Project>;
  updateProject?: (
    projectId: number,
    projectData: any
  ) => Promise<Project | undefined>;
  deleteProject?: (projectId: number) => Promise<boolean>;
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
  selectedStatus: null,

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
    const { projectBook, selectedProject, filteredProjects } = get();

    if (!projectBook) return;

    // Create new reference for projectBook
    const updatedProjectBook = _.cloneDeep(projectBook);

    // Update filtered projects
    const updatedFilteredProjects = filteredProjects.map((project) => {
      const updated = updatedProjectBook.projects.find(
        (p: any) => p.projectId === project.projectId
      );
      return updated || project;
    });

    // Update selected project if exists
    const updatedSelectedProject = selectedProject
      ? updatedProjectBook.projects.find(
          (p: any) => p.projectId === selectedProject.projectId
        )
      : null;

    set({
      projectBook: updatedProjectBook,
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

  setSelectedStatus: (status) => {
    set({ selectedStatus: status });
    const projectBook = get().projectBook;
    if (!projectBook || !status) return;

    const projects = projectBook.getProjectsByStatus(status);
    set({ filteredProjects: projects });
  },
}));