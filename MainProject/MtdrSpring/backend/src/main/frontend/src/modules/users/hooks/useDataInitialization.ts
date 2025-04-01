import { useEffect } from 'react';
import { UsersResponse } from '../../../interfaces/user';
import UserBook from '../domain/UserBook';
import useUserStore from '../store/useUserStore';

export function useDataInitialization(usersData: UsersResponse | undefined) {
  const store = useUserStore();

  useEffect(() => {
    if (!usersData) return;

    const userBookInstance = new UserBook(usersData.users);
    store.setUserBook(userBookInstance);
    store.setFilteredUsers(usersData.users);
  }, [usersData]);
} 