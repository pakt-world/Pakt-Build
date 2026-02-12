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

import { useRequestReviewChange } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { CollectionProps } from "@/lib/types/collection";
import { Button } from "@/components/common/button";

interface RequestReviewChangeProps {
	job: CollectionProps;
	jobId: string;
	recipientId: string;
	setRequestReviewChange: (value: boolean) => void;
	setReviewChangeRequestPending: (value: boolean) => void;
}

export const RequestReviewChange: FC<RequestReviewChangeProps> = ({
	job,
	jobId,
	recipientId,
	setRequestReviewChange,
	setReviewChangeRequestPending,
}) => {
	const mutation = useRequestReviewChange({ recipientId });
	const [reason, setReason] = useState("");

	const clientReview = job.ratings?.find((review) => review.owner?._id === job.creator?._id);

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
						action: () => {
							setRequestReviewChange(false);
						},
					},
					{
						label: "Resubmission",
						active: true,
					},
				]}
				className="!fixed top-[70px] !z-50 !bg-[#0E1319]"
			/>
			<div className="mt-[43px] flex h-auto min-h-[calc(100%-70px)] flex-col gap-6 px-4 py-4">
				<div className="flex flex-col gap-2 rounded-xl bg-[#FEF4E3] p-3">
					If the client approves your request, the job will be reopened. After completion both parties will
					leave new reviews.
				</div>

				<div>
					<div className="flex flex-col gap-3 rounded-xl border border-line p-3 shadow">
						<div className="flex items-center justify-between">
							<span>{clientReview?.owner.firstName}&apos; Review</span>
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
				</div>

				<div className="flex flex-col gap-1">
					<h3>
						Reason for requesting review change <span className="text-red-500">*</span>
					</h3>
					<div>
						<textarea
							rows={5}
							value={reason}
							placeholder="Write your explanation..."
							onChange={(e) => {
								setReason(e.target.value);
							}}
							className="w-full grow resize-none rounded-lg border border-line bg-gray-50 p-2 shadow placeholder:text-sm focus:outline-none"
						/>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						variant="primary"
						size="sm"
						fullWidth
						disabled={mutation.isLoading || reason.length === 0}
						onClick={() => {
							mutation.mutate(
								{
									jobId,
									reason,
								},
								{
									onSuccess: () => {
										setReviewChangeRequestPending(true);
									},
								}
							);
						}}
					>
						{mutation.isLoading ? <Spinner size={20} /> : "Submit Request"}
					</Button>
				</div>
			</div>
		</>
	);
};
