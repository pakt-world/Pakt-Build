"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CollectionProps } from "@/lib/types/collection";
import { isJobCancellation, isJobDeliverable } from "@/lib/actions/collection";
import { Button } from "@/components/common/button";
import { CollectionStatus } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";
import { ClientAcceptJobCancellation4Desktop } from "./proceed-to-accept";
import { JobUpdateHeader } from "@/collection/actions/desktop/_components/sheet-wrapper/header";
import { DeliverablesStepper } from "@/collection/actions/_shared/mark-deliverables";

interface JobCancellationRequestProps {
	job: CollectionProps;
	closeModal: () => void;
}

export const JobCancellationRequestFromTalent4Desktop: FC<JobCancellationRequestProps> = ({ job, closeModal }) => {
	const [acceptCancellation, setAcceptCancellation] = useState(false);

	const { data: rates } = useExchangeRateStore();
	const realTimeRate = rates ? (rates?.[job?.meta?.coin?.reference] as number) : 0;

	const {
		creator,
		createdAt,
		paymentFee,
		deliveryDate,
		name: jobTitle,
		_id: jobId,
		progress,
		owner,
		tags,
		collections,
		meta,
	} = job;

	const deliverables = collections.filter(isJobDeliverable);
	const jobCancellation = job.collections.find(isJobCancellation);

	if (!owner) return null;

	if (acceptCancellation) {
		return (
			<ClientAcceptJobCancellation4Desktop
				job={job}
				talent={owner}
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
					profile={owner}
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
						talentId={owner?._id}
						jobCreator={creator?._id}
						readonly
						showActionButton={false}
						deliverables={deliverables.map((j) => ({
							jobId,
							jobCreator: creator?._id,
							progress: j?.progress,
							updatedAt: j?.updatedAt,
							description: j?.name,
							deliverableId: j?._id,
						}))}
					/>
				</div>
				<div className="pb-6">
					<div className="mt-auto rounded-xl border border-red-300">
						<Button
							size="sm"
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
