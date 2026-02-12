"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Star } from "lucide-react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeclineReviewChange, useAcceptReviewChange } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { CollectionProps } from "@/lib/types/collection";
import { isJobDeliverable, isReviewChangeRequest } from "@/lib/actions/collection";
import { Button } from "@/components/common/button";

interface ReviewChangeRequestedProps {
	job: CollectionProps;
}

export const ReviewChangeRequested: FC<ReviewChangeRequestedProps> = ({ job }) => {
	const acceptMutation = useAcceptReviewChange({
		jobId: job._id,
		recipientId: String(job.owner?._id),
	});
	const declineMutation = useDeclineReviewChange({
		jobId: job._id,
		recipientId: String(job.owner?._id),
	});

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
	const talent = job.owner;
	const clientReview = job.ratings?.find((review) => review.owner?._id === job.creator?._id);

	const deliverableIds = job.collections.filter(isJobDeliverable).map((deliverable) => deliverable?._id);

	return (
		<>
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/jobs?skills=&search=&range=%2C100&jobs-type=accepted",
					},
					{
						label: "Resubmission",
						active: true,
					},
				]}
			/>
			<div className="flex h-full flex-col gap-6 px-4 py-4">
				<div className="flex flex-col gap-5">
					<h3 className="text-lg font-medium">Request to Improve</h3>
					<div className="flex flex-col gap-3 rounded-xl bg-[#FEF4E3] p-3">
						<p className="text-base text-title">{reviewChangeRequest?.description}</p>

						<div className="relative -left-[5px] flex items-center gap-2">
							<TalentProfile
								score={talent?.score ?? 0}
								size="sm"
								src={talent?.profileImage?.url}
								url={`/talents/${talent?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-base font-bold leading-normal tracking-wide text-title">{`${talent?.firstName}`}</span>
								<span className="text-xs capitalize leading-[18px] tracking-wide">
									{talent?.profile?.bio?.title}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-slate-50 p-3">
					<div className="flex w-full items-center justify-between">
						<h3 className="text-sm font-medium text-title">Your review</h3>
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

				<div className="mt-auto flex w-full flex-col items-center gap-3 pb-11">
					<Button
						fullWidth
						onClick={() => {
							acceptMutation.mutate({
								jobId: job._id,
								reviewId: clientReview?._id ?? "",
								requestId: reviewChangeRequest?._id ?? "",
								deliverableIds: [...deliverableIds, job?._id],
							});
						}}
						variant="primary"
					>
						{acceptMutation.isLoading ? <Spinner size={20} /> : "Reopen Job"}
					</Button>
					<Button
						fullWidth
						onClick={() => {
							declineMutation.mutate({
								reviewChangeRequestId: reviewChangeRequest?._id ?? "",
							});
						}}
						variant="secondary"
						size="md"
					>
						{declineMutation.isLoading ? <Spinner size={20} /> : "Decline Request"}
					</Button>
				</div>
			</div>
		</>
	);
};
