"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { isJobCancellation } from "@/lib/actions/collection";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { TalentJobUpdates4Mobile } from "./collection-deliverable-updates";
import { ReviewClient } from "./review-client";
import { ReviewSuccess } from "./review-client/success";
import { JobCancellationRequestFromClient4Mobile } from "./cancel-collection/accept-job-cancellation";
import { RequestJobCancellation } from "./cancel-collection/request-job-cancellation";
import { TalentJobCancellationSuccessfullyRequested4Mobile } from "./cancel-collection/request-job-cancellation/request-success";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionHasBeenCancelled4Mobile } from "./cancel-collection/cancelled";
import { CollectionStatus } from "@/lib/enums";

interface TalentJobModalProps {
	jobId: string;
	talentId: string;
	closeMobileSheet: () => void;
	extras?: string;
	job: CollectionProps;
}

export const TalentJobSheet4Mobile: FC<TalentJobModalProps> = ({ jobId, talentId, closeMobileSheet }) => {
	const [isRequestingJobCancellation, setIsRequestingJobCancellation] = useState(false);
	const query = useGetJobById({ jobId });

	if (query.isError) return <PageError className="absolute inset-0" />;

	if (query.isLoading) return <PageLoading className="absolute inset-0" color="#3055B3" />;

	const job = query.data;

	if (isRequestingJobCancellation) {
		return (
			<RequestJobCancellation
				jobId={jobId}
				talentId={talentId}
				closeModal={() => {
					setIsRequestingJobCancellation(false);
				}}
				cancelJobCancellationRequest={() => {
					setIsRequestingJobCancellation(false);
				}}
			/>
		);
	}

	const jobCancellation = job.collections.find(isJobCancellation);
	const talentRequestedCancellation = jobCancellation?.creator?._id === job?.owner?._id; // problem here
	const clientRequestedCancellation = jobCancellation?.creator?._id === job?.creator?._id;

	const talentHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.owner?._id);
	const clientHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.creator?._id);

	// Job Cancelled
	if (job.status === CollectionStatus.CANCELLED) {
		return <CollectionHasBeenCancelled4Mobile closeMobileSheet={closeMobileSheet} />;
	}

	// Client Requesting for Job Cancellation
	if (jobCancellation && clientRequestedCancellation) {
		return (
			<JobCancellationRequestFromClient4Mobile
				job={job}
				closeModal={() => {
					setIsRequestingJobCancellation(false);
				}}
			/>
		);
	}

	// Talent Requesting for Job Cancellation
	if (jobCancellation && talentRequestedCancellation) {
		return <TalentJobCancellationSuccessfullyRequested4Mobile closeModal={closeMobileSheet} />;
	}

	// Display Success Message after Review from both parties
	if (clientHasReviewed && talentHasReviewed) {
		return <ReviewSuccess closeModal={closeMobileSheet} />;
	}

	// Review Client if Talent has not reviewed
	if (clientHasReviewed && !talentHasReviewed) {
		return <ReviewClient job={job} closeModal={closeMobileSheet} />;
	}

	// Update Job Deliverables
	return (
		<TalentJobUpdates4Mobile
			job={job}
			requestJobCancellation={() => {
				setIsRequestingJobCancellation(true);
			}}
		/>
	);
};
