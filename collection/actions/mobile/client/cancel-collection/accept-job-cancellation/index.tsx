"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ClientAcceptJobCancellation4Mobile } from "./proceed-to-accept";
import { CollectionProps } from "@/lib/types/collection";
import { isJobCancellation, isJobDeliverable } from "@/lib/actions/collection";
import { CollectionStatus } from "@/lib/enums";
import { Button } from "@/components/common/button";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { useExchangeRateStore } from "@/lib/store/misc";
import { JobUpdateHeader4Mobile } from "@/collection/actions/mobile/_components/header";
import { DeliverablesStepper } from "@/collection/actions/_shared/mark-deliverables";

interface JobCancellationRequestProps {
	job: CollectionProps;
	// eslint-disable-next-line react/no-unused-prop-types
	closeMobileSheet: () => void;
}

export const JobCancellationRequest: FC<JobCancellationRequestProps> = ({ job }) => {
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
	} = job;

	const deliverables = collections.filter(isJobDeliverable);
	const jobCancellation = job.collections.find(isJobCancellation);

	if (!owner) return null;

	if (acceptCancellation) {
		return (
			<ClientAcceptJobCancellation4Mobile
				job={job}
				talent={owner}
				setAcceptCancellation={setAcceptCancellation}
			/>
		);
	}

	return (
		<div className="size-full overflow-y-auto">
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/dashboard",
					},
					{ label: "Cancel Job", active: true },
				]}
				className="!fixed top-[70px] !z-50"
			/>
			<div className="mt-[43px] size-full overflow-y-auto">
				<div className="flex items-center justify-between bg-primary-gradient-light px-4 py-6 text-lg font-bold text-white">
					<div className="flex items-center gap-2">
						<span>{jobTitle}</span>
					</div>
				</div>
				<div className="flex h-auto flex-col pb-6">
					<JobUpdateHeader4Mobile
						status={CollectionStatus.CANCEL_REQUESTED}
						createdAt={createdAt}
						profile={owner}
						deliveryDate={deliveryDate ?? ""}
						paymentFee={paymentFee}
						tags={tags}
						meta={job?.meta}
						realTimeRate={realTimeRate}
						isFunded={job?.escrowPaid ?? false}
						paymentRate={job?.rate}
					/>

					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-2 bg-[#FEF4E3] p-3">
							<h3 className="text-lg font-bold">Explanation</h3>
							<h3 className="font-bold">{jobCancellation?.name}</h3>
							<p>{jobCancellation?.description}</p>
						</div>
					</div>

					<div className="flex flex-col gap-2 p-4">
						<h3 className="text-lg font-bold">Deliverables</h3>
						<DeliverablesStepper
							jobId={jobId}
							jobProgress={progress}
							talentId={owner?._id}
							jobCreator={creator?._id}
							readonly
							showActionButton={false}
							deliverables={deliverables.map((j: CollectionProps) => ({
								jobId,
								jobCreator: creator?._id,
								progress,
								updatedAt: j?.updatedAt,
								description: j?.name,
								deliverableId: j?._id,
							}))}
						/>
					</div>
					<div className="px-4 pb-6">
						<div className="mb-6 mt-auto rounded-xl border border-red-300">
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
			</div>
		</div>
	);
};
