"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Star } from "lucide-react";

import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJobReview, useReleaseJobPayment } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { CollectionProps } from "@/lib/types/collection";
import { Button } from "@/components/common/button";

interface ReviewTalentProps {
	job: CollectionProps;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewTalentForm: FC<ReviewTalentProps> = ({ job }) => {
	const mutation = useCreateJobReview();
	const releasePaymentMutation = useReleaseJobPayment();
	const { _id, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	return (
		<>
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/jobs?skills=&search=&range=%2C100&jobs-type=created",
					},
					{ label: "Review Job", active: true },
				]}
				className="!fixed top-[70px]"
			/>
			<div className="flex h-auto min-h-[calc(100%-43px)] flex-col gap-4 p-4">
				<h3 className="text-lg leading-[27px] tracking-wide">How was your experience with</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<TalentProfile
							score={owner?.score ?? 0}
							size="sm"
							src={owner?.profileImage?.url}
							url={`/talents/${owner?._id}`}
						/>

						<div className="flex flex-col gap-1">
							<span className="line-clamp-1 break-all text-base font-bold leading-normal tracking-wide text-blue-950">{`${owner?.firstName}`}</span>
							<span className="line-clamp-1 text-xs capitalize leading-[18px] tracking-wide text-blue-950">
								{owner?.profile?.bio?.title}
							</span>
						</div>
					</div>

					<div className="whitespace-nowrap">
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
							<span className="text-sm text-body">{MAX_COMMENT_LENGTH}</span>
						</div>
					</div>
				</div>

				<div className="mt-auto flex flex-col">
					<Button
						fullWidth
						variant="primary"
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
						className=""
						type="button"
						size="md"
					>
						{mutation.isLoading ? <Spinner size={20} /> : "Submit Review"}
					</Button>
				</div>
			</div>
		</>
	);
};
