import useSWR from "swr";
import { Sprint } from "../../../interfaces/task";
import { getSprints } from "../../../api/sprint";
import { useAuth } from "../../../contexts/AuthContext";

export const useSprintBook = (projectId: number) => {
  const { token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<Sprint[]>(
    token ? "sprints" : null,
    () => getSprints.byProjectId(projectId),
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
