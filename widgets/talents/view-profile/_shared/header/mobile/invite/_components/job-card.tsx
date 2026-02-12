"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";
import { cn } from "@/lib/utils";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { Checkbox } from "@/components/common/checkbox";

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
				`flex h-fit w-full cursor-pointer flex-col items-start gap-4 rounded-none border-b border-t border-line !p-4
				duration-200 `,
				{
					"!border-[#9BDCFD] shadow-md": isSelected,
				}
			)}
			onClick={() => {
				if (isSelected) {
					setJobId("");
				} else {
					setJobId(job._id);
				}
			}}
			role="button"
			tabIndex={0}
		>
			<div className="flex w-full flex-col items-start gap-2">
				<div className="flex w-full items-center justify-between gap-2">
					<span className="text-xs font-medium text-body">
						Created: {format(new Date(job.createdAt), "dd MMM yyyy")}
					</span>
					<div className="flex items-center justify-between gap-2">
						<JobAmountBadge
							coin={job?.meta?.coin}
							paymentFee={job.paymentFee}
							realTimeRate={realTimeRate}
							isFunded={job.escrowPaid ?? false}
							usdInitialValue={job.meta.usdInitialValue}
							className="w-max !px-2 text-xs"
							paymentRate={job.rate}
						/>
						<Checkbox checked={isSelected} className="checkbox_style" />
					</div>
				</div>
			</div>

			<p className="text-base text-title">{job.name}</p>

			<div className="flex w-full items-center gap-2">
				{job.tags.slice(0, 3).map(({ color, name }) => (
					<span
						key={name}
						className="truncate rounded-full bg-slate-100 px-4 py-0.5 text-xs font-medium capitalize text-black"
						style={{ backgroundColor: color }}
					>
						{name}
					</span>
				))}
			</div>
		</div>
	);
};
