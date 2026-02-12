"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PublicJobCreatedFeed } from "./feed-cards/public-collection-created";
import { JobFeedCard } from "./feed-cards/collection-invite";
import { JobApplicationCard } from "./feed-cards/new-collection-application";
import { JobUpdateFeed } from "./feed-cards/completed-a-deliverable";
import { ReferralSignupFeed } from "./feed-cards/referred-talent-signed-up";
import { JobReviewedFeed } from "./feed-cards/reviewed-talent";
import { ReferralJobCompletion } from "./feed-cards/referred-talent-completed-a-collection";
import { PaymentReleased } from "./feed-cards/payment-released";
import { JobCompletionFeed } from "./feed-cards/completed-all-deliverables";
import { ReviewResponseChangeCard } from "./feed-cards/review-change/response";
import { ReviewChangeCard } from "./feed-cards/review-change/request";
import { JobCancelled } from "./feed-cards/collection-cancelled";
import { IssueResolutionRaiseFeed } from "./feed-cards/issue-resolution/raise";
import { JuryInvitationFeed } from "./feed-cards/issue-resolution/jury-invitation";
import { IssueResolutionRejectFeed } from "./feed-cards/issue-resolution/rejected";
import { SecondIssueResolutionRejectFeed } from "./feed-cards/issue-resolution/rejected2";
import { IssueResolutionResolveFeed } from "./feed-cards/issue-resolution/resolved";
import { CollectionTypes, FeedType, Roles } from "@/lib/enums";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { CollectionProps } from "@/lib/types/collection";
import { DataFeedResponse } from "@/lib/api/dashboard/types";
import { CollectionInviteType } from "./feed-cards/collection-invite/enum";
import { formatNumber } from "@/lib/utils";
import { CancellationRequestCard } from "./feed-cards/collection-cancellation";

