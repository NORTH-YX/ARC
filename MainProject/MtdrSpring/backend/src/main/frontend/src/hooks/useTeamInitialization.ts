import { useEffect, useRef } from "react";
import { KpisResponse } from "../modules/kpis/domain/types";
import UserBook from "../modules/users/domain/UserBook";
import KpiBook from "../modules/kpis/domain/KpiBook";
import { UsersResponse } from "../interfaces/user";

export function useTeamInitialization(
    usersData: UsersResponse | undefined,
    kpisData: KpisResponse | undefined,
    userStore: any,
    kpiStore: any
) {
    const isInitialized = useRef(false);
    const dataRef = useRef<{
        kpis: any | null;
        users: any | null;
    }>({
        kpis: null,
        users: null
    })

    useEffect(() => {
        if (!usersData || !kpisData) return;

        const users = usersData;
        const kpis = kpisData;
      // Only initialize if data has changed or hasn't been initialized yet
        const shouldInitialize = !isInitialized.current || 
          JSON.stringify(dataRef.current.kpis) !== JSON.stringify(kpis) ||
          JSON.stringify(dataRef.current.users) !== JSON.stringify(users);
    
        if (shouldInitialize) {
          // Initialize both stores in a single batch
          const kpiBookInstance = new KpiBook(kpis.kpis);
          const userBookInstance = new UserBook(users.users);
    
          // Update stores
          kpiStore.setKpiBook(kpiBookInstance);
          kpiStore.setKpis(kpis.kpis);
          userStore.setUserBook(userBookInstance);
          userStore.setFilteredUsers(users.users);
    
          // Update refs
          isInitialized.current = true;
          dataRef.current = {
            kpis: kpis.kpis,
            users: users.users
          };
        }
      }, [kpisData, usersData]); 
}