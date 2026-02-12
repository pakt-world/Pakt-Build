"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";

export const WithdrawalHeader = ({ clearForm, className }: { clearForm: () => void; className?: string }) => {
	return (
		<div
			className={`flex w-full items-center gap-2 bg-primary-gradient-light p-4 text-white max-sm:sticky max-sm:-top-[1px] max-sm:z-50
				sm:px-4 sm:py-6 ${className}`}
		>
			<button
				className="flex h-fit w-fit items-center justify-center max-sm:pl-0 sm:absolute sm:left-[5%] sm:h-10 sm:w-10 sm:rounded-lg
					sm:border sm:border-white sm:border-opacity-25 sm:bg-white sm:bg-opacity-90"
				onClick={() => {
					clearForm();
				}}
				type="button"
				aria-label="Close Modal"
			>
				<ChevronLeft size={24} className="cursor-pointer text-white sm:text-[#4EA55C]" />
			</button>
			<div className="hidden grow flex-col text-center sm:flex">
				<h3 className="text-2xl font-bold">Withdrawal</h3>
				<p>Withdraw funds to another wallet</p>
			</div>
			<h3 className="text-lg font-bold sm:hidden">Withdrawal</h3>
		</div>
	);
};
