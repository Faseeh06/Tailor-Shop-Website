import { create } from 'zustand'

interface SearchState {
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  priceRange: string
  setPriceRange: (range: string) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  sortBy: '',
  setSortBy: (sort) => set({ sortBy: sort }),
  priceRange: '',
  setPriceRange: (range) => set({ priceRange: range })
}))
