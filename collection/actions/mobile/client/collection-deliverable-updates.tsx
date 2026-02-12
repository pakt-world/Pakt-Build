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
import { useUserState } from "@/lib/store/account";
import { useExchangeRateStore } from "@/lib/store/misc";
import { JobUpdateHeader4Mobile } from "../_components/header";
import { DeliverablesStepper } from "../../_shared/mark-deliverables";

interface JobUpdatesProps {
	job: CollectionProps;
	requestJobCancellation: () => void;
}

export const ClientJobUpdates4Mobile: FC<JobUpdatesProps> = ({ job, requestJobCancellation }) => {
	const [showDescription, setShowDescription] = useState(false);
	const { user } = useUserState();
	const { _id: userId } = user ?? { _id: "" };

	const { data: rates } = useExchangeRateStore();

	if (!job) return null;

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
	const realTimeRate = rates ? (rates?.[job?.meta?.coin?.reference] as number) : 0;

	return (
		<div className="size-full overflow-y-auto">
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/dashboard?tab=active",
					},
					{ label: "Job Updates", active: true },
				]}
				className="!fixed top-[70px]"
			/>
			<div
				className="mt-[43px] flex items-start justify-between border-b-2 border-blue-lighter bg-primary-gradient-light px-4 py-6 text-3xl
					font-bold text-white"
			>
				<h3 className="max-w-[90%] break-words text-lg">{name}</h3>
			</div>
			<div className="flex h-auto flex-col pb-[75px]">
				<JobUpdateHeader4Mobile
					createdAt={createdAt}
					profile={owner ?? creator}
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
				<div className="flex flex-col gap-2 p-4">
					<div className="flex flex-col items-start">
						<h3 className="text-lg font-bold">Job Deliverables</h3>
						<p className="text-body">Deliverables will check off as the talent completes them.</p>
					</div>

					<div className="h-auto">
						<DeliverablesStepper
							jobProgress={progress}
							jobId={jobId}
							jobCreator={creator?._id}
							talentId={String(owner?._id)}
							readonly={creator?._id === userId || true}
							deliverables={deliverables.map((j: CollectionProps) => ({
								jobId: job?._id,
								jobCreator: job?.creator._id,
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
		</div>
	);
};
