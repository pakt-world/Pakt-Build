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
import { useUserState } from "@/lib/store/account";
import { JobUpdateHeader } from "../_components/sheet-wrapper/header";
import { DeliverablesStepper } from "../../_shared/mark-deliverables";

interface JobUpdatesProps {
	job: CollectionProps;
	requestJobCancellation: () => void;
	reportAnIssue?: () => void;
}

export const ClientJobUpdates4Desktop: FC<JobUpdatesProps> = ({ job, requestJobCancellation, reportAnIssue }) => {
	const {
		name,
		tags,
		creator,
		owner,
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
	const { user } = useUserState();
	const { _id: userId } = user ?? { _id: "" };

	return (
		<>
			<div
				className="flex items-start justify-between border-b border-[#9BDCFD] bg-primary-gradient-light px-4 py-6 text-3xl font-bold
					text-white"
			>
				<div className="max-w-[90%] break-words">{name}</div>
			</div>
			<div className="flex h-full grow flex-col gap-6 px-4 py-6">
				<JobUpdateHeader
					createdAt={createdAt}
					profile={owner ?? creator}
					deliveryDate={deliveryDate ?? ""}
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
						<p className="text-body">Deliverables will check off as the talent completes them.</p>
					</div>

					<div className="h-full grow">
						<DeliverablesStepper
							jobProgress={progress}
							jobId={jobId}
							jobCreator={creator?._id}
							talentId={String(owner?._id)}
							readonly={creator?._id === userId || true}
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
