"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentAcceptJobCancellationRequest4Desktop } from "./proceed-to-accept";
import { CollectionProps } from "@/lib/types/collection";
import { isJobCancellation, isJobDeliverable } from "@/lib/actions/collection";
import { CollectionStatus } from "@/lib/enums";
import { Button } from "@/components/common/button";
import { useExchangeRateStore } from "@/lib/store/misc";
import { JobUpdateHeader } from "@/collection/actions/desktop/_components/sheet-wrapper/header";
import { DeliverablesStepper } from "@/collection/actions/_shared/mark-deliverables";

interface ReviewJobCancellationRequestProps {
	job: CollectionProps;
	closeModal: () => void;
}

export const JobCancellationRequestFromClient4Desktop: FC<ReviewJobCancellationRequestProps> = ({
	job,
	closeModal,
}) => {
	const [acceptCancellation, setAcceptCancellation] = useState(false);

	const { data: rates } = useExchangeRateStore();

	const {
		creator,
		owner,
		createdAt,
		paymentFee,
		deliveryDate,
		name: jobTitle,
		_id: jobId,
		progress,
		tags,
		collections,
		meta,
	} = job;

	const deliverables = collections.filter(isJobDeliverable);
	const jobCancellation = job.collections.find(isJobCancellation);

	const realTimeRate = rates ? (rates?.[job?.meta?.coin?.reference] as number) : 0;

	if (acceptCancellation) {
		return (
			<TalentAcceptJobCancellationRequest4Desktop
				job={job}
				client={creator}
				setAcceptCancellation={setAcceptCancellation}
			/>
		);
	}

	return (
		<>
			<div
				className="flex items-center justify-between border-b-2 border-[#9BDCFD] bg-primary-gradient-light px-4 py-6 text-3xl font-bold
					text-white"
			>
				<div className="flex items-center gap-2">
					<button onClick={closeModal} aria-label="Back" type="button">
						<ChevronLeft />
					</button>
					<span>{jobTitle}</span>
				</div>
			</div>
			<div className="flex grow flex-col gap-6 px-4 py-6">
				<JobUpdateHeader
					status={CollectionStatus.CANCEL_REQUESTED}
					createdAt={createdAt}
					profile={creator}
					deliveryDate={deliveryDate ?? ""}
					paymentFee={paymentFee}
					tags={tags}
					meta={meta}
					realTimeRate={realTimeRate}
					isFunded={job?.escrowPaid ?? false}
					paymentRate={job?.rate}
				/>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold">Explanation</h3>
					<div className="flex flex-col gap-2 rounded-xl border border-yellow bg-[#FEF4E3] p-3">
						<h3 className="font-bold">{jobCancellation?.name}</h3>
						<p>{jobCancellation?.description}</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold">Deliverables</h3>

					<DeliverablesStepper
						jobId={jobId}
						jobProgress={progress}
						jobCreator={creator._id}
						talentId={String(owner?._id)}
						readonly
						showActionButton={false}
						deliverables={deliverables.map(({ _id, name, progress, updatedAt }) => ({
							progress,
							updatedAt,
							jobId,
							description: name,
							deliverableId: _id,
							jobCreator: creator?._id,
						}))}
					/>
				</div>
				<div className="pb-6">
					<div className="mt-auto rounded-xl border border-red-300">
						<Button
							size="md"
							fullWidth
							onClick={() => {
								setAcceptCancellation(true);
							}}
							variant="destructive"
						>
							<span className="normal-case">Cancel Job and Review</span>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
