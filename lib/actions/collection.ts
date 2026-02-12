import { JobInvitesProps } from "../api/invites";
import { CollectionStatus, CollectionTypes, PayoutStatus, SortApplicationsScoresBy } from "../enums";
import { CollectionProps } from "../types/collection";
import { removeDuplicatesFromArray } from "../utils";

export const isJobDeliverable = (collection: CollectionProps): collection is CollectionProps => {
	return collection.type === CollectionTypes.DELIVERABLE;
};

export const isJobApplicant = (collection: CollectionProps): collection is CollectionProps => {
	return collection.type === CollectionTypes.APPLICATION;
};

export const isJobCancellation = (collection: CollectionProps): collection is CollectionProps => {
	return collection.type === CollectionTypes.CANCEL_REQUEST;
};

export const isReviewChangeRequest = (collection: CollectionProps): collection is CollectionProps => {
	return collection.type === CollectionTypes.REVIEW_CHANGE_REQUEST;
};

export const talentAndClientHasReviewed = (job: CollectionProps): boolean => {
	return (
		job.ratings?.some((review) => review.owner._id === job.owner?._id) ||
		job.ratings?.some((review) => review.owner._id === job.creator?._id) ||
		false
	);
};

export const extractOngoingCreatedJobs = (jobs: CollectionProps[]): CollectionProps[] => {
	return jobs.filter(
		(job) =>
			job.payoutStatus !== PayoutStatus.COMPLETED &&
			job.inviteAccepted &&
			!talentAndClientHasReviewed(job) &&
			job.status !== CollectionStatus.CANCELLED
	);
};

export const isJobPaid = (bounty: CollectionProps[]): CollectionProps[] => {
	return bounty.filter((b: CollectionProps) => b.escrowPaid);
};

export const unassignedJobs = (jobs: CollectionProps[], loggedInUserId: string): CollectionProps[] => {
	return jobs.filter((job) => {
		const creator = job.creator._id === loggedInUserId;
		return (
			creator &&
			(job.status === CollectionStatus.PENDING ||
				(job.status === CollectionStatus.ONGOING && !job.inviteAccepted))
		);
	});
};
export const jobsUnfunded = (jobs: CollectionProps[], loggedInUserId: string): CollectionProps[] => {
	const notFundedJobs = jobs.filter((job: CollectionProps) => !job.escrowPaid && job.creator?._id === loggedInUserId);
	// Remove duplicates
	return removeDuplicatesFromArray(notFundedJobs);
};

// Remove those without coin and usdInitialValue in meta
export const jobWithCoin = (job: CollectionProps[]): CollectionProps[] => {
	return job.filter((job) => job.meta?.coin && job.meta?.usdInitialValue);
};

export const provideUnassignedJobs = (jobs: CollectionProps[]): CollectionProps[] => {
	return jobs
		.filter(
			(job) =>
				job.status === CollectionStatus.PENDING ||
				(job.status === CollectionStatus.ONGOING && !job.inviteAccepted)
		)
		.filter((job) => !job.invite);
};

export const provideInvitedApplication = (applicants: CollectionProps[], job: CollectionProps): CollectionProps[] => {
	return applicants?.filter((applicant) => applicant?.creator?._id === job?.invite?.receiver?._id);
};

export const removeInvitedFromApplicants = (
	applicants: CollectionProps[],
	invitedApplicants: CollectionProps[]
): CollectionProps[] => {
	return applicants.filter(
		(applicant) => !invitedApplicants.some((invited) => invited.creator._id === applicant.creator._id)
	);
};

export const getActiveJobs = (jobs: CollectionProps[]): CollectionProps[] => {
	return jobs.filter(
		(job) =>
			job.payoutStatus !== PayoutStatus.COMPLETED &&
			job.inviteAccepted &&
			job.collections.some((collection) => collection.type === CollectionTypes.DELIVERABLE) &&
			!talentAndClientHasReviewed(job)
	);
};

export const completedJobs = (bountySlots: CollectionProps[]): CollectionProps[] => {
	return bountySlots.filter(
		(bounty) =>
			(bounty.payoutStatus === PayoutStatus.COMPLETED || talentAndClientHasReviewed(bounty)) ??
			bounty.status === CollectionStatus.CANCELLED
	);
};

export const sortApplicantsHandler = (
	a: CollectionProps,
	b: CollectionProps,
	key: (obj: CollectionProps) => number,
	order: { label: string; value: string }
): number => {
	if (order.value === SortApplicationsScoresBy.HIGHEST_TO_LOWEST) {
		return key(b) - key(a);
	}

	if (order.value === SortApplicationsScoresBy.LOWEST_TO_HIGHEST) {
		return key(a) - key(b);
	}

	return 0;
};

// Filter invites
export const filterInvites = (collection: JobInvitesProps[], loggedInUserId: string): JobInvitesProps[] => {
	return collection.filter((job) => job.data && job.data.invite && job.data.invite.receiver._id === loggedInUserId);
};
