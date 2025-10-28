import { create } from 'zustand'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterStore {
	selectedFilters: SearchRequestFilter
	lastAppliedFilters: SearchRequestFilter
	setSelectedFilters: (filters: SearchRequestFilter, isNew?: boolean) => void
	resetFilters: () => void
}

export const useFilterStore = create<FilterStore>(set => ({
	selectedFilters: [],
	lastAppliedFilters: [],

	setSelectedFilters: (filters, isNew = false) => {
		const filtered = filters.filter(
			filter => filter.optionsIds && filter.optionsIds.length > 0
		)

		set(state => {
			if (!isNew && filtered.length === 0) {
				return {
					selectedFilters: state.selectedFilters,
					lastAppliedFilters: state.lastAppliedFilters
				}
			}

			return {
				selectedFilters: filtered,
				lastAppliedFilters: isNew ? filtered : state.lastAppliedFilters
			}
		})
	},

	resetFilters: () => set({ selectedFilters: [], lastAppliedFilters: [] })
}))
