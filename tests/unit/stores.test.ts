import { describe, it, expect, beforeEach } from 'vitest';
import { useNavigationStore } from '@/stores/navigation-store';
import { useFilterStore } from '@/stores/filter-store';

describe('Zustand Client Stores', () => {
  beforeEach(() => {
    useNavigationStore.setState({
      isMobileDrawerOpen: false,
      isSearchOpen: false,
      searchQuery: '',
      activeNavSlug: null,
    });
    useFilterStore.setState({
      isFilterPanelOpen: false,
      selectedBrand: null,
      sortOption: 'newest',
    });
  });

  it('toggles and manages navigation drawer state', () => {
    const store = useNavigationStore.getState();
    expect(store.isMobileDrawerOpen).toBe(false);

    store.openMobileDrawer();
    expect(useNavigationStore.getState().isMobileDrawerOpen).toBe(true);

    store.closeMobileDrawer();
    expect(useNavigationStore.getState().isMobileDrawerOpen).toBe(false);

    store.toggleMobileDrawer();
    expect(useNavigationStore.getState().isMobileDrawerOpen).toBe(true);
  });

  it('manages search overlay and query state', () => {
    const store = useNavigationStore.getState();
    expect(store.isSearchOpen).toBe(false);

    store.openSearch();
    expect(useNavigationStore.getState().isSearchOpen).toBe(true);

    store.setSearchQuery('resortwear');
    expect(useNavigationStore.getState().searchQuery).toBe('resortwear');

    store.closeSearch();
    expect(useNavigationStore.getState().isSearchOpen).toBe(false);
  });

  it('manages filter store state and reset', () => {
    const store = useFilterStore.getState();
    store.setSelectedBrand('Fashion Spectrum');
    store.setSortOption('price_asc');

    expect(useFilterStore.getState().selectedBrand).toBe('Fashion Spectrum');
    expect(useFilterStore.getState().sortOption).toBe('price_asc');

    store.resetFilters();
    expect(useFilterStore.getState().selectedBrand).toBeNull();
    expect(useFilterStore.getState().sortOption).toBe('newest');
  });
});
