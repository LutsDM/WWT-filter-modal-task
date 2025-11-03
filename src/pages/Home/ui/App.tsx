import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { FilterChooseOption, FilterItem } from '@/shared/api/types/Filter'

import { ConfirmModal } from './Filter/ConfirmModal'
import { FilterList } from './Filter/FilterList'
import { FilterModal } from './Filter/FilterModal'
import { useFilterLogic } from './useFilterLogic'

export const App = () => {
	const { t } = useTranslation('filter')
	const {
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
	} = useFilterLogic()

	const { data, isLoading, isError, error } = useQuery<{
		filterItems: FilterItem[]
	}>({
		queryKey: ['filterData'],
		queryFn: async () => {
			const res = await fetch('/src/shared/temp/filterData.json')
			if (!res.ok) {
				throw new Error('Failed to fetch filter data')
			}
			return res.json()
		},
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false
	})

	//------------------user-friendly display section-----------------------//
	// The original task required showing raw JSON data,
	// but I made it more user-friendly by displaying readable names
	// In the future, this can be optimized with pre-built maps for better performance on large datasets
	const getFilterName = useCallback(
		(filterId: string): string => {
			const filter = data?.filterItems?.find(
				(filterItem: FilterItem) => filterItem.id === filterId
			)
			return filter?.name || filterId
		},
		[data]
	)

	const getOptionName = useCallback(
		(filterId: string, optionId: string): string => {
			const filter = data?.filterItems?.find(
				(filterItem: FilterItem) => filterItem.id === filterId
			)
			const option = filter?.options?.find(
				(option: FilterChooseOption) => option.id === optionId
			)
			return option?.name || optionId
		},
		[data]
	)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="text-red-600 font-medium">
				{t('error')}: {error.message}
			</div>
		)
	}
	return (
		<main
			className="flex flex-col items-center justify-center min-h-screen p-6 gap-8 bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url('/bg.jpg')" }}
		>
			<h1 className="text-4xl font-bold text-gray-800">{t('title')}</h1>

			{/* Filter display section */}
			<FilterList
				selectedFilters={selectedFilters}
				getFilterName={getFilterName}
				getOptionName={getOptionName}
			/>

			{/* Modal button */}
			<button
				onClick={openFilters}
				className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
			>
				{t('openFilters')}
			</button>

			{/*  Filter modal */}
			<FilterModal
				data={data}
				tempFilters={tempFilters}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				handleToggle={handleToggle}
				handleApplyClick={handleApplyClick}
				handleClearAll={handleClearAll}
			/>

			{/* Confirmation modal */}
			<ConfirmModal
				setIsOpen={setIsOpen}
				handleUseOld={handleUseOld}
				handleApplyNew={handleApplyNew}
				isConfirmOpen={isConfirmOpen}
			/>
		</main>
	)
}
