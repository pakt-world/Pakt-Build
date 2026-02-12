"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ClientJobUpdates4Mobile } from "./collection-deliverable-updates";
import { isJobCancellation } from "@/lib/actions/collection";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionStatus } from "@/lib/enums";
import { ReviewTalent4Mobile } from "./review-talent";
import { JobCancellationRequest } from "./cancel-collection/accept-job-cancellation";
import { ClientRequestJobCancellation4Mobile } from "./cancel-collection/request-job-cancellation";
import { ClientJobCancellationSuccessfullyRequested4Mobile } from "./cancel-collection/request-job-cancellation/request-success";
import { CollectionHasBeenCancelled4Mobile } from "./cancel-collection/cancelled";
import { ReviewSuccess } from "./review-talent/success";

interface ClientJobModalProps {
	jobId: string;
	talentId: string;
	closeMobileSheet: () => void;
	job: CollectionProps;
}

export const ClientJobSheet4Mobile: FC<ClientJobModalProps> = ({ jobId, talentId, closeMobileSheet, job }) => {
	const [isRequestingJobCancellation, setIsRequestingJobCancellation] = useState(false);

	const jobCancellation = job?.collections.find(isJobCancellation);
	const talentRequestedCancellation = jobCancellation?.creator?._id === job?.owner?._id;
	const clientRequestedCancellation = jobCancellation?.creator?._id === job?.creator?._id;

	const talentHasReviewed = job.ratings?.some((review) => review?.owner?._id === job.owner?._id);
	const clientHasReviewed = job.ratings?.some((review) => review?.owner?._id === job.creator?._id);

	// Client Requesting for Job Cancellation
	if (isRequestingJobCancellation) {
		return (
			<ClientRequestJobCancellation4Mobile
				jobId={jobId}
				closeMobileSheet={() => {
					setIsRequestingJobCancellation(false);
				}}
				cancelJobCancellationRequest={() => {
					setIsRequestingJobCancellation(false);
				}}
				talentId={talentId}
			/>
		);
	}

	// Job Cancelled
	if (job?.status === CollectionStatus.CANCELLED) {
		return <CollectionHasBeenCancelled4Mobile closeMobileSheet={closeMobileSheet} />;
	}

	// Talent Requesting for Job Cancellation
	if (jobCancellation && talentRequestedCancellation) {
		return (
			<JobCancellationRequest
				job={job}
				closeMobileSheet={() => {
					setIsRequestingJobCancellation(false);
				}}
			/>
		);
	}

	// Client Requested for Job Cancellation
	if (jobCancellation && clientRequestedCancellation) {
		return <ClientJobCancellationSuccessfullyRequested4Mobile closeMobileSheet={closeMobileSheet} />;
	}

	// Display Success Message after Review from both parties
	if (clientHasReviewed && talentHasReviewed) {
		return <ReviewSuccess closeModal={closeMobileSheet} />;
	}

	// Review Talent after Job Completion
	if ([CollectionStatus.WAITING, CollectionStatus.PAYMENT_REQUESTED].includes(job?.status) && job?.progress === 100) {
		return <ReviewTalent4Mobile job={job} closeMobileSheet={closeMobileSheet} />;
	}

	// Update Job Deliverables
	return (
		<ClientJobUpdates4Mobile
			job={job}
			requestJobCancellation={() => {
				setIsRequestingJobCancellation(true);
			}}
		/>
	);
};
