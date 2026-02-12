"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { ChevronLeft, Star } from "lucide-react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeclineReviewChange, useAcceptReviewChange } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { CollectionProps } from "@/lib/types/collection";
import { isJobDeliverable, isReviewChangeRequest } from "@/lib/actions/collection";
import { Button } from "@/components/common/button";

interface ReviewChangeRequestedProps {
	job: CollectionProps;
	closeModal?: () => void;
}

export const ReviewChangeRequested4Desktop: FC<ReviewChangeRequestedProps> = ({ closeModal, job }) => {
	const talent = job.owner;

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
	const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);
	const deliverableIds = job.collections.filter(isJobDeliverable).map((deliverable) => deliverable._id);

	const acceptMutation = useAcceptReviewChange({
		jobId: job?._id,
		recipientId: String(job.owner?._id),
	});
	const declineMutation = useDeclineReviewChange({
		jobId: job?._id,
		recipientId: String(job.owner?._id),
	});

	return (
		<>
			<div className="border-b-2 border-[#9BDCFD] bg-primary-gradient-light px-4 py-6 text-2xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button onClick={closeModal} type="button" aria-label="Back">
						<ChevronLeft />
					</button>
					<span>Request To Improve</span>
				</div>
			</div>
			<div className="flex h-full flex-col gap-6 p-4">
				<div className="flex flex-col gap-2">
					<h3 className="text-[22px] font-bold">Job Description</h3>
					<div className="flex min-h-[189px] flex-col gap-2 rounded-xl bg-blue-lightest p-3">
						<h3 className="text-lg font-bold text-title">{job?.name}</h3>
						<p className="text-sm">{job?.description}</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg text-title">Talent Comment</h3>
					<div className="flex min-h-[150px] flex-col justify-between gap-2 rounded-xl bg-[#FEF4E3] p-4">
						<p className="text-lg text-body">&apos;{reviewChangeRequest?.description}&apos;</p>

						<div className="flex items-center gap-2">
							<TalentProfile
								score={talent?.score ?? 0}
								size="sm"
								src={talent?.profileImage?.url}
								url={`/talents/${talent?._id}`}
							/>

							<div className="flex flex-col">
								<span className="text-base font-bold leading-[31.2px] text-title2">{`${talent?.firstName}`}</span>
								<span className="text-xs capitalize leading-none text-title2">
									{talent?.profile?.bio?.title}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex min-h-[120px] flex-col gap-3 rounded-xl border border-line bg-white p-4">
					<div className="flex w-full items-center justify-between">
						<h3 className="text-lg font-bold text-title">Your review</h3>

						{/* @ts-ignore */}
						<Rating
							readonly
							initialRating={clientReview?.rating ?? 0}
							fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
							emptySymbol={<Star fill="transparent" color="#15D28E" />}
						/>
					</div>
					<p className="text-body">{clientReview?.review}</p>
				</div>

				<div className="ml-auto mt-auto flex w-full max-w-[70%] items-center gap-3">
					<Button
						fullWidth
						onClick={() => {
							declineMutation.mutate({
								reviewChangeRequestId: reviewChangeRequest?._id ?? "",
							});
						}}
						variant="secondary"
						size="lg"
					>
						{declineMutation.isLoading ? <Spinner size={20} /> : "Decline Request"}
					</Button>

					<Button
						fullWidth
						onClick={() => {
							acceptMutation.mutate({
								jobId: job?._id,
								reviewId: clientReview?._id ?? "",
								requestId: reviewChangeRequest?._id ?? "",
								deliverableIds: [...deliverableIds, job?._id],
							});
						}}
						variant="primary"
						size="lg"
					>
						{acceptMutation.isLoading ? <Spinner size={20} /> : "Reopen Job"}
					</Button>
				</div>
			</div>
		</>
	);
};
