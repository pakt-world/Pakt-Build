"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ReviewChangeRequested } from "./review-change-requested";
import { ReviewSuccess } from "./success";
import { ReviewTalentForm } from "./review-talent";
import { isReviewChangeRequest } from "@/lib/actions/collection";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionStatus } from "@/lib/enums";

interface ReviewTalentProps {
	job: CollectionProps;
	closeMobileSheet: () => void;
}

export const ReviewTalent4Mobile: FC<ReviewTalentProps> = ({ job, closeMobileSheet }) => {
	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);

	const reviewChangeRequestPending = reviewChangeRequest?.status === CollectionStatus.PENDING;
	const clientHasReviewed = job.ratings?.some((review) => review.owner?._id === job.creator?._id);

	return (
		<div className="size-full overflow-y-auto">
			{reviewChangeRequestPending ? (
				<ReviewChangeRequested job={job} />
			) : clientHasReviewed ? (
				<ReviewSuccess closeModal={closeMobileSheet} />
			) : (
				<ReviewTalentForm job={job} />
			)}
		</div>
	);
};
