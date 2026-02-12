"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { ChevronLeft, Star } from "lucide-react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJobReview, useReleaseJobPayment } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { ReviewChangeRequested4Desktop } from "./review-change-requested";
import { ReviewTalentSuccess4Desktop } from "./success";
import { isReviewChangeRequest } from "@/lib/actions/collection";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionStatus } from "@/lib/enums";
import { Button } from "@/components/common/button";

interface ReviewTalentProps {
	job: CollectionProps;
	closeModal: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewTalent4Desktop: FC<ReviewTalentProps> = ({ job, closeModal }) => {
	const mutation = useCreateJobReview();
	const releasePaymentMutation = useReleaseJobPayment();

	const { description, name, _id, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);

	const reviewChangeRequestPending = reviewChangeRequest?.status === CollectionStatus.PENDING;
	const clientHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.creator?._id);

	if (reviewChangeRequestPending) {
		return <ReviewChangeRequested4Desktop job={job} closeModal={closeModal} />;
	}

	if (clientHasReviewed) {
		return <ReviewTalentSuccess4Desktop closeModal={closeModal} />;
	}

	return (
		<>
			<div className="border-b-2 border-[#9BDCFD] bg-primary-gradient-light px-4 py-6 text-2xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button onClick={closeModal} type="button" aria-label="Back">
						<ChevronLeft />
					</button>
					<span>Review</span>
				</div>
			</div>

			<div className="flex h-full flex-col gap-6 p-4">
				<div className="flex flex-col gap-2">
					<h3 className="text-[22px] font-bold">Job Description</h3>
					<div className="flex min-h-[189px] flex-col gap-2 rounded-xl border border-blue-lightest p-3">
						<h3 className="text-lg font-bold text-title">{name}</h3>

						<p className="text-sm">{description}</p>
					</div>
				</div>

				<div className="">
					<h3 className="text-lg text-title">How was your experience with</h3>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<TalentProfile
								score={owner?.score ?? 0}
								size="sm"
								src={owner?.profileImage?.url}
								url={`/talents/${owner?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-2xl font-bold leading-[31.2px] text-title2">{`${owner?.firstName}`}</span>
								<span className="line-clamp-1 text-base capitalize leading-none text-title2">
									{owner?.profile?.bio?.title}
								</span>
							</div>
						</div>

						<div>
							{/* @ts-ignore */}
							<Rating
								initialRating={rating}
								onChange={(value) => {
									setRating(value);
								}}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" />}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="text-base font-normal text-title">Comment</h3>
					<div>
						<textarea
							rows={3}
							value={comment}
							onChange={(e) => {
								if (e.target.value.length <= MAX_COMMENT_LENGTH) {
									setComment(e.target.value);
								}
							}}
							placeholder="Write your comment..."
							className="w-full grow resize-none rounded-lg border border-line bg-input-bg p-2 placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">{comment?.length}</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">{MAX_COMMENT_LENGTH}</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						variant="primary"
						size="md"
						onClick={() => {
							releasePaymentMutation.mutate(
								{
									jobId: _id,
									owner: owner?._id ?? "",
								},
								{
									onSuccess: () => {
										mutation.mutate({
											rating,
											jobId: _id,
											review: comment,
											recipientId: owner?._id ?? "",
										});
									},
								}
							);
						}}
					>
						{mutation.isLoading ? <Spinner size={20} /> : "Submit Review"}
					</Button>
				</div>
			</div>
		</>
	);
};
