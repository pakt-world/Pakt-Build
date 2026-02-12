/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	isCancelled?: boolean;
	totalDeliverables: number;
	percentageProgress: number;
}
interface BarProps {
	isCancelled?: boolean;
}

const InProgress: FC<BarProps> = ({ isCancelled }) => (
	<div
		className={cn("h-2 flex-1 basis-0 rounded-full", {
			"bg-[#fee2e2]": isCancelled,
			"bg-[#e8e8e8]": !isCancelled,
		})}
	/>
);

const Completed: FC<BarProps> = ({ isCancelled }) => (
	<div
		className={cn("h-2 flex-1 basis-0 rounded-full", {
			"bg-[#FF5247]": isCancelled,
			"bg-[#23C16B]": !isCancelled,
		})}
	/>
);

export const DeliverableProgressBar: FC<Props> = ({
	percentageProgress,
	totalDeliverables,
	isCancelled,
	className,
}) => {
	const completedCount = Math.round((percentageProgress / 100) * totalDeliverables);

	const progressBars = Array.from({ length: totalDeliverables }, (_, i) =>
		i < completedCount ? (
			<Completed key={i} isCancelled={isCancelled} />
		) : (
			<InProgress key={i} isCancelled={isCancelled} />
		)
	);

	return (
		<div className={cn("flex w-full max-w-[200px] flex-col gap-2 text-xs", className)}>
			<div
				className={cn("flex items-center gap-1", {
					"text-[#FF5247]": isCancelled,
					"text-[#6E7191]": !isCancelled,
				})}
			>
				<span>{isCancelled ? "Job Cancelled. Progress:" : "Job Progress:"}</span>
				<span>{percentageProgress}%</span>
			</div>
			<div className="flex grow items-center gap-1">{progressBars}</div>
		</div>
	);
};
