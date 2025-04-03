import { useEffect, useRef } from 'react';
import { Task, TasksResponse } from '../../../interfaces/task';
import TaskBook from '../domain/TaskBook';


export function useDataInitialization(data: TasksResponse | undefined, store: any) {
  const isInitialized = useRef(false);
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    if (!data || !data.tasks) return;
    
    const tasks = data.tasks;
    
    // Only initialize if tasks have changed or haven't been initialized yet
    if (!isInitialized.current || JSON.stringify(tasksRef.current) !== JSON.stringify(tasks)) {
      const taskBookInstance = new TaskBook(tasks);
      store.setTaskBook(taskBookInstance);
      store.setFilteredTasks(tasks);
      isInitialized.current = true;
      tasksRef.current = tasks;
    }
  }, [data, store]);
} 