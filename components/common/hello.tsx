"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";

export const HelloUser = (): JSX.Element | null => {
	const { user } = useUserState();
	const { firstName } = user ?? { firstName: "" };

	return (
		<div className="w-full px-4 max-sm:py-4 sm:px-0">
			<h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-gray-800 sm:hidden">
				Hello {firstName}!
			</h3>
		</div>
	);
};
