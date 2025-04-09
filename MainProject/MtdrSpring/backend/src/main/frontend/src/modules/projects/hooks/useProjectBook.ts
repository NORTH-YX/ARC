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
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 5000,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
