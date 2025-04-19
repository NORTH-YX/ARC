import { useEffect, useRef } from "react";
import { Project, ProjectsResponse } from "../../../interfaces/project";
import ProjectBook from "../domain/ProjectBook";

export function useDataInitialization(
  data: ProjectsResponse | undefined,
  store: any
) {
  const projectsRef = useRef<Project[]>([]);

  useEffect(() => {
    if (!data || !data.projects) return;

    // Si los proyectos son iguales a los anteriores, no se actualiza
    if (
      JSON.stringify(projectsRef.current) === JSON.stringify(data?.projects)
    ) {
      console.log("Los proyectos son iguales, no se actualiza");
      return;
    }

    projectsRef.current = data?.projects;
    const projectBookInstance = new ProjectBook(data?.projects);
    store.setProjectBook(projectBookInstance);
    store.setFilteredProjects(data?.projects);
    console.log("Proyectos actualizados: ");
  }, [data, store]);
}
