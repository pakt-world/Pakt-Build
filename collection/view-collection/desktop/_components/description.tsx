"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

interface JobDescriptionProps {
	description: string;
}

export const JobDescription = ({ description }: JobDescriptionProps): ReactElement => {
	return (
		<div className="flex w-full flex-col gap-2">
			<h3 className="text-lg font-bold text-title">Job Description</h3>
			<div className="min-h-[100px] rounded-lg border border-blue-lighter bg-[#FAF8F8] p-4">
				<p className="text-lg font-normal text-[#202325]">{description}</p>
			</div>
		</div>
	);
};
