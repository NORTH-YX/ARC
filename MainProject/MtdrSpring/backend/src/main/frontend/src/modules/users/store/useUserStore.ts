import { create } from 'zustand';
import UserBook from '../domain/UserBook';
import { User } from '../../../interfaces/user';
import _ from 'lodash';

interface UserStoreState {
  userBook: UserBook | null;
  selectedUser: User | null;
  searchQuery: string;
  filteredUsers: User[];
  isUserModalOpen: boolean;
  isDeleteModalOpen: boolean;
  roleFilter: string[];
  workModalityFilter: string [];

  // Actions
  setUserBook: (userBook: UserBook) => void;
  setSelectedUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  setFilteredUsers: (users: User[]) => void;
  openUserModal: () => void;
  closeUserModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  setRoleFilter: (roleFilters: string[]) => void;
  setWorkModalityFilter: (workModalityFilters: string[]) => void;

  // These will be injected from UserBook
  createUser?: (userData: any) => Promise<User>;
  updateUser?: (userId: number, userData: any) => Promise<User | undefined>;
  deleteUser?: (userId: number) => Promise<boolean>;
  restoreUser?: (userId: number) => Promise<boolean>;
  getUserById?: (userId: number) => User | undefined;
  getUserByEmail?: (email: string) => User | undefined;
  getUsersByTeam?: (teamId: number) => User[];
}

const useUserStore = create<UserStoreState>((set, get) => ({
  userBook: null,
  selectedUser: null,
  searchQuery: '',
  filteredUsers: [],
  isUserModalOpen: false,
  isDeleteModalOpen: false,
  roleFilter: [],
  workModalityFilter: [],

  setUserBook: (userBook) => {
    // Inject domain methods into the store
    const injectableFunctions = userBook.injectable || [];
    injectableFunctions.forEach((funct) => {
      set({
        [funct.name]: async (...args: unknown[]) => {
          const { userBook } = get();
          const prevState = _.cloneDeep(userBook);
          
          try {
            // Call the domain method
            const result = await funct.bind(userBook)(...args);
            
            // Update store state
            set({ userBook });
            
            // Handle specific cases (like updating selected item)
            if (funct.name === 'updateUser' && result) {
              set({ selectedUser: result });
            }
            
            return result;
          } catch (error) {
            // Rollback on error
            set({ userBook: prevState });
            throw error;
          }
        }
      });
    });

    set({ userBook });
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const userBook = get().userBook;
    if (!userBook) return;

    const users = userBook.getUsers();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    set({ filteredUsers: filtered });
  },

  setFilteredUsers: (users) => {
    set({ filteredUsers: users });
  },

  openUserModal: () => {
    set({ isUserModalOpen: true });
  },

  closeUserModal: () => {
    set({ isUserModalOpen: false, selectedUser: null });
  },

  openDeleteModal: () => {
    set({ isDeleteModalOpen: true });
  },

  closeDeleteModal: () => {
    set({ isDeleteModalOpen: false, selectedUser: null });
  },
  setRoleFilter: (roleFilters) => {
    set({ roleFilter: roleFilters });
  },

  setWorkModalityFilter: (workModalityFilters) => {
    set({ workModalityFilter: workModalityFilters });
  },
}));

export default useUserStore; 