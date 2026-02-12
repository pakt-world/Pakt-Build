"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Search } from "lucide-react";

export const ChatListSearch = ({
	searchChat,
	searchHandler,
}: {
	searchChat: string;
	searchHandler: (value: string) => void;
}): JSX.Element => {
	return (
		<div
			className="relative flex w-full items-center gap-2 p-4 py-4 max-sm:fixed max-sm:left-0 max-sm:top-[70px] max-sm:z-30
				max-sm:h-[74px] max-sm:border-b max-sm:bg-white"
		>
			<div className="absolute left-6">
				<Search size={18} className="text-body" />
			</div>
			<input
				type="text"
				className="w-full resize-none rounded-lg border bg-gray-50 px-2 py-2 pl-8 focus:outline-none"
				placeholder="Search chat"
				value={searchChat}
				onChange={(e) => {
					searchHandler(e.target.value);
				}}
			/>
		</div>
	);
};
