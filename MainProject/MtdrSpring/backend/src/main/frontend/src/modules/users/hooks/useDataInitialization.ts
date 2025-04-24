import { useEffect } from 'react';
import { UsersResponse } from '../../../interfaces/user';
import UserBook from '../domain/UserBook';


export function useDataInitialization(usersData: UsersResponse | undefined, store: any) {


  useEffect(() => {
    if (!usersData) return;

    const userBookInstance = new UserBook(usersData.users);
    store.setUserBook(userBookInstance);
    store.setFilteredUsers(usersData.users);
  }, [usersData]);
} 