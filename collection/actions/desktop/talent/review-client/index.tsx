"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { ChevronLeft, Star } from "lucide-react";
import Rating from "react-rating";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJobReview, useMarkJobAsComplete, useReleaseJobPayment } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { RequestReviewChangeSuccess4Desktop } from "./success";
import { RequestReviewChange4Desktop } from "./request-review-change";
import { CollectionProps } from "@/lib/types/collection";
import { isReviewChangeRequest } from "@/lib/actions/collection";
import { Button } from "@/components/common/button";
import { CollectionStatus } from "@/lib/enums";

interface ReviewClientProps {
	job: CollectionProps;
	closeModal: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewClient4Desktop: FC<ReviewClientProps> = ({ job, closeModal }) => {
	const router = useRouter();
	const [requestReviewChange, setRequestReviewChange] = useState(false);

	const mutation = useCreateJobReview();
	const releasePaymentMutation = useReleaseJobPayment();
	const markJobAsComplete = useMarkJobAsComplete();

	const { _id: jobId, creator, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const clientReview = job.ratings?.find((review) => review.owner?._id === job.creator?._id);

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
	const reviewChangeRequestCompleted = reviewChangeRequest?.status === "completed";
	const [reviewChangeRequestPending, setReviewChangeRequestPending] = useState(
		reviewChangeRequest?.status === "pending"
	);

	const talentId = String(owner?._id);

	if (reviewChangeRequestPending) {
		return <RequestReviewChangeSuccess4Desktop closeModal={closeModal} />;
	}

	if (requestReviewChange) {
		return (
			<RequestReviewChange4Desktop
				job={job}
				setRequestReviewChange={setRequestReviewChange}
				setReviewChangeRequestPending={setReviewChangeRequestPending}
				jobId={jobId}
				recipientId={String(creator?._id)}
			/>
		);
	}

	return (
		<>
			<div className="border-b-2 border-[#9BDCFD] bg-primary-gradient-light px-4 py-6 text-2xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button onClick={closeModal} aria-label="Back" type="button">
						<ChevronLeft />
					</button>
					<span>Review</span>
				</div>
			</div>

			<div className="flex h-full flex-col gap-6 p-4">
				{clientReview && clientReview.rating < 5 && !reviewChangeRequestCompleted && (
					<div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-3">
						<div className="flex items-center justify-between">
							<span className="text-lg font-normal text-title">
								{clientReview?.owner?.firstName}&apos; Review
							</span>
							{/* @ts-ignore */}
							<Rating
								readonly
								initialRating={clientReview?.rating || 0}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" />}
							/>
						</div>
						<p className="text-body">{clientReview?.review}</p>
						<Button
							fullWidth
							size="md"
							variant="outlinePrimary"
							onClick={() => {
								setRequestReviewChange(true);
							}}
						>
							Request opportunity to improve
						</Button>
					</div>
				)}

				<div className="">
					<h3 className="text-lg text-title">How was your experience with</h3>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<TalentProfile
								score={creator?.score || 0}
								size="sm"
								src={creator?.profileImage?.url}
								url={`/talents/${creator?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-xl font-bold leading-[31.2px] text-title2">{`${creator?.firstName}`}</span>
								<span className="line-clamp-1 text-sm capitalize leading-none text-title2">
									{creator?.profile?.bio?.title}
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
							className="bg-input-white w-full grow resize-none rounded-lg border border-line p-2 placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">{comment.length}</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">{MAX_COMMENT_LENGTH}</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						variant="primary"
						disabled={mutation.isLoading || rating === 0 || comment.length === 0}
						onClick={() => {
							releasePaymentMutation.mutate(
								{
									jobId,
									owner: talentId,
								},
								{
									onSuccess: () => {
										mutation.mutate({
											rating,
											jobId,
											review: comment,
											recipientId: creator?._id ?? "",
										});
										// Trigger this after 1 second after the payment has been released
										setTimeout(() => {
											markJobAsComplete.mutate(
												{
													jobId,
													talentId,
													status: CollectionStatus.COMPLETED,
												},
												{
													onError: () => {
														markJobAsComplete.reset();
													},
												}
											);
											router.push("/wallet");
										}, 3000);
									},
								}
							);
						}}
						size="md"
					>
						{mutation.isLoading || releasePaymentMutation.isLoading || markJobAsComplete.isLoading ? (
							<Spinner size={20} />
						) : (
							"Submit Review"
						)}
					</Button>
				</div>
			</div>
		</>
	);
};
