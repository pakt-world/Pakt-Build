"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { isJobCancellation } from "@/lib/actions/collection";
import { ClientJobUpdates4Desktop } from "./collection-deliverable-updates";
import { ReviewTalent4Desktop } from "./review-talent";
import { JobCancellationRequestFromTalent4Desktop } from "./cancel-collection/accept-job-cancellation";
import { ClientRequestJobCancellation4Desktop } from "./cancel-collection/request-job-cancellation";
import { ClientJobCancellationSuccessfullyRequested4Desktop } from "./cancel-collection/request-job-cancellation/request-success";
import { CollectionStatus } from "@/lib/enums";
import { CollectionHasBeenCancelled } from "./cancel-collection/cancelled";
import { ReviewTalentSuccess4Desktop } from "./review-talent/success";

interface ClientJobSheet4DesktopProps {
	jobId: string;
	talentId: string;
	closeModal: () => void;
	reportAnIssue?: () => void;
	cancelCollection?: boolean;
	setCancelCollection?: (value: boolean) => void;
}

export const ClientJobSheet4Desktop: FC<ClientJobSheet4DesktopProps> = ({
	jobId,
	talentId,
	closeModal,
	reportAnIssue,
	cancelCollection,
}) => {
	const [isRequestingJobCancellation, setIsRequestingJobCancellation] = useState(cancelCollection ?? false);
	const query = useGetJobById({ jobId });

	if (query.isError) return <PageError className="absolute inset-0" />;

	if (query.isLoading) return <PageLoading className="absolute inset-0" color="#3055B3" />;

	const job = query.data;

	const jobCancellation = job.collections.find(isJobCancellation);
	const talentRequestedCancellation = jobCancellation?.creator?._id === job?.owner?._id;
	const clientRequestedCancellation = jobCancellation?.creator?._id === job?.creator?._id;

	const talentHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.owner?._id);
	const clientHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.creator?._id);

	// Client Requesting for Job Cancellation
	if (isRequestingJobCancellation) {
		return (
			<ClientRequestJobCancellation4Desktop
				jobId={jobId}
				closeModal={() => {
					setIsRequestingJobCancellation(false);
				}}
				cancelJobCancellationRequest={() => {
					setIsRequestingJobCancellation(false);
					if (cancelCollection) {
						closeModal();
					}
				}}
				talentId={talentId}
			/>
		);
	}

	// Job Cancelled
	if (job.status === CollectionStatus.CANCELLED) {
		return <CollectionHasBeenCancelled closeModal={closeModal} />;
	}

	// Talent Requesting for Job Cancellation
	if (jobCancellation && talentRequestedCancellation) {
		return (
			<JobCancellationRequestFromTalent4Desktop
				job={job}
				closeModal={() => {
					setIsRequestingJobCancellation(false);
				}}
			/>
		);
	}

	// Client Requested for Job Cancellation
	if (jobCancellation && clientRequestedCancellation) {
		return <ClientJobCancellationSuccessfullyRequested4Desktop closeModal={closeModal} />;
	}

	// Display Success Message after Review from both parties
	if (clientHasReviewed && talentHasReviewed) {
		return <ReviewTalentSuccess4Desktop closeModal={closeModal} />;
	}

	// Review Talent after Job Completion
	if ([CollectionStatus.WAITING, CollectionStatus.PAYMENT_REQUESTED].includes(job?.status) && job?.progress === 100) {
		return <ReviewTalent4Desktop job={job} closeModal={closeModal} />;
	}

	// Update Job Deliverables
	return (
		<ClientJobUpdates4Desktop
			job={job}
			reportAnIssue={reportAnIssue}
			requestJobCancellation={() => {
				setIsRequestingJobCancellation(true);
			}}
		/>
	);
};