export const ParseFeedView = (
	feed: DataFeedResponse,
	loggedInUser: string,
	key: number,
	refetchFeeds: () => void,
	rates?: ExchangeRateRecord | undefined,
	onBookmarksTab?: boolean
): ReactElement | null | undefined => {
	const amount = String(feed?.data?.paymentFee);
	const { isBookmarked = false, _id: feedId, type } = feed;

	const feedCreator = {
		_id: feed?.creator?._id ?? "",
		avatar: feed?.creator?.profileImage?.url ?? "",
		name: `${feed?.creator?.firstName ?? ""}`,
		score: feed?.creator?.score ?? 0,
		title: feed?.creator?.profile?.bio?.title ?? Roles.EMPTY,
	};

	const inviter = {
		_id: feed?.data?.creator?._id ?? "",
		avatar: feed?.data?.creator?.profileImage?.url ?? "",
		name: `${feed?.data?.creator?.firstName ?? ""}`,
		score: feed?.data?.creator?.score ?? 0,
		title: feed?.data?.creator?.profile?.bio?.title ?? Roles.EMPTY,
	};

	const talent = {
		_id: feed?.data?.owner?._id ?? "",
		avatar: feed?.data?.owner?.profileImage?.url ?? "",
		name: `${feed?.data?.owner?.firstName ?? ""}`,
		score: feed?.data?.owner?.score ?? 0,
		title: feed?.data?.owner?.profile?.bio?.title ?? Roles.EMPTY,
	};

	const deliverableTotal = (feed?.data?.collections ?? []).filter(
		(f: CollectionProps) => f.type === CollectionTypes.DELIVERABLE
	).length;
	const currentProgress = feed?.meta?.value;
	const deliverableCountPercentage = {
		total: deliverableTotal,
		progress: Math.floor(currentProgress as number),
	};

	// Logger.info("feed", feed);

	switch (type) {
		case FeedType.COLLECTION_CREATED:
		case FeedType.PUBLIC_JOB_CREATED:
			return (
				<PublicJobCreatedFeed
					key={key}
					creator={inviter}
					amount={amount}
					jobId={feed?.data?._id}
					title={feed?.title}
					feedId={feedId}
					refetchFeeds={refetchFeeds}
					coin={feed?.data?.meta?.coin}
					realTimeRate={rates?.[feed?.data?.meta?.coin?.reference] ?? 0}
					isFunded={feed?.data?.escrowPaid || false}
					usdInitialValue={feed?.data?.meta?.usdInitialValue}
					createdAt={feed?.createdAt}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
					dueDate={feed?.data?.deliveryDate ?? ""}
					job={feed?.data}
				/>
			);
		case FeedType.COLLECTION_INVITE:
		case FeedType.JOB_INVITATION_RECEIVED:
			return (
				<JobFeedCard
					key={key}
					title={feed?.title}
					type={CollectionInviteType.COLLECTION_INVITE_PENDING}
					amount={amount}
					inviteId={feed?.data?.invite?._id ?? ""}
					inviter={inviter}
					jobId={feed?.data?._id}
					meta={feed?.data?.meta}
					realTimeRate={rates?.[feed?.data?.meta?.coin?.reference] ?? 0}
					createdAt={feed?.createdAt}
					feedId={feedId}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
					dueDate={feed?.data?.deliveryDate ?? ""}
					paymentRate={feed?.data?.rate}
				/>
			);
		case FeedType.JOB_INVITATION_ACCEPTED:
		case FeedType.JOB_INVITATION_DECLINED:
		case FeedType.COLLECTION_INVITE_ACCEPTED:
		case FeedType.COLLECTION_INVITE_REJECTED:
		case FeedType.COLLECTION_INVITE_CANCELLED:
			return (
				<JobFeedCard
					key={key}
					title={feed?.data?.name}
					type={CollectionInviteType.COLLECTION_INVITE_RESPONSE}
					accepted={feed?.type === (FeedType.JOB_INVITATION_ACCEPTED || FeedType.COLLECTION_INVITE_ACCEPTED)}
					cancelled={feed?.type === FeedType.COLLECTION_INVITE_CANCELLED}
					jobId={feed?.data?._id}
					talent={feedCreator}
					createdAt={feed?.createdAt}
					feedId={feedId}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
					dueDate={feed?.data?.deliveryDate ?? ""}
				/>
			);
		case FeedType.JOB_APPLICATION_SUBMITTED:
			return (
				<JobApplicationCard
					key={key}
					feedId={feed?._id}
					title={feed?.data?.parent?.name ?? ""}
					applicant={{
						_id: feed?.data?.creator?._id || "",
						name: `${feed?.data?.creator?.firstName}`,
						avatar: feed?.data?.creator?.profileImage?.url ?? "",
						score: feed?.data?.creator?.score,
						title: feed?.data?.creator?.profile?.bio?.title ?? "",
					}}
					jobId={feed?.data?.parent?._id ?? ""}
					createdAt={feed?.createdAt}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.JOB_DELIVERABLE_UPDATE:
		case FeedType.COLLECTION_UPDATE: {
			const { data } = feed;
			return (
				<JobUpdateFeed
					key={key}
					talent={talent}
					creator={inviter}
					title={feed?.title}
					description={feed?.description}
					jobId={feed?.data?._id}
					progress={deliverableCountPercentage}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					jobTitle={data?.name}
					isMarked={feed?.meta?.isMarked as boolean}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
					dueDate={feed?.data?.deliveryDate ?? ""}
				/>
			);
		}
		case FeedType.REFERRAL_SIGNUP:
			return (
				<ReferralSignupFeed
					key={key}
					feedId={feed?._id}
					name={`${feed?.creator?.firstName ?? ""}`}
					title={feed?.title}
					jobTitle={feed?.creator?.profile?.bio?.title}
					description={feed?.description}
					avatar={feed?.creator?.profileImage?.url}
					userId={feed?.creator?._id}
					score={feed?.creator?.score}
					createdAt={feed?.createdAt}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.JOB_REVIEW:
			return (
				<JobReviewedFeed
					key={key}
					feedId={feed?._id}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					title={feed?.data?.name}
					description={feed?.description}
					rating={feed?.meta?.rating}
					createdAt={feed?.createdAt}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.REFERRAL_COLLECTION_COMPLETION:
			return (
				<ReferralJobCompletion
					key={key}
					talent={talent}
					jobId={feed?.data?._id}
					title={feed?.data?.name}
					rating={feed?.meta?.rating as number}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.JOB_PAYMENT_RELEASED:
			return (
				<PaymentReleased
					key={key}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					amount={String(feed?.meta?.amount) || String(feed?.data?.releaseFundAmount)}
					description={feed?.description}
					title={feed?.title}
					meta={feed?.data?.meta}
					realTimeRate={Number(feed?.data?.rate)}
					createdAt={feed?.createdAt as string}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
					paymentRate={feed?.data?.rate}
				/>
			);
		case FeedType.COLLECTION_COMPLETED:
		case FeedType.JOB_COMPLETION:
			return (
				<JobCompletionFeed
					key={key}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					title={feed?.data?.name}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
					dueDate={feed?.data?.deliveryDate ?? ""}
				/>
			);
		case FeedType.COLLECTION_CANCELLED:
		case FeedType.JOB_CANCELLED:
			return (
				<JobCancelled
					key={key}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					title={feed?.title}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.JOB_CANCELLED_REQUEST:
			return (
				<CancellationRequestCard
					key={key}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					title={`${feedCreator.name} requested to cancel a job`}
					description={feed?.data?.name}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.JOB_CANCELLED_ACCEPTED:
		case FeedType.JOB_CANCELLED_DECLINED:
			return (
				<CancellationRequestCard
					key={key}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					title={
						feed?.type === FeedType.JOB_CANCELLED_ACCEPTED
							? `${feedCreator.name} accepted your job cancellation`
							: `${feedCreator.name} declined your job cancellation`
					}
					description={feed?.data?.name}
					isAccepted={feed?.type === FeedType.JOB_CANCELLED_ACCEPTED}
					rating={feed?.meta?.value}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.JOB_REVIEW_CHANGE:
			return (
				<ReviewChangeCard
					key={key}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					title={`${talent.name} submitted a redo request`}
					description={feed?.description}
					isAccepted={false}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);
		case FeedType.JOB_REVIEW_CHANGE_ACCEPTED:
		case FeedType.JOB_REVIEW_CHANGE_DECLINED:
			return (
				<ReviewResponseChangeCard
					key={key}
					talent={talent}
					creator={inviter}
					jobId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					title={feed?.title}
					description={feed?.description}
					isDeclined={feed?.type === FeedType.JOB_REVIEW_CHANGE_DECLINED}
					createdAt={feed?.createdAt}
					feedId={feed?._id}
					refetchFeeds={refetchFeeds}
					bookmark={{
						onBookmarksTab: onBookmarksTab || false,
						isBookmarked,
						bookmarkId: feed?.bookmarkId ?? "",
					}}
				/>
			);

		case FeedType.ISSUE_RAISED:
			return (
				<IssueResolutionRaiseFeed
					key={key}
					issueId={feed?.data?.issue || ""}
					issuerName={`${feed?.creator?.firstName}`}
					description={feed?.description}
					createdAt={feed?.createdAt}
				/>
			);
		case FeedType.ISSUE_RESOLUTION_GUILTY:
			return (
				<IssueResolutionRejectFeed
					key={key}
					fundsAmount={`$${formatNumber(Number(feed?.data?.usdExpectedAmount || 0))}`}
					description={feed?.description}
					createdAt={feed?.createdAt}
				/>
			);
		case FeedType.ISSUE_RESOLUTION_RESOLVED:
			return (
				<IssueResolutionResolveFeed
					key={key}
					fundsAmount={`$${formatNumber(Number(feed?.data?.usdExpectedAmount || 0))}`}
					description={feed?.description}
					createdAt={feed?.createdAt}
				/>
			);
		case FeedType.ISSUE_RESOLUTION_GUILTY_SECOND:
			return (
				<SecondIssueResolutionRejectFeed
					key={key}
					fundsAmount={`$${formatNumber(Number(feed?.data?.usdExpectedAmount || 0))}`}
					description={feed?.description}
					createdAt={feed?.createdAt}
				/>
			);
		case FeedType.JURY_INVITATION:
			return (
				<JuryInvitationFeed
					key={key}
					issueId={feed?.data?.issue || ""}
					description={feed?.description}
					createdAt={feed?.createdAt}
				/>
			);
		default:
			return null;
	}
};
