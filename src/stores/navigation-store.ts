import { create } from 'zustand';

interface NavigationState {
  isMobileDrawerOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  activeNavSlug: string | null;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setSearchQuery: (query: string) => void;
  setActiveNavSlug: (slug: string | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isMobileDrawerOpen: false,
  isSearchOpen: false,
  searchQuery: '',
  activeNavSlug: null,
  openMobileDrawer: () => set({ isMobileDrawerOpen: true }),
  closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
  toggleMobileDrawer: () =>
    set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveNavSlug: (activeNavSlug) => set({ activeNavSlug }),
}));
