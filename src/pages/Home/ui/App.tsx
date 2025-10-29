import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import {
	FilterChooseOption,
	FilterItem,
	FilterType
} from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '@/shared/store/filterStore'
import filterData from '@/shared/temp/filterData.json'

export const App = () => {
	const { t } = useTranslation('filter')

	const {
		selectedFilters,
		lastAppliedFilters,
		setSelectedFilters,
		resetFilters
	} = useFilterStore()

	const [tempFilters, setTempFilters] = useState<SearchRequestFilter>([])
	const [isOpen, setIsOpen] = useState(false)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const { data } = useQuery({
		queryKey: ['filterData'],
		queryFn: async () => filterData as { filterItems: FilterItem[] }
	})

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

	//------------------user-friendly display section-----------------------//
	// The original task required showing raw JSON data,
	// but I made it more user-friendly by displaying readable names
	// In the future, this can be optimized with pre-built maps for better performance on large datasets
	const getFilterName = (filterId: string): string => {
		const filter = data?.filterItems?.find(
			(filterItem: FilterItem) => filterItem.id === filterId
		)
		return filter?.name || filterId
	}

	const getOptionName = (filterId: string, optionId: string): string => {
		const filter = data?.filterItems?.find(
			(filterItem: FilterItem) => filterItem.id === filterId
		)
		const option = filter?.options?.find(
			(option: FilterChooseOption) => option.id === optionId
		)
		return option?.name || optionId
	}

	return (
		<main
			className="flex flex-col items-center justify-center min-h-screen p-6 gap-8 bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url('/bg.jpg')" }}
		>
			<h1 className="text-4xl font-bold text-gray-800">{t('title')}</h1>

			{/* Filter display section */}
			<section className="w-[500px] border border-gray-200 rounded-xl shadow-sm bg-white p-5">
				<h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
					{t('selectedFilters')}
				</h2>

				{selectedFilters.length > 0 ? (
					<div className="flex flex-col gap-4">
						{selectedFilters.map(filter => (
							<article
								key={filter.id}
								className="border border-gray-300 rounded-lg p-3 bg-gray-50 shadow-sm"
							>
								<h3 className="font-medium text-gray-700 mb-2">
									{getFilterName(filter.id)}
								</h3>

								<div className="flex flex-wrap gap-2">
									{filter.optionsIds.map(option => (
										<span
											key={option}
											className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
										>
											{getOptionName(filter.id, option)}
										</span>
									))}
								</div>
							</article>
						))}
					</div>
				) : (
					<p className="text-gray-500 text-center italic">
						{t('noFiltersSelected')}
					</p>
				)}
			</section>

			{/* Modal button */}
			<button
				onClick={openFilters}
				className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
			>
				{t('openFilters')}
			</button>

			{/*  Filter modal */}
			{isOpen && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
					<div className="bg-white backdrop-blur-sm w-[1280px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-8 relative">
						<header className="relative flex items-center justify-center mb-6">
							<h2 className="text-2xl font-medium">{t('modalTitle')}</h2>
							<button
								onClick={() => setIsOpen(false)}
								className="text-black absolute right-0 text-2xl leading-none"
							>
								×
							</button>
						</header>

						{/* Filter sections */}
						{data?.filterItems?.map((item: FilterItem) => (
							<div
								key={item.id}
								className="border-t-2 border-[#B4B4B4] pt-4 mt-4"
							>
								<h3 className="text-lg font-medium mb-2">{item.name}</h3>
								<div className="grid grid-cols-3 gap-x-4 gap-y-2">
									{item.options.map((opt: FilterChooseOption) => {
										const current = tempFilters.find(
											filter => filter.id === item.id
										)
										const checked =
											current?.optionsIds.includes(opt.id) ?? false

										return (
											<label
												key={opt.id}
												className="flex gap-3 cursor-pointer"
											>
												<input
													type="checkbox"
													checked={checked}
													onChange={() => handleToggle(item.id, opt.id)}
													className="mt-[2px]"
												/>
												<span>{opt.name}</span>
											</label>
										)
									})}
								</div>
							</div>
						))}

						{/* Bottom panel with Apply and Clear buttons */}
						<div className="relative flex items-center justify-center w-full mt-8 border-t-2 border-[#B4B4B4] pt-4">
							<button
								className="bg-[#FF5F00] hover:bg-orange-600 text-white text-xs text-center px-12 py-3 rounded-xl"
								onClick={handleApplyClick}
							>
								{t('apply')}
							</button>
							<button
								onClick={handleClearAll}
								className="absolute right-0 text-sm text-[#078691] hover:text-[#0fb6c5] underline"
							>
								{t('clearAllParameters')}
							</button>
						</div>
					</div>

					{/* Confirmation modal */}
					{isConfirmOpen && (
						<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-60">
							<div className="bg-white rounded-lg shadow-xl p-8 text-center min-w-[800px] transition-transform duration-200 scale-100">
								<div className="relative flex items-center justify-center">
									<h3 className="text-2xl font-semibold mb-6">
										{t('confirmTitle')}
									</h3>
									<button
										onClick={() => setIsOpen(false)}
										className="text-black absolute right-0 text-2xl leading-none mb-6"
									>
										×
									</button>
								</div>

								<div className="flex justify-center gap-4 mt-6">
									<button
										className="text-xs bg-white hover:bg-gray-200 border-1 border-gray-300 rounded-xl px-12 py-3"
										onClick={handleUseOld}
									>
										{t('useOldFilter')}
									</button>
									<button
										className="bg-[#FF5F00] hover:bg-orange-600 text-white text-xs text-center px-12 py-3 rounded-xl"
										onClick={handleApplyNew}
									>
										{t('applyNewFilter')}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</main>
	)
}
