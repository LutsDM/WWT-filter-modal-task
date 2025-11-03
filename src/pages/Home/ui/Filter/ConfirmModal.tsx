import React from 'react'
import { useTranslation } from 'react-i18next'

interface ConfirmModalProps {
	setIsOpen: (open: boolean) => void
	handleUseOld: () => void
	handleApplyNew: () => void
	isConfirmOpen: boolean
}

export const ConfirmModal = React.memo(
	({
		setIsOpen,
		handleUseOld,
		handleApplyNew,
		isConfirmOpen
	}: ConfirmModalProps) => {
		const { t } = useTranslation('filter')

		if (!isConfirmOpen) {
			return null
		}
		return (
			<div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-60">
				<div className="bg-white rounded-lg shadow-xl p-8 text-center min-w-[800px] transition-transform duration-200 scale-100">
					<div className="relative flex items-center justify-center">
						<h3 className="text-2xl font-semibold mb-6">{t('confirmTitle')}</h3>
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
		)
	}
)
ConfirmModal.displayName = 'ConfirmModal'
