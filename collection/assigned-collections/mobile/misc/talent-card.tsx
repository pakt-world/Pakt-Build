"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Rating from "react-rating";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { titleCase } from "@/lib/utils";
import { CollectionProps } from "@/lib/types/collection";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";

interface TalentJobCardProps {
	jobId: string;
	title: string;
	price: number;
	isCancelled?: boolean;
	isCompleted?: boolean;
	totalDeliverables: number;
	completedDeliverables: number;
	job: CollectionProps;
	realTimeRate: number;
	reviewText?: string;
	ratingCount?: number;
}

export const TalentJobCard: FC<TalentJobCardProps> = ({
	price,
	title,
	jobId,
	isCompleted,
	totalDeliverables,
	completedDeliverables,
	isCancelled,
	job,
	realTimeRate,
	reviewText,
	ratingCount,
}) => {
	const router = useRouter();
	const progress = Math.floor((completedDeliverables / totalDeliverables) * 100);

	const client = {
		id: job?.creator?._id ?? "",
		avatar: job?.creator?.profileImage?.url,
		name: `${job?.creator?.firstName ?? "Deleted User"}`,
		paktScore: job?.creator?.score ?? 0,
		title: job?.creator?.profile?.bio?.title ?? "",
	};
	return (
		<div
			className={`flex w-full flex-col gap-2 border-b p-4 ${isCancelled ? "border-[#FF5247] bg-[#FFF4F4]" : "border-line bg-white"}`}
			onMouseDown={() => {
				router.push(`/jobs/${jobId}/updates`);
			}}
			role="button"
			tabIndex={0}
		>
			<div className="flex w-full gap-4">
				<TalentProfile score={client.paktScore} size="sm" src={client.avatar} url={`/talents/${client.id}`} />

				<div className="flex w-full items-start justify-between gap-2">
					<div className="flex flex-col">
						<span className="text-lg leading-[27px] tracking-wide text-gray-800">{client?.name}</span>
						<span className="text-xs leading-[18px] tracking-wide text-gray-500">
							{titleCase(client?.title)}
						</span>
					</div>
					<JobAmountBadge
						coin={job?.meta?.coin}
						paymentFee={price}
						realTimeRate={realTimeRate}
						isFunded={job?.escrowPaid ?? false}
						usdInitialValue={job?.meta?.usdInitialValue}
						className="w-max text-xs"
						paymentRate={job?.rate}
					/>
				</div>
			</div>
			<div className="flex grow items-center break-words text-sm font-medium text-title">{title}</div>
			{isCompleted && <div className="text-base leading-normal tracking-tight text-gray-500">{reviewText}</div>}
			<div className="mt-auto flex w-full flex-col items-start gap-2">
				{isCompleted && (
					/* @ts-ignore */
					<Rating
						readonly
						initialRating={ratingCount ?? 0}
						fullSymbol={<Star fill="#15D28E" color="#15D28E" size={18} />}
						emptySymbol={<Star fill="transparent" color="#15D28E" size={18} />}
					/>
				)}

				<DeliverableProgressBar
					totalDeliverables={totalDeliverables}
					percentageProgress={progress}
					className="w-full max-w-none"
					isCancelled={isCancelled}
				/>
			</div>
		</div>
	);
};
