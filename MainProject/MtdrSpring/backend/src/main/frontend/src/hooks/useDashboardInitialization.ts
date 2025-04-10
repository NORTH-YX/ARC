import { useEffect, useRef } from 'react';
import { KpisResponse } from '../modules/kpis/domain/types';
import { Task, TasksResponse } from '../interfaces/task';
import KpiBook from '../modules/kpis/domain/KpiBook';
import TaskBook from '../modules/tasks/domain/TaskBook';

export function useDashboardInitialization(
  kpisData: KpisResponse | undefined,
  tasksData: TasksResponse | undefined,
  kpiStore: any,
  taskStore: any
) {
  const isInitialized = useRef(false);
  const dataRef = useRef<{
    kpis: any | null;
    tasks: Task[] | null;
  }>({
    kpis: null,
    tasks: null
  });

  useEffect(() => {
    // Wait for both data sets to be available
    if (!kpisData || !tasksData?.tasks) return;

    const kpis = kpisData;
    const tasks = tasksData.tasks;

    // Only initialize if data has changed or hasn't been initialized yet
    const shouldInitialize = !isInitialized.current || 
      JSON.stringify(dataRef.current.kpis) !== JSON.stringify(kpis) ||
      JSON.stringify(dataRef.current.tasks) !== JSON.stringify(tasks);

    if (shouldInitialize) {
      // Initialize both stores in a single batch
      const kpiBookInstance = new KpiBook(kpis.kpis);
      const taskBookInstance = new TaskBook(tasks);

      // Update stores
      kpiStore.setKpiBook(kpiBookInstance);
      kpiStore.setKpis(kpis.kpis);
      taskStore.setTaskBook(taskBookInstance);
      taskStore.setFilteredTasks(tasks);

      // Update refs
      isInitialized.current = true;
      dataRef.current = {
        kpis: kpis.kpis,
        tasks: tasks
      };
    }
  }, [kpisData, tasksData]); // Only depend on the data, not the stores
} 