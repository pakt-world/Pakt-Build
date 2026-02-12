"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CollectionProps } from "@/lib/types/collection";
import { isJobDeliverable } from "@/lib/actions/collection";
import { useExchangeRateStore } from "@/lib/store/misc";
import { JobUpdateHeader } from "../_components/sheet-wrapper/header";
import { DeliverablesStepper } from "../../_shared/mark-deliverables";

interface JobUpdatesProps {
	job: CollectionProps;
	requestJobCancellation: () => void;
	reportAnIssue: () => void;
}

export const TalentJobUpdates4Desktop: FC<JobUpdatesProps> = ({ job, requestJobCancellation, reportAnIssue }) => {
	const {
		name,
		owner,
		creator,
		tags,
		description,
		createdAt,
		deliveryDate,
		paymentFee,
		collections,
		progress,
		_id: jobId,
	} = job;
	const deliverables = collections.filter(isJobDeliverable);

	const { data: rates } = useExchangeRateStore();
	const realTimeRate = rates ? (rates?.[job?.meta?.coin?.reference] as number) : 0;

	return (
		<>
			<div
				className="flex items-start justify-between border-b-2 border-[#9BDCFD] bg-primary-gradient-light px-4 py-6 text-3xl font-bold
					text-white"
			>
				<div className="max-w-[90%] break-words">{name}</div>
			</div>
			<div className="flex grow flex-col gap-6 px-4 py-6">
				<JobUpdateHeader
					createdAt={createdAt}
					profile={creator}
					deliveryDate={deliveryDate ?? "N/A"}
					paymentFee={paymentFee}
					tags={tags}
					meta={job?.meta}
					realTimeRate={realTimeRate}
					isFunded={job?.escrowPaid ?? false}
					requestJobCancellation={requestJobCancellation}
					reportAnIssue={reportAnIssue}
					paymentRate={job?.rate}
				/>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold">Job Description</h3>
					<div className="min-h-[100px] w-full rounded-xl border border-blue-lighter p-3">
						<p className="text-base text-title">{description}</p>
					</div>
				</div>
				<div className="flex grow flex-col gap-2">
					<div>
						<h3 className="text-lg font-bold">Job Deliverables</h3>
						<p className="text-body">Mark the deliverables upon completion</p>
					</div>

					<div className="h-full grow">
						<DeliverablesStepper
							jobId={jobId}
							jobProgress={progress}
							talentId={String(owner?._id)}
							jobCreator={creator?._id}
							deliverables={deliverables.map((j) => ({
								jobId: job?._id,
								jobCreator: job?.creator?._id,
								progress: j?.progress,
								updatedAt: j?.updatedAt,
								meta: j?.meta,
								description: j?.name,
								deliverableId: j?._id,
							}))}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
