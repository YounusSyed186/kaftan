import { create } from 'zustand';

interface FilterState {
  isFilterPanelOpen: boolean;
  selectedBrand: string | null;
  sortOption: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  openFilterPanel: () => void;
  closeFilterPanel: () => void;
  toggleFilterPanel: () => void;
  setSelectedBrand: (brand: string | null) => void;
  setSortOption: (sort: 'newest' | 'price_asc' | 'price_desc' | 'popular') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isFilterPanelOpen: false,
  selectedBrand: null,
  sortOption: 'newest',
  openFilterPanel: () => set({ isFilterPanelOpen: true }),
  closeFilterPanel: () => set({ isFilterPanelOpen: false }),
  toggleFilterPanel: () =>
    set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),
  setSelectedBrand: (selectedBrand) => set({ selectedBrand }),
  setSortOption: (sortOption) => set({ sortOption }),
  resetFilters: () => set({ selectedBrand: null, sortOption: 'newest' }),
}));
