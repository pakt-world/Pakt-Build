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
import { CollectionProps, MetaProps } from "@/lib/types/collection";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";

interface ClientJobCardProps {
	jobId: string;
	title: string;
	reviewText?: string;
	ratingCount?: number;
	price: number;
	isCancelled?: boolean;
	totalDeliverables: number;
	completedDeliverables: number;
	reviewRequestChange?: CollectionProps;
	talent: {
		id: string;
		name: string;
		avatar?: string;
		paktScore: number;
		title: string;
	};
	isCompleted?: boolean;
	meta: MetaProps;
	realTimeRate: number;
	jobProgress?: number;
	paymentRate: string;
}

export const ClientJobCard4Mobile: FC<ClientJobCardProps> = ({
	talent,
	price,
	title,
	jobId,
	isCancelled,
	totalDeliverables,
	completedDeliverables,
	isCompleted,
	reviewText,
	ratingCount,
	meta,
	realTimeRate,
	paymentRate,
}) => {
	const router = useRouter();
	const progress = Math.floor((completedDeliverables / totalDeliverables) * 100);

	return (
		<div
			className="flex w-full flex-col gap-3 border-b border-gray-200 bg-neutral-50 p-4"
			onMouseDown={() => {
				router.push(`/jobs/${jobId}/updates`);
			}}
			role="button"
			tabIndex={0}
		>
			<div className="flex w-full flex-col gap-1">
				<div className="flex w-full items-start justify-between gap-2">
					<div className="flex w-max items-center gap-3">
						<TalentProfile
							score={talent.paktScore}
							size="sm"
							src={talent?.avatar}
							url={`/talents/${talent?.id}`}
						/>
						<div className="flex flex-col">
							<span className="line-clamp-1 text-base tracking-wide text-gray-800">{talent?.name}</span>
							<span className="line-clamp-1 text-xs tracking-wide text-gray-500">
								{titleCase(talent?.title)}
							</span>
						</div>
					</div>
					<JobAmountBadge
						paymentFee={price}
						coin={meta?.coin}
						realTimeRate={realTimeRate}
						isFunded
						usdInitialValue={meta?.usdInitialValue}
						className="w-max text-xs"
						paymentRate={paymentRate}
					/>
				</div>
			</div>
			{!isCompleted && (
				<div className="text-base font-medium leading-normal tracking-tight text-gray-500">
					Completed a Deliverables
				</div>
			)}
			<div className="flex grow items-center break-words text-lg text-gray-800">{title}</div>
			{isCompleted && <div className="text-base leading-normal tracking-tight text-gray-500">{reviewText}</div>}
			<div className="mt-auto flex w-full items-end gap-2">
				<DeliverableProgressBar
					isCancelled={isCancelled}
					percentageProgress={progress}
					totalDeliverables={totalDeliverables}
					className="w-full max-w-none"
				/>
				<div className="flex items-center">
					{isCompleted && (
						/* @ts-ignore */
						<Rating
							readonly
							initialRating={ratingCount ?? 0}
							fullSymbol={<Star fill="#15D28E" color="#15D28E" size={18} />}
							emptySymbol={<Star fill="transparent" color="#15D28E" size={18} />}
							className="!inline-flex w-full items-center justify-end gap-1"
						/>
					)}
				</div>
			</div>
		</div>
	);
};
