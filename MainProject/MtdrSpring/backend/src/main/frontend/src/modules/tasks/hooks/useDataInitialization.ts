import { useEffect, useRef } from 'react';
import { Task } from '../../../interfaces/task';
import TaskBook from '../domain/TaskBook';


export function useDataInitialization(tasks: Task[], store: any) {
  const isInitialized = useRef(false);
  const tasksRef = useRef(tasks);

  useEffect(() => {
    if (!tasks) return;
    
    // Only initialize if tasks have changed or haven't been initialized yet
    if (!isInitialized.current || JSON.stringify(tasksRef.current) !== JSON.stringify(tasks)) {
      const taskBookInstance = new TaskBook(tasks);
      store.setTaskBook(taskBookInstance);
      store.setFilteredTasks(tasks);
      isInitialized.current = true;
      tasksRef.current = tasks;
    }
  }, [tasks, store]);
} 