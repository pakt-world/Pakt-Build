"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Slider } from "pakt-ui";
import { ChevronLeft, Star } from "lucide-react";
import Rating from "react-rating";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { useAcceptJobCancellation } from "@/lib/api/job";
import { DefaultAvatar } from "@/components/common/default-avatar";
import { CollectionProps } from "@/lib/types/collection";
import { TalentProps } from "@/lib/types/talents";
import { isJobDeliverable } from "@/lib/actions/collection";
import { Button } from "@/components/common/button";
import { CollectionStatus } from "@/lib/enums";
import { JOB_DIGIT } from "@/lib/utils";
import { AfroScore } from "@/components/common/talent-profile-image/old-talent-profile-image";

const MAX_REVIEW_LENGTH = 500;

interface AcceptJobCancellationProps {
	job: CollectionProps;
	talent?: TalentProps;
	setAcceptCancellation: (value: boolean) => void;
}

export const ClientAcceptJobCancellation4Desktop: FC<AcceptJobCancellationProps> = ({
	setAcceptCancellation,
	talent,
	job,
}) => {
	const cancelJobMutation = useAcceptJobCancellation();

	const totalDeliverables = job.collections.filter(isJobDeliverable).length;
	const completedDeliverables = job.collections
		.filter(isJobDeliverable)
		.filter((deliverable) => deliverable.progress === 100).length;

	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [percentageToPay, setPercentageToPay] = useState(
		Math.floor((completedDeliverables / totalDeliverables) * 100)
	);

	const usdExpectedAmount = parseFloat(job?.usdExpectedAmount ?? "0");
	const amountToPay = ((percentageToPay / 100) * usdExpectedAmount).toFixed(2);
	const amountToPayToken = parseFloat(((percentageToPay / 100) * job.paymentFee).toFixed(JOB_DIGIT));

	return (
		<>
			<div className="flex items-center justify-between bg-[#FF394A] px-4 py-6 text-3xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							setAcceptCancellation(false);
						}}
						type="button"
						aria-label="Back"
					>
						<ChevronLeft />
					</button>
					<span>Cancel Job</span>
				</div>
			</div>

			<div className="flex grow flex-col gap-6 px-4 py-6">
				<DeliverableProgressBar
					totalDeliverables={totalDeliverables}
					className="max-w-none text-base"
					percentageProgress={Math.floor((completedDeliverables / totalDeliverables) * 100)}
				/>

				<div className="flex flex-col gap-1">
					<p className="text-title">Proposed Job Price: ${job?.usdExpectedAmount}</p>

					<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-slate-50 p-3">
						<p className="flex items-center gap-2 text-body">
							<span>Amount to pay the Talent:</span>{" "}
							<span className="font-bold text-green-600">${amountToPay}</span>
							<span className="text-sm">({percentageToPay}%)</span>
						</p>
						<div className="my-2">
							<Slider
								value={[percentageToPay]}
								onValueChange={(value) => {
									setPercentageToPay(value[0] ?? 0);
								}}
								min={0}
								max={100}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<span className="text-title">How was your experience with {talent?.firstName}?</span>
					<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-input-bg p-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<AfroScore score={talent?.score ?? 0} size="sm">
									<div className="relative h-full w-full rounded-full">
										{talent?.profileImage?.url ? (
											<Image
												src={talent?.profileImage?.url}
												fill
												alt="profile"
												className="rounded-full"
											/>
										) : (
											<DefaultAvatar />
										)}
									</div>
								</AfroScore>

								<div className="flex flex-col gap-1">
									<span className="text-base font-medium leading-none text-title">{`${talent?.firstName}`}</span>
									<span className="line-clamp-1 text-sm capitalize leading-none">
										{talent?.profile?.bio?.title}
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
					</div>
				</div>

				<div>
					<h3>Comment</h3>
					<div>
						<textarea
							rows={5}
							value={comment}
							onChange={(e) => {
								if (e.target.value.length <= MAX_REVIEW_LENGTH) {
									setComment(e.target.value);
								}
							}}
							placeholder="Write your comment..."
							className="w-full grow resize-none rounded-lg border border-line bg-input-bg p-2 placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">{comment.length}</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">{MAX_REVIEW_LENGTH}</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						size="md"
						fullWidth
						variant="primary"
						disabled={cancelJobMutation.isLoading || comment.length === 0 || rating === 0}
						onClick={() => {
							cancelJobMutation.mutate({
								rating,
								jobId: job?._id,
								review: comment,
								amount: amountToPayToken,
								recipientId: talent?._id ?? "",
								status: CollectionStatus.CANCELLED,
							});
						}}
					>
						{cancelJobMutation.isLoading ? <Spinner size={20} /> : "Accept Cancellation"}
					</Button>
				</div>
			</div>
		</>
	);
};
