"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { CollectionProps } from "@/lib/types/collection";
import { isJobDeliverable } from "@/lib/actions/collection";
import { useExchangeRateStore } from "@/lib/store/misc";
import { JobUpdateHeader4Mobile } from "../_components/header";
import { DeliverablesStepper } from "../../_shared/mark-deliverables";

interface JobUpdatesProps {
	job: CollectionProps;
	requestJobCancellation: () => void;
}

export const TalentJobUpdates4Mobile: FC<JobUpdatesProps> = ({ job, requestJobCancellation }) => {
	const [showDescription, setShowDescription] = useState(false);
	const { data: rates } = useExchangeRateStore();

	if (!job) return null;
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
	const realTimeRate = rates ? (rates?.[job?.meta?.coin?.reference] as number) : 0;

	return (
		<div className="size-full flex-1 overflow-y-auto">
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/dashboard",
					},
					{ label: "Job Updates", active: true },
				]}
				className="!fixed top-[70px] !z-50"
			/>
			<div className="flex flex-1 flex-col overflow-y-auto">
				<div className="mt-[43px] flex items-start justify-between bg-primary-gradient-light px-4 py-6 text-3xl font-bold text-white">
					<div className="max-w-[90%] break-words text-lg">{name}</div>
				</div>
				<JobUpdateHeader4Mobile
					createdAt={createdAt}
					profile={creator}
					deliveryDate={deliveryDate ?? ""}
					paymentFee={paymentFee}
					tags={tags}
					meta={job?.meta}
					realTimeRate={realTimeRate}
					isFunded={job?.escrowPaid ?? false}
					requestJobCancellation={requestJobCancellation}
					paymentRate={job?.rate}
				/>

				<div
					className={`relative flex w-full flex-col gap-2.5 overflow-hidden border-b bg-blue-100 p-4 transition-all
						${showDescription ? "max-h-[1000px]" : "max-h-[56px]"}`}
				>
					<button
						className="flex w-full items-center justify-between"
						type="button"
						onClick={() => {
							setShowDescription(!showDescription);
						}}
					>
						<h3 className="text-lg font-bold">Job Description</h3>
						<ChevronDown
							className={`h-6 w-6 transform ${showDescription ? "rotate-[360deg]" : "rotate-[270deg]"}`}
						/>
					</button>
					<p
						className={`line-clamp-7 text-base leading-normal tracking-wide transition-all ${showDescription ? "max-h-[1000px]" : "max-h-0"}`}
					>
						{description}
					</p>
				</div>
				<div className="flex grow flex-col gap-2 p-4">
					<div className="flex flex-col items-start">
						<h3 className="text-lg font-bold">Job Deliverables</h3>
						<p className="text-body">Mark the deliverables upon completion</p>
					</div>

					<DeliverablesStepper
						jobId={jobId}
						jobProgress={progress}
						talentId={String(owner?._id)}
						jobCreator={creator?._id}
						deliverables={deliverables.map((j: CollectionProps) => ({
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
	);
};
