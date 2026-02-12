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
import { TalentJobUpdates4Desktop } from "./collection-deliverable-updates";
import { ReviewClient4Desktop } from "./review-client";
import { ReviewClientSuccessfully4Desktop } from "./review-client/success";
import { JobCancellationRequestFromClient4Desktop } from "./cancel-collection/accept-job-cancellation";
import { RequestJobCancellation } from "./cancel-collection/request-job-cancellation";
import { TalentJobCancellationSuccessfullyRequested4Desktop } from "./cancel-collection/request-job-cancellation/request-success";
import { isJobCancellation } from "@/lib/actions/collection";
import { CollectionStatus } from "@/lib/enums";
import { CollectionHasBeenCancelled } from "./cancel-collection/cancelled";

interface TalentJobSheet4DesktopProps {
	jobId: string;
	talentId: string;
	closeModal: () => void;
	reportAnIssue: () => void;
}

export const TalentJobSheet4Desktop: FC<TalentJobSheet4DesktopProps> = ({
	jobId,
	talentId,
	closeModal,
	reportAnIssue,
}) => {
	const [isRequestingJobCancellation, setIsRequestingJobCancellation] = useState(false);
	const query = useGetJobById({ jobId });

	if (query.isError) return <PageError className="absolute inset-0" />;

	if (query.isLoading) return <PageLoading className="absolute inset-0" color="#3055B3" />;

	const job = query.data;

	// Talent Requesting for Job Cancellation
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
	const talentRequestedCancellation = jobCancellation?.creator._id === job.owner?._id; // problem here
	const clientRequestedCancellation = jobCancellation?.creator._id === job.creator?._id;

	const talentHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.owner?._id);
	const clientHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.creator?._id);

	// Job Cancelled
	if (job.status === CollectionStatus.CANCELLED) {
		return <CollectionHasBeenCancelled closeModal={closeModal} />;
	}

	// Client Requesting for Job Cancellation
	if (jobCancellation && clientRequestedCancellation) {
		return (
			<JobCancellationRequestFromClient4Desktop
				job={job}
				closeModal={() => {
					setIsRequestingJobCancellation(false);
				}}
			/>
		);
	}

	// Talent Requesting for Job Cancellation
	if (jobCancellation && talentRequestedCancellation) {
		return <TalentJobCancellationSuccessfullyRequested4Desktop closeModal={closeModal} />;
	}

	// Display Success Message after Review from both parties
	if (clientHasReviewed && talentHasReviewed) {
		return <ReviewClientSuccessfully4Desktop closeModal={closeModal} />;
	}

	// Review Client if Talent has not reviewed
	if (clientHasReviewed && !talentHasReviewed) {
		return <ReviewClient4Desktop job={job} closeModal={closeModal} />;
	}

	// Update Job Deliverables
	return (
		<TalentJobUpdates4Desktop
			job={job}
			reportAnIssue={reportAnIssue}
			requestJobCancellation={() => {
				setIsRequestingJobCancellation(true);
			}}
		/>
	);
};
