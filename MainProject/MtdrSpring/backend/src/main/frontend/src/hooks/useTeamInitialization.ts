import { useEffect, useRef } from "react";
import { UsersResponse } from "../interfaces/user";
import { KpisResponse } from "../modules/kpis/domain/types";
import UserBook from "../modules/users/domain/UserBook";
import KpiBook from "../modules/kpis/domain/KpiBook";
import { User } from "../interfaces/user";

export function useTeamInitialization(
    usersData: UsersResponse | undefined,
    kpisData: KpisResponse | undefined,
    userStore: any,
    kpiStore: any
) {
    const isInitialized = useRef(false);
    const dataRef = useRef<{
        kpis: any | null;
        users: User[] | null;
    }>({
        kpis: null,
        users: null
    })

    useEffect(() => {
        if (!usersData?.users || !kpisData) return;

        const users = usersData.users;
        const kpis = kpisData;
      // Only initialize if data has changed or hasn't been initialized yet
        const shouldInitialize = !isInitialized.current || 
          JSON.stringify(dataRef.current.kpis) !== JSON.stringify(kpis) ||
          JSON.stringify(dataRef.current.users) !== JSON.stringify(users);
    
        if (shouldInitialize) {
          // Initialize both stores in a single batch
          const kpiBookInstance = new KpiBook(kpis.kpis);
          const userBookInstance = new UserBook(users);
    
          // Update stores
          kpiStore.setKpiBook(kpiBookInstance);
          kpiStore.setKpis(kpis.kpis);
          userStore.setUserBook(userBookInstance);
          userStore.setFilteredUsers(users);
    
          // Update refs
          isInitialized.current = true;
          dataRef.current = {
            kpis: kpis.kpis,
            users: users
          };
        }
      }, [kpisData, usersData]); 
}