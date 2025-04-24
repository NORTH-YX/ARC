import useSWR from "swr";
import { ProjectsResponse } from "../../../interfaces/project";
import { getProjects } from "../../../api/projects";
import { useAuth } from "../../../contexts/AuthContext";

export const useProjectBook = () => {
  const { token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<ProjectsResponse>(
    token ? "projects" : null,
    () => getProjects.all(),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      dedupingInterval: 2000,
      refreshInterval: 30000,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
