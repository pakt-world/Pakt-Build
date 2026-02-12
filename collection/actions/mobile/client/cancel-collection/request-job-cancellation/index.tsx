"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Checkbox } from "pakt-ui";
import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useMarkJobAsComplete, useReleaseJobPayment, useRequestJobCancellation } from "@/lib/api/job";
import { ClientJobCancellationSuccessfullyRequested4Mobile } from "./request-success";
import { Button } from "@/components/common/button";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";

const JOB_CANCEL_REASONS = ["Talent is not responsive", "Unforeseeable Circumstances"];

interface RequestJobCancellationProps {
	jobId: string;
	closeMobileSheet: () => void;
	cancelJobCancellationRequest: () => void;
	talentId: string;
}

export const ClientRequestJobCancellation4Mobile: FC<RequestJobCancellationProps> = ({
	jobId,
	cancelJobCancellationRequest,
	closeMobileSheet,
	talentId,
}) => {
	const requestJobCancellationMutation = useRequestJobCancellation({
		talentId,
	});
	const markJobAsComplete = useMarkJobAsComplete();
	const releasePaymentMutation = useReleaseJobPayment();

	const [isSuccess, setIsSuccess] = useState(false);
	const [reason, setReason] = useState("");
	const [reasonNotInOptions, setReasonNotInOptions] = useState(false);
	const [explanation, setExplanation] = useState("");

	if (isSuccess) {
		return <ClientJobCancellationSuccessfullyRequested4Mobile closeMobileSheet={closeMobileSheet} />;
	}

	return (
		<div className="size-full overflow-y-auto">
			<div
				className="sticky top-0 z-10 flex items-center justify-between border-y border-green-lighter bg-white px-4 py-6 text-lg font-bold
					text-title"
			>
				<div className="flex items-center gap-2">
					<button onClick={cancelJobCancellationRequest} type="button" aria-label="Back">
						<ChevronLeft />
					</button>
					<span>Cancel Job</span>
				</div>
			</div>

			<div className="flex h-auto grow flex-col gap-6 py-6">
				<div className="bg-[#FEF4E3] p-4">
					The talent will need to accept for the cancellation to be effective.
				</div>

				<div className="flex flex-col gap-2 px-4">
					<h2>
						Reason for cancellation <span className="text-red-500">*</span>
					</h2>
					<div className="flex flex-col gap-3">
						{JOB_CANCEL_REASONS.map((option) => (
							<label key={option} className="flex items-center gap-2">
								<Checkbox
									checked={reason === option}
									onCheckedChange={() => {
										setReason(option);
										setReasonNotInOptions(false);
									}}
								/>
								<span className="text-[#575767]">{option}</span>
							</label>
						))}

						<label className="flex items-center gap-2">
							<Checkbox
								checked={reasonNotInOptions}
								onCheckedChange={() => {
									if (!reasonNotInOptions) {
										setReason("");
									}
									setReasonNotInOptions(true);
								}}
							/>
							<span className="text-[#575767]">Other</span>
						</label>

						{reasonNotInOptions && (
							<textarea
								rows={2}
								value={reason}
								placeholder="Write your reason..."
								onChange={(e) => {
									setReason(e.target.value);
								}}
								className="w-full grow resize-none rounded-lg border border-line bg-gray-50 p-2 shadow placeholder:text-sm focus:outline-none"
							/>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-6">
					<div className="border border-yellow-dark bg-[#FEF4E3] p-4">
						Payment for any deliverable is at the sole discretion of the talent. Talent will review client
						but Client cannot review talent.
					</div>

					<div className="flex flex-col gap-1 px-4">
						<h3>Explanation</h3>
						<div>
							<textarea
								rows={5}
								value={explanation}
								placeholder="Write your explanation..."
								onChange={(e) => {
									setExplanation(e.target.value);
								}}
								className="w-full grow resize-none rounded-lg border border-line bg-gray-50 p-2 shadow placeholder:text-sm focus:outline-none"
							/>
						</div>
					</div>
				</div>

				<div className="mt-auto px-4">
					<Button
						size="md"
						fullWidth
						disabled={
							requestJobCancellationMutation.isLoading ||
							markJobAsComplete.isLoading ||
							releasePaymentMutation.isLoading ||
							reason.length === 0 ||
							explanation.length === 0
						}
						variant="primary"
						onClick={() => {
							requestJobCancellationMutation.mutate(
								{
									type: CollectionTypes.CANCEL_REQUEST,
									jobId,
									reason,
									explanation,
								},
								{
									onSuccess: () => {
										markJobAsComplete.mutate(
											{
												jobId,
												talentId,
												status: CollectionStatus.CANCEL_REQUESTED,
											},
											{
												onError: () => {
													markJobAsComplete.reset();
												},
												onSuccess: () => {
													releasePaymentMutation.mutate({
														jobId,
														owner: talentId ?? "",
													});
													setIsSuccess(true);
												},
											}
										);
									},
								}
							);
						}}
					>
						{requestJobCancellationMutation.isLoading ||
						markJobAsComplete.isLoading ||
						releasePaymentMutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Request Cancellation"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};
