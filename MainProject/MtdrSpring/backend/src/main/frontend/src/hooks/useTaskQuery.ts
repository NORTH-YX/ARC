import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/tasks";

/*
export const useTaskQuery = () => {
  const { data, isLoading, error } = useQuery(['tasks'], getTasks);

  return {
    tasks: data,
    isLoading,
    error,
  };
};
*/
