"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useRouter } from "next/navigation";
// import { Ribbon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { BookmarkCollection } from "../../../_shared/bookmark-collection";
import { titleCase } from "@/lib/utils";
import { CollectionProps } from "@/lib/types/collection";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { CollectionStatus } from "@/lib/enums";
import { SkillBadge } from "@/components/common/skill-badge";
// import Logger from "@/lib/utils/logger";

interface OpenJobProps {
	job: CollectionProps;
	rates: ExchangeRateRecord | undefined;
	onRefresh?: () => void;
	bookmarkId?: string;
	isBookmarked?: boolean;
	loggedInUser?: string;
	style?: React.CSSProperties;
	index?: string;
	className?: string;
}

export const OpenJobCard4Mobile: React.FC<OpenJobProps> = ({
	job,
	rates,
	onRefresh,
	bookmarkId,
	isBookmarked,
	style,
	loggedInUser: _l,
	index,
	className,
}) => {
	const router = useRouter();
	const realTimeRate = rates ? (rates[job?.meta?.coin?.reference] as number) : 0;
	// Remove ones with no creator
	if (!job?.creator || !job?.paymentFee || !job?._id) return null;
	// Destructure job
	const { creator, tags, name, _id, paymentFee, isBookmarked: isSaved, bookmarkId: savedId } = job;
	// Extract creator's necessary details

	const c = {
		_id: creator?._id || "",
		paktScore: creator?.score || 0,
		avatar: creator?.profileImage?.url || "",
		name: creator?.firstName || "User not found!",
		title: creator?.profile?.bio?.title || "Title not found!",
	};
	const isAcquired = job?.status !== CollectionStatus.PENDING;
	const isB = isSaved ?? isBookmarked;

	// if (name === "This is a job titile") Logger.info("Job", job);

	return (
		<div
			onClick={() => router.push(`${creator === null || creator === undefined ? "/jobs" : `/jobs/${_id}`}`)}
			onKeyDown={() => {}}
			role="button"
			tabIndex={0}
			className={`flex h-fit w-full grow origin-center transform flex-col gap-2 border-b border-green-300 bg-[#FDFFFC] p-4 ${
				isAcquired
					? "pointer-events-none cursor-not-allowed select-none border-2 opacity-70"
					: "transition duration-200 hover:scale-[1.01] active:scale-[0.99]"
				} ${className}`}
			style={style}
		>
			<div className="flex w-full !items-start justify-between gap-2">
				<div className="flex w-full items-start justify-between gap-1">
					<div className="flex items-center gap-2">
						<TalentProfile
							src={c?.avatar}
							score={c?.paktScore}
							size="xs"
							url={`talents/${c?._id}`}
							disabled={creator === null || creator === undefined}
						/>

						<div className="flex max-w-[60%] flex-col items-start justify-between">
							<span className="line-clamp-1 text-base font-medium text-title min-[1440px]:w-[110px] 2xl:w-[150px] 2xl-5:w-auto">
								{c.name}
							</span>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-body">
								{titleCase(c?.title)}
							</span>
						</div>
					</div>
					<JobAmountBadge
						paymentFee={paymentFee}
						realTimeRate={realTimeRate}
						coin={job?.meta?.coin}
						className="w-max text-xs"
						isFunded={job?.escrowPaid ?? false}
						usdInitialValue={job?.meta.usdInitialValue}
						paymentRate={job?.rate}
					/>
				</div>
				{/* {isAcquired && (
					<span className="flex items-end text-sm font-medium text-red-600">
						<Ribbon />
						Assigned!
					</span>
				)} */}
				{index && <p className="absolute right-2 text-xs leading-[18px] tracking-wide text-body">{index}</p>}
			</div>
			<p className="break-word flex grow items-center text-sm font-[450] leading-normal tracking-wide text-title">
				{name}
			</p>
			<div className="mt-auto flex w-full items-center justify-between">
				<div className="flex w-[90%] flex-nowrap items-center gap-2">
					{tags.slice(0, 3).map((skill) => {
						return <SkillBadge key={skill.name} skill={skill} />;
					})}
				</div>
				{!isAcquired && (
					<BookmarkCollection
						size={20}
						type="collection"
						isBookmarked={isB}
						bookmarkId={isB ? (savedId ?? "") : (bookmarkId ?? _id)}
						callback={onRefresh}
					/>
				)}
			</div>
		</div>
	);
};
