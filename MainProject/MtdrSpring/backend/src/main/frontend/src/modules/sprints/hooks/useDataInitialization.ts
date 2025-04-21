import { useEffect, useRef } from "react";
import { Sprint } from "../../../interfaces/sprint";
import SprintBook from "../domain/SprintBook";

export function useDataInitialization(data: Sprint[] | undefined, store: any) {
  const sprintsRef = useRef<Sprint[]>([]);

  useEffect(() => {
    if (!data || !data.length) return;

    // Si los sprints son iguales a los anteriores, no se actualiza
    if (JSON.stringify(sprintsRef.current) === JSON.stringify(data)) {
      return;
    }

    sprintsRef.current = data;
    const sprintBookInstance = new SprintBook(data);
    store.setSprintBook(sprintBookInstance);
    store.setFilteredSprints(data);
  }, [data, store]);
}
