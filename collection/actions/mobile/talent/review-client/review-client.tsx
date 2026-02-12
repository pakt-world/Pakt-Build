"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Star } from "lucide-react";
import Rating from "react-rating";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { useCreateJobReview, useMarkJobAsComplete, useReleaseJobPayment } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionStatus } from "@/lib/enums";

interface ReviewClientProps {
	job: CollectionProps;
	reviewChangeRequestCompleted: boolean;
	setRequestReviewChange: (value: boolean) => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewClientForm: FC<ReviewClientProps> = ({
	job,
	reviewChangeRequestCompleted,
	setRequestReviewChange,
}) => {
	const router = useRouter();

	const mutation = useCreateJobReview();
	const releasePaymentMutation = useReleaseJobPayment();
	const markJobAsComplete = useMarkJobAsComplete();

	const { _id: jobId, creator, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const clientReview = job.ratings?.find((review) => review.owner?._id === job.creator?._id);

	const talentId = String(owner?._id);

	return (
		<>
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/jobs?skills=&search=&range=%2C100&jobs-type=accepted",
					},
					{
						label: "Review Job",
						active: true,
					},
				]}
				className="!fixed top-[70px]"
			/>
			<div className="mt-[43px] flex h-auto min-h-[calc(100%-113px)] flex-col gap-4 p-4">
				{clientReview && clientReview.rating < 5 && !reviewChangeRequestCompleted && (
					<div className="xborder-line flex flex-col gap-3 rounded-xl border border-[#7DDE86] p-3">
						<div className="flex items-center justify-between">
							<span>{clientReview?.owner?.firstName}&apos; Review</span>
							{/* @ts-ignore */}
							<Rating
								readonly
								initialRating={clientReview.rating || 0}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" />}
							/>
						</div>
						<p className="text-body">{clientReview?.review}</p>
						<Button
							fullWidth
							size="sm"
							variant="secondary"
							onClick={() => {
								setRequestReviewChange(true);
							}}
							className="border border-[#007C5B] bg-transparent text-[#007C5B]"
						>
							Request opportunity to improve
						</Button>
					</div>
				)}

				<h3 className="text-lg leading-[27px] tracking-wide">How was your experience with</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<TalentProfile
							score={creator?.score || 0}
							size="sm"
							src={creator?.profileImage?.url}
							url={`/talents/${creator?._id}`}
						/>

						<div className="flex flex-col gap-1">
							<span className="text-base font-bold leading-normal tracking-wide text-blue-950">{`${creator?.firstName}`}</span>
							<span className="line-clamp-1 text-xs capitalize leading-[18px] tracking-wide text-blue-950">
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

				<div className="flex flex-col gap-1">
					<h3>Comment</h3>
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
							className="w-full grow resize-none rounded-lg border border-line bg-white p-2 shadow placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">{comment.length}</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">{MAX_COMMENT_LENGTH} characters</span>
						</div>
					</div>
				</div>
				<Button
					fullWidth
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
					className="mt-auto"
					variant="primary"
					size="lg"
				>
					{mutation.isLoading || releasePaymentMutation.isLoading || markJobAsComplete.isLoading ? (
						<Spinner size={20} />
					) : (
						"Submit Review"
					)}
				</Button>
			</div>
		</>
	);
};
