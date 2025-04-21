import { create } from "zustand";
import SprintBook from "../domain/SprintBook";
import { Sprint, SprintCreate } from "../../../interfaces/sprint/index";
import _ from "lodash";

interface SprintStoreState {
  sprintBook: any;
  selectedSprint: Sprint | null;
  searchQuery: string;
  filteredSprints: Sprint[];
  isSprintModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isEditModalOpen: boolean;
  selectedStatus: string | null;
  confirmLoading: boolean;

  // Actions
  setSprintBook: (sprintBook: SprintBook) => void;
  setSelectedSprint: (sprint: Sprint | null) => void;
  setSearchQuery: (query: string) => void;
  setFilteredSprints: (sprints: Sprint[]) => void;
  openSprintModal: () => void;
  closeSprintModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  setSelectedStatus: (status: string | null) => void;
  _updateBook: () => void;

  // These will be injected from SprintBook
  createSprint: (sprintData: SprintCreate) => Promise<Sprint>;
  updateSprint: (
    sprintId: number,
    sprintData: any
  ) => Promise<Sprint | undefined>;
  deleteSprint: (sprintId: number) => Promise<boolean>;
  restoreSprint?: (sprintId: number) => Promise<boolean>;
  getSprintById?: (sprintId: number) => Sprint | undefined;
}
export default create<SprintStoreState>((set, get) => ({
  sprintBook: null,
  selectedSprint: null,
  searchQuery: "",
  filteredSprints: [],
  isSprintModalOpen: false,
  isDeleteModalOpen: false,
  isEditModalOpen: false,
  selectedStatus: null,
  confirmLoading: false,
  createSprint: async (sprintData: SprintCreate) => {
    const { sprintBook, _updateBook } = get();
    if (!sprintBook) return;

    const prevState = _.cloneDeep(sprintBook);
    try {
      const result = await sprintBook.createSprint(sprintData);
      _updateBook();
      return result;
    } catch (error) {
      set({ sprintBook: prevState });
      return undefined;
    }
  },
  updateSprint: async (
    sprintId: number,
    sprintData: any
  ): Promise<Sprint | undefined> => {
    const { sprintBook, _updateBook } = get();
    if (!sprintBook) return;

    const prevState = _.cloneDeep(sprintBook);
    try {
      const result = await sprintBook.updateSprint(sprintId, sprintData);
      _updateBook();
      return result;
    } catch (error) {
      set({ sprintBook: prevState });
      return undefined;
    }
  },
  deleteSprint: async (sprintId: number): Promise<boolean> => {
    const { sprintBook, _updateBook } = get();
    if (!sprintBook) return false;

    const prevState = _.cloneDeep(sprintBook);
    try {
      await sprintBook.deleteSprint(sprintId);
      _updateBook();
      return true;
    } catch (error) {
      set({ sprintBook: prevState });
      return false;
    }
  },
  restoreSprint: async (sprintId: number): Promise<boolean> => {
    const { sprintBook, _updateBook } = get();
    if (!sprintBook) return false;

    const prevState = _.cloneDeep(sprintBook);
    try {
      await sprintBook.restoreSprint(sprintId);
      _updateBook();
      return true;
    } catch (error) {
      set({ sprintBook: prevState });
      return false;
    }
  },
  getSprintById: (sprintId: number): Sprint | undefined => {
    const { sprintBook } = get();
    if (!sprintBook) return undefined;

    return sprintBook.getSprintById(sprintId);
  },
  setSprintBook: (sprintBook: SprintBook) => {
    set({ sprintBook });
  },
  setSelectedSprint: (sprint: Sprint | null) => {
    set({ selectedSprint: sprint });
  },
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  setFilteredSprints: (sprints: Sprint[]) => {
    set({ filteredSprints: sprints });
  },
  openSprintModal: () => {
    set({ isSprintModalOpen: true });
  },
  closeSprintModal: () => {
    set({ isSprintModalOpen: false });
  },
  openDeleteModal: () => {
    set({ isDeleteModalOpen: true });
  },
  closeDeleteModal: () => {
    set({ isDeleteModalOpen: false });
  },
  openEditModal: () => {
    set({ isEditModalOpen: true });
  },
  closeEditModal: () => {
    set({ isEditModalOpen: false });
  },
  setSelectedStatus: (status: string | null) => {
    set({ selectedStatus: status });
  },
  _updateBook: () => {
    const { sprintBook } = get();
    if (!sprintBook) return;

    set({ filteredSprints: sprintBook.getSprints() });
  },
}));
