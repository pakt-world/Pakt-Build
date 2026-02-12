"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { JobInvitesProps } from "@/lib/api/invites";
import { CollectionInviteType } from "@/collection/collection-feeds/feed-cards/collection-invite/enum";
import { useUserState } from "@/lib/store/account";
import { JobFeedCard } from "@/collection/collection-feeds/feed-cards/collection-invite";

interface InvitesProps {
	rates: ExchangeRateRecord | undefined;
	isLoading: boolean;
	isError: boolean;
	invites: JobInvitesProps[] | undefined;
}

export const Invites = ({ isLoading, isError, rates, invites }: InvitesProps): JSX.Element => {
	const tab = useMediaQuery("(min-width: 650px)");
	const { user } = useUserState();
	const { _id: loggedInUser } = user || { _id: "" };

	if (isLoading)
		return (
			<PageLoading
				className="h-[calc(100vh-212px)] bg-transparent max-sm:fixed max-sm:bottom-[64px] sm:h-[65vh]"
				color="#3055B3"
			/>
		);

	if (isError)
		return (
			<PageError className="h-[calc(100vh-212px)] bg-transparent max-sm:fixed max-sm:bottom-[64px] sm:h-[65vh]" />
		);

	if (invites?.length === 0)
		return (
			<PageEmpty
				className="h-[calc(100vh-212px)] bg-transparent max-sm:fixed max-sm:bottom-[64px] sm:h-[65vh]"
				label="Your Invites will appear here"
			/>
		);
	return tab ? (
		<div className="max-h-[65vh] w-full overflow-y-auto bg-transparent max-sm:p-4 sm:px-4 sm:pt-1">
			<div className="flex w-full flex-col sm:gap-5">
				{invites?.map(({ _id: inviteId, data, receiver, createdAt }) => {
					const { creator, name, _id: jobId, paymentFee, meta } = data;
					const realTimeRate = rates?.[meta?.coin?.reference] ?? 0;
					return (
						<JobFeedCard
							feedId={jobId}
							title={name}
							jobId={jobId}
							key={inviteId}
							type={CollectionInviteType.COLLECTION_INVITE_PENDING}
							inviteId={inviteId}
							amount={String(paymentFee)}
							inviter={{
								_id: creator?._id,
								score: creator?.score,
								avatar: creator?.profileImage?.url,
								name: `${creator?.firstName}`,
								title: creator?.profile?.bio?.title ?? "",
							}}
							receiver={{
								_id: receiver?._id ?? "",
								score: receiver?.score ?? 0,
								avatar: receiver?.profileImage?.url,
								name: `${receiver?.firstName}`,
								title: receiver?.profile?.bio?.title ?? "",
							}}
							meta={meta}
							realTimeRate={realTimeRate}
							loggedInUser={loggedInUser}
							createdAt={createdAt}
							bookmark={{
								onBookmarksTab: false,
								isBookmarked: false,
								bookmarkId: inviteId,
							}}
							refetchFeeds={() => {}}
							paymentRate={data?.rate}
						/>
					);
				})}
			</div>
		</div>
	) : (
		<div className="h-[70vh] w-full overflow-y-auto overflow-x-hidden pb-16">
			{invites?.map(({ _id: inviteId, data, createdAt }) => {
				const { creator, name, _id: jobId, paymentFee, meta } = data;
				const realTimeRate = rates?.[meta?.coin?.reference] ?? 0;
				return (
					<JobFeedCard
						feedId={jobId}
						title={name}
						jobId={jobId}
						key={inviteId}
						type={CollectionInviteType.COLLECTION_INVITE_PENDING}
						inviteId={inviteId}
						amount={String(paymentFee)}
						inviter={{
							_id: creator?._id,
							score: creator?.score,
							avatar: creator?.profileImage?.url,
							name: `${creator?.firstName}`,
							title: creator?.profile?.bio?.title ?? "",
						}}
						meta={meta}
						realTimeRate={realTimeRate}
						createdAt={createdAt}
						bookmark={{
							onBookmarksTab: false,
							isBookmarked: false,
							bookmarkId: inviteId,
						}}
						refetchFeeds={() => {}}
						paymentRate={data?.rate}
					/>
				);
			})}
		</div>
	);
};
