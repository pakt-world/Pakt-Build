"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Search } from "lucide-react";

export const CoinSearchInput = ({
	searchTerm,
	setSearchTerm,
}: {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
}): JSX.Element => {
	return (
		<div className="relative flex w-full items-center gap-2 bg-secondary/10">
			<div className="absolute left-3">
				<Search size={18} className="text-body" />
			</div>
			<input
				type="text"
				className="w-full resize-none !rounded-[10px] border bg-transparent px-2 py-[11px] pl-10 text-body placeholder:text-zinc-500
					placeholder:text-opacity-30 focus:outline-none"
				placeholder="Type to Search"
				value={searchTerm}
				onChange={(e) => {
					setSearchTerm(e.target.value);
				}}
			/>
		</div>
	);
};
