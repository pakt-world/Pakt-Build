"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { CSSProperties } from "react";
import Link from "next/link";
import { Ribbon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { CollectionProps } from "@/lib/types/collection";
import { BookmarkCollection } from "@/collection/_shared/bookmark-collection";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { CollectionStatus } from "@/lib/enums";

interface OpenJobProps {
	job: CollectionProps;
	onRefresh?: () => void;
	bookmarkId?: string;
	isBookmarked?: boolean;
	style?: CSSProperties;
	index?: string;
	className?: string;
	rates: ExchangeRateRecord | undefined;
}

export const DesktopOpenJobCard = ({
	job,
	onRefresh,
	bookmarkId,
	isBookmarked,
	style,
	className,
	rates,
}: OpenJobProps) => {
	const realTimeRate = rates?.[job?.meta?.coin?.reference ?? ""] ?? 0;
	// Remove ones with no creator
	if (!job?.creator || !job?.paymentFee || !job?._id) return null;
	// Destructure job
	const { creator, tags, name, _id, paymentFee, isBookmarked: isSaved, bookmarkId: savedId } = job;
	// Extract creator's necessary details
	const c = {
		_id: creator?._id || "",
		paktScore: creator?.score || 0,
		avatar: creator?.profileImage?.url || "",
		name: creator?.firstName || "Deleted User",
		title: creator?.profile?.bio?.title || "Title not found!",
	};
	const isAcquired = job?.status !== CollectionStatus.PENDING;
	return (
		<div
			className={`flex h-fit grow origin-center transform flex-col gap-4 rounded-3xl border border-amount_badge-m bg-white p-4 ${
				isAcquired
					? "cursor-not-allowed select-none border-2 opacity-70"
					: "transition duration-200 hover:scale-[1.01] active:scale-[0.99]"
				} ${className}`}
			style={style}
		>
			<Link href={`${creator === null || creator === undefined ? "/jobs" : `/jobs/${_id}`}`} className="w-full">
				<div className="flex w-full gap-4">
					<TalentProfile
						size="md"
						src={c.avatar}
						score={c.paktScore}
						url={`/talents/${c?._id}`}
						disabled={creator === null || creator === undefined}
					/>

					<div className="flex grow flex-col justify-between gap-2">
						<div className="flex w-full items-center justify-between gap-2">
							<div className="relative flex w-full flex-col items-start justify-between gap-2 sm:flex-row">
								<div className="flex flex-col">
									<span className="truncate text-sm font-medium text-title2 min-[1440px]:w-[110px] min-[1440px]:text-lg 2xl:w-[150px] 2xl-5:w-auto">
										{c?.name}
									</span>
									<span className="truncate text-xs font-normal text-body min-[1440px]:w-[110px] min-[1440px]:text-sm 2xl:w-[150px] 2xl-5:w-auto">
										{c?.title}
									</span>
								</div>

								<JobAmountBadge
									coin={job?.meta?.coin}
									paymentFee={paymentFee}
									realTimeRate={realTimeRate}
									isFunded={job.escrowPaid ?? false}
									usdInitialValue={job.meta.usdInitialValue}
									paymentRate={job.rate}
								/>
							</div>
						</div>
						<div className="break-word flex grow items-center text-base leading-normal tracking-wide text-title sm:text-lg min-[1440px]:text-[22px]">
							{name}
						</div>
					</div>
				</div>
			</Link>
			<div className="mt-auto flex w-full items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
					{tags.slice(0, 3).map((skill) => (
						<span
							key={skill.name}
							className="min-w-[50px] whitespace-nowrap rounded-full bg-slate-100 px-4 py-0.5 text-sm capitalize text-title last:!max-w-[106px]
								last:!truncate 2xl:last:!max-w-[166px]"
							style={{ background: skill.color }}
						>
							{skill.name}
						</span>
					))}
				</div>
				{isAcquired && (
					<span className="flex items-end text-sm font-medium text-red-600">
						<Ribbon />
						Assigned!
					</span>
				)}
				{!isAcquired && (
					<BookmarkCollection
						size={20}
						type="collection"
						isBookmarked={isSaved ?? isBookmarked}
						bookmarkId={bookmarkId ?? _id ?? savedId}
						callback={onRefresh}
						useCheck
					/>
				)}
			</div>
		</div>
	);
};
