import React from 'react'
import { useTranslation } from 'react-i18next'

import type { FilterChooseOption, FilterItem } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterModalProps {
	data?: { filterItems: FilterItem[] }
	tempFilters: SearchRequestFilter
	setIsOpen: (open: boolean) => void
	handleToggle: (filterId: string, optionId: string) => void
	handleApplyClick: () => void
	handleClearAll: () => void
	isOpen: boolean
}

export const FilterModal = React.memo(
	({
		data,
		tempFilters,
		setIsOpen,
		handleToggle,
		handleApplyClick,
		handleClearAll,
		isOpen
	}: FilterModalProps) => {
		const { t } = useTranslation('filter')
		if (!isOpen || !data) {
			return null
		}

		return (
			<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
				<div className="bg-white backdrop-blur-sm w-[1280px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-8 relative">
					<header className="relative flex items-center justify-center mb-6">
						<h2 className="text-2xl font-medium">{t('modalTitle')}</h2>
						<button
							onClick={() => setIsOpen(false)}
							className=" icon-btn text-black absolute right-0 text-2xl leading-none"
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
									const checked = current?.optionsIds.includes(opt.id) ?? false

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
							className="btn btn-accent bg-[#FF5F00] hover:bg-orange-600 text-white text-xs text-center px-12 py-3 rounded-xl"
							onClick={handleApplyClick}
						>
							{t('apply')}
						</button>
						<button
							onClick={handleClearAll}
							className=" btn btn-link absolute right-0 text-sm text-[#078691] hover:text-[#0fb6c5] underline"
						>
							{t('clearAllParameters')}
						</button>
					</div>
				</div>
			</div>
		)
	}
)
FilterModal.displayName = 'ConfirmModal'
