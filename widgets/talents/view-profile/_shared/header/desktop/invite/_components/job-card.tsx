"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { CollectionProps } from "@/lib/types/collection";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";

interface JobCardProps {
	job: CollectionProps;
	isSelected: boolean;
	setJobId: (jobId: string) => void;
	rates: ExchangeRateRecord | undefined;
}

export const JobCard = ({ job, setJobId, isSelected, rates }: JobCardProps): ReactElement | null => {
	const realTimeRate = rates ? (rates[job?.meta?.coin?.reference] as number) : 0;

	return (
		<div
			className={cn(
				`flex cursor-pointer flex-col gap-3 border-b border-gray-200 p-3 duration-200 hover:bg-[#FF9898]/5 max-sm:bg-[#FDFFFC]
				sm:rounded-xl sm:border`,
				{
					"border-[#FF9898]/50 bg-[#FF9898]/5 shadow-md max-sm:border-b max-sm:border-t": isSelected,
				}
			)}
			onClick={() => {
				if (isSelected) {
					setJobId("");
				} else {
					setJobId(job._id);
				}
			}}
			onKeyDown={(event) => {
				// 'Enter' or 'Space' key
				if (event.key === "Enter" || event.key === " ") {
					setJobId(job._id);
				}
			}}
			role="button"
			tabIndex={0}
		>
			<div className="flex w-full items-center justify-between">
				<span className="text-base font-medium text-body">
					Created {format(new Date(job.createdAt), "dd MMM yyyy")}
				</span>
				<JobAmountBadge
					coin={job?.meta?.coin}
					paymentFee={job.paymentFee}
					realTimeRate={realTimeRate}
					isFunded={job.escrowPaid ?? false}
					usdInitialValue={job.meta.usdInitialValue}
					paymentRate={job.rate}
				/>
			</div>
			<div className="line-clamp-2 grow text-xl text-title">{job.name}</div>
			<div className="flex items-center gap-2">
				{job.tags.slice(0, 3).map(({ color, name }) => (
					<span
						key={name}
						className="truncate rounded-full bg-slate-100 px-4 py-0.5 capitalize"
						style={{ backgroundColor: color }}
					>
						{name}
					</span>
				))}
			</div>
		</div>
	);
};
