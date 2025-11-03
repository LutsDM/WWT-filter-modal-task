import React from 'react'
import { useTranslation } from 'react-i18next'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterListProps {
	selectedFilters: SearchRequestFilter
	getFilterName: (id: string) => string
	getOptionName: (filterId: string, optionId: string) => string
}

export const FilterList = React.memo(
	({ selectedFilters, getFilterName, getOptionName }: FilterListProps) => {
		const { t } = useTranslation('filter')

		return (
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
		)
	}
)
FilterList.displayName = 'FilterList'
