import { useEffect, useRef } from "react";
import { Project, ProjectsResponse } from "../../../interfaces/project";
import ProjectBook from "../domain/ProjectBook";

export function useDataInitialization(
  data: ProjectsResponse | undefined,
  store: any
) {
  const isInitialized = useRef(false);
  const projectsRef = useRef<Project[]>([]);

  useEffect(() => {
    if (!data || !data.projects) return;

    const projects = data.projects;

    // Only initialize if projects have changed or haven't been initialized yet
    if (
      !isInitialized.current ||
      JSON.stringify(projectsRef.current) !== JSON.stringify(projects)
    ) {
      const projectBookInstance = new ProjectBook(projects);
      store.setProjectBook(projectBookInstance);
      store.setFilteredProjects(projects);
      isInitialized.current = true;
      projectsRef.current = projects;
    }
  }, [data, store]);
}