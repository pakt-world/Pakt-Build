"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { AUTH_TOKEN_KEY, titleCase, truncateText } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { CoinProps, CollectionProps } from "@/lib/types/collection";
import { FeedCardWrapper } from "../_components/wrapper";

export const PublicJobCreatedFeed = ({
	realTimeRate,
	coin,
	creator,
	title,
	amount,
	jobId,
	isFunded,
	usdInitialValue,
	createdAt,
	feedId,
	bookmark,
	refetchFeeds,
	dueDate,
	job,
}: {
	realTimeRate: number;
	coin: CoinProps;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	title: string;
	amount: string;
	jobId: string;
	callback?: () => void;
	isFunded: boolean;
	usdInitialValue: number;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	dueDate: string;
	job: CollectionProps;
}): ReactElement => {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();
	const token = getCookie(AUTH_TOKEN_KEY);

	return (
		<FeedCardWrapper
			borderColor="#9BDCFD"
			bgColor="#F1FBFF"
			iconColor="#C9F0FF"
			createdAt={createdAt}
			feedId={feedId}
			dismissible
			refetchFeeds={refetchFeeds}
			bookmark={bookmark}
			dueDate={dueDate}
			collectionAmount={
				<JobAmountBadge
					usdInitialValue={usdInitialValue}
					coin={coin}
					paymentFee={Number(amount)}
					realTimeRate={realTimeRate}
					isFunded={isFunded}
					className="!h-[22px] !w-max !p-1 text-xs"
					paymentRate={job.rate}
				/>
			}
		>
			{tab ? (
				<div className="flex size-full items-center gap-4">
					<TalentProfile
						score={creator?.score}
						src={creator?.avatar}
						size="lg"
						url={token ? `/talents/${creator?._id}` : `/view-talent/${creator?._id}`}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-black">
								{creator?.name || "User not found!"} created a job
							</h3>
						</div>
						<p className="text-[24px] font-normal text-title">{title}</p>
						<div className="mt-auto flex items-center justify-between">
							<div className="mt-auto flex items-center gap-2">
								<JobAmountBadge
									coin={coin}
									paymentFee={Number(amount)}
									realTimeRate={realTimeRate}
									className="!bg-amount_badge"
									isFunded={isFunded ?? false}
									usdInitialValue={usdInitialValue}
									paymentRate={job?.rate}
								/>
								<Button size="md" variant="secondaryOutline" asChild>
									<Link
										href={token ? `/jobs/${jobId}` : `/view-job/${jobId}`}
										className="flex items-center gap-2"
									>
										See Details
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div
					onClick={() => {
						if (token) {
							router.push(`/jobs/${jobId}`);
						} else {
							router.push(`/view-job/${jobId}`);
						}
					}}
					className="relative flex w-full flex-col items-start gap-4"
				>
					<div className="flex items-center gap-2">
						<div
							className="z-10"
							onClick={(e) => {
								e.stopPropagation();
								router.push(token ? `/talents/${creator?._id}` : `/view-talent/${creator?._id}`);
							}}
						>
							<TalentProfile
								score={creator?.score}
								src={creator?.avatar}
								size="xs"
								url={token ? `/talents/${creator?._id}` : `/view-talent/${creator?._id}`}
							/>
						</div>
						<div className="flex w-[200px] flex-col items-start justify-start">
							<span className="truncate text-lg leading-[27px] tracking-wide text-gray-800">
								{truncateText(creator?.name, 12, false)}
							</span>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(creator?.title)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<p className="text-base font-bold text-black">Created a Job</p>
						<h3 className="text-sm font-medium text-title">{title}</h3>
					</div>
					{/* <Button
					size="md"
					variant="outlinePrimary"
					fullWidth
					onClick={() => {
						router.push(`/jobs/${jobId}`);
					}}
				>
					See Details
				</Button> */}
				</div>
			)}
		</FeedCardWrapper>
	);
};
