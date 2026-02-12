"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Clock4 } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { FeedCardWrapper } from "../../_components/wrapper";
import { titleCase } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { MetaProps } from "@/lib/types/collection";
import { CollectionInviteType } from "./enum";

export interface CollectionInvitePendingProps {
	jobId: string;
	title: string;
	inviteId: string;
	amount: string;
	inviter: {
		_id: string;
		name: string;
		avatar?: string;
		score: number;
		title: string;
	};
	receiver?: {
		_id: string;
		name: string;
		avatar?: string;
		score: number;
		title: string;
	};
	imageUrl?: string;
	invitationExpiry?: string;
	type: CollectionInviteType.COLLECTION_INVITE_PENDING;
	meta: MetaProps;
	realTimeRate: number;
	loggedInUser?: string;
	createdAt: string;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	feedId: string;
	refetchFeeds: () => void;
	dueDate?: string;
	paymentRate: string;
}

export const CollectionInvitePending = (props: CollectionInvitePendingProps) => {
	const router = useRouter();
	const tab = useMediaQuery("(min-width: 640px)");
	const {
		title,
		amount,
		inviter,
		invitationExpiry,
		inviteId,
		jobId,
		meta,
		realTimeRate,
		loggedInUser,
		receiver,
		createdAt,
		bookmark,
		feedId,
		refetchFeeds,
		dueDate,
		paymentRate,
	} = props;
	const coin = meta.coin;
	return (
		<FeedCardWrapper
			borderColor="#9BDCFD"
			bgColor="#F1FBFF"
			iconColor="#C9F0FF"
			createdAt={createdAt}
			feedId={feedId}
			// dismissible
			refetchFeeds={refetchFeeds}
			bookmark={bookmark}
			dueDate={dueDate}
		>
			{tab ? (
				<div className="flex size-full items-center gap-4">
					<TalentProfile
						src={inviter?.avatar as string}
						score={inviter.score}
						size="lg"
						url={`/talents/${inviter?._id}`}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							{inviter._id === loggedInUser ? (
								<span className="flex flex-wrap items-center !text-xl font-bold text-black">
									You invited {receiver?.name ?? "No Receiver"} to a job
								</span>
							) : (
								<span className="flex flex-wrap items-center !text-xl font-bold text-black">
									{inviter?.name} Invited you to a job
								</span>
							)}
						</div>

						<span className="text-[24px] font-normal text-title">{title}</span>

						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								<JobAmountBadge
									coin={coin}
									paymentFee={Number(amount)}
									realTimeRate={realTimeRate}
									isFunded
									usdInitialValue={meta?.usdInitialValue}
									paymentRate={paymentRate}
								/>
								<Button size="md" variant="secondaryOutline" asChild>
									<Link
										href={`/jobs/${jobId}?invite-id=${inviteId}`}
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
						router.push(`/jobs/${jobId}?invite-id=${inviteId}`);
					}}
					className="relative flex w-full flex-col items-start gap-4"
				>
					<div className="flex items-center gap-2">
						<TalentProfile
							score={inviter?.score}
							src={inviter?.avatar as string}
							size="xs"
							url={`/talents/${inviter?._id}`}
						/>
						<div className="flex w-[200px] flex-col items-start justify-start">
							<p className="line-clamp-1 text-lg leading-[27px] tracking-wide text-gray-800">
								{inviter?.name}
							</p>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(inviter?.title ?? "")}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<div className="flex items-center justify-between">
							<span className="flex flex-wrap items-center !text-base font-bold text-black">
								Invited you to a job
							</span>

							<div className="flex items-center gap-2">
								{invitationExpiry && (
									<div className="flex items-center gap-1 text-sm text-body">
										<Clock4 size={20} />
										<span>Time left: 1:48:00</span>
									</div>
								)}
							</div>
						</div>

						<h3 className="text-sm font-normal text-title">{title}</h3>
						<JobAmountBadge
							usdInitialValue={meta.usdInitialValue}
							coin={coin}
							paymentFee={Number(amount)}
							realTimeRate={realTimeRate}
							isFunded
							className="w-max text-xs"
							paymentRate={paymentRate}
						/>
					</div>
					{/* <Button
					size="md"
					fullWidth
					variant="outlinePrimary"
					className=""
					onClick={() => {
						router.push(`/jobs/${jobId}?invite-id=${inviteId}`);
					}}
				>
					See Details
				</Button> */}
				</div>
			)}
		</FeedCardWrapper>
	);
};
