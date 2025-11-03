import { useState } from 'react'

import { FilterType } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '@/shared/store/filterStore'

export const useFilterLogic = () => {
	const {
		selectedFilters,
		lastAppliedFilters,
		setSelectedFilters,
		resetFilters
	} = useFilterStore()
	const [tempFilters, setTempFilters] = useState<SearchRequestFilter>([])
	const [isOpen, setIsOpen] = useState(false)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	// temporary state
	const handleToggle = (filterId: string, optionId: string) => {
		const updated = [...tempFilters]
		const target = updated.find(filter => filter.id === filterId)

		if (target) {
			if (target.optionsIds.includes(optionId)) {
				target.optionsIds = target.optionsIds.filter(id => id !== optionId)
				if (target.optionsIds.length === 0) {
					const index = updated.indexOf(target)
					updated.splice(index, 1)
				}
			} else {
				target.optionsIds.push(optionId)
			}
		} else {
			updated.push({
				id: filterId,
				type: FilterType.OPTION,
				optionsIds: [optionId]
			})
		}

		setTempFilters(updated)
	}

	// Deep copy filters to avoid direct store mutation
	const openFilters = () => {
		const deepCopy = lastAppliedFilters.map(filter => ({
			...filter,
			optionsIds: [...filter.optionsIds]
		}))
		setTempFilters(deepCopy)
		setIsOpen(true)
	}

	const handleApplyClick = () => {
		setIsConfirmOpen(true)
	}

	const handleApplyNew = () => {
		// Safety check: keep only filters with selected options (should already be clean)
		const filteredTempFilters = tempFilters.filter(
			filter => filter.optionsIds && filter.optionsIds.length > 0
		)
		setSelectedFilters(filteredTempFilters, true)
		setIsConfirmOpen(false)
		setIsOpen(false)
	}

	const handleUseOld = () => {
		setSelectedFilters(lastAppliedFilters, false)
		setIsConfirmOpen(false)
		setIsOpen(false)
	}

	const handleClearAll = () => {
		resetFilters()
		setTempFilters([])
	}

	return {
		tempFilters,
		isOpen,
		isConfirmOpen,
		openFilters,
		handleToggle,
		handleApplyClick,
		handleApplyNew,
		handleUseOld,
		handleClearAll,
		setIsOpen,
		selectedFilters
	}
}
