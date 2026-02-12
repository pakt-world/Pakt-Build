"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useMarkJobAsComplete, useUpdateJobProgress } from "@/lib/api/job";
import { DeliverableStep } from "./step";
import { MetaProps } from "@/lib/types/collection";
import { Button } from "@/components/common/button";
import { CollectionStatus } from "@/lib/enums";

interface DeliverableProps {
	jobId: string;
	jobCreator: string;
	progress: number; // 0 or 100
	updatedAt: Date;
	description: string;
	deliverableId: string;
	meta?: MetaProps | undefined;
}

interface DeliverablesStepperProps {
	jobId: string;
	talentId: string;
	readonly?: boolean;
	jobCreator: string;
	jobProgress: number;
	showActionButton?: boolean;
	deliverables: DeliverableProps[];
}

export const DeliverablesStepper = ({
	jobId,
	jobCreator,
	talentId,
	jobProgress,
	deliverables,
	readonly: isClient,
	showActionButton = true,
}: DeliverablesStepperProps): ReactElement => {
	const [disableCheckboxes, setDisableCheckboxes] = useState(false);

	const updateJobProgress = useUpdateJobProgress({ creatorId: jobCreator });
	const markJobAsComplete = useMarkJobAsComplete();

	const totalDeliverables = deliverables.length;
	const completedDeliverables = deliverables.filter((deliverable) => deliverable.progress === 100).length;

	return (
		<div className="flex h-full w-full grow flex-col pb-6">
			{deliverables
				.sort((a, b) => b.progress - a.progress)
				.map(({ deliverableId, description, jobId: jId, progress, meta }, index) => {
					return (
						<DeliverableStep
							jobId={jId}
							jobCreator={jobCreator}
							isClient={isClient}
							progress={progress}
							key={deliverableId}
							updatedAt={meta?.completedAt as string}
							description={description}
							deliverableId={deliverableId}
							totalDeliverables={totalDeliverables}
							isLast={index === totalDeliverables - 1}
							completedDeliverables={completedDeliverables}
							disableCheckboxes={disableCheckboxes}
							setDisableCheckboxes={setDisableCheckboxes}
						/>
					);
				})}

			<div className="mt-auto">
				{showActionButton && isClient && jobProgress === 100 && (
					<Button
						className="mt-6"
						size="md"
						fullWidth
						variant="primary"
						onClick={() => {
							markJobAsComplete.mutate(
								{
									jobId,
									talentId,
									status: CollectionStatus.PAYMENT_REQUESTED,
								},
								{
									onError: () => {
										markJobAsComplete.reset();
									},
								}
							);
						}}
					>
						{markJobAsComplete.isLoading ? <Spinner size={20} /> : "Finalize Job and Review"}
					</Button>
				)}

				{showActionButton && !isClient && jobProgress === 100 && (
					<div className="mt-6 rounded-[10px] bg-brand_gradient p-[1.5px]">
						<div className="rounded-lg bg-green-50 px-2 py-3 max-sm:text-sm">
							Waiting for Client to approve job as complete.
						</div>
					</div>
				)}

				{showActionButton &&
					!isClient &&
					jobProgress !== 100 &&
					completedDeliverables === totalDeliverables && (
						<Button
							className="mt-6"
							size="md"
							fullWidth
							variant="primary"
							onClick={() => {
								updateJobProgress.mutate(
									{
										jobId,
										progress: 100,
									},
									{
										onError: () => {
											updateJobProgress.reset();
										},
									}
								);
							}}
						>
							{updateJobProgress.isLoading ? <Spinner size={20} /> : "Complete Job"}
						</Button>
					)}
			</div>
		</div>
	);
};
