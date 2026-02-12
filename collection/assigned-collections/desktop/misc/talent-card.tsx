"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { CollectionStatus } from "@/lib/enums";
import { CollectionProps } from "@/lib/types/collection";
import { Button } from "@/components/common/button";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";
import { TalentJobSheet4Desktop } from "@/collection/actions/desktop/talent";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import IssueReport from "@/components/dialogs/issue-resolution/report";

interface TalentJobCardProps {
	jobId: string;
	title: string;
	price: number;
	isCancelled?: CollectionStatus | boolean;
	isCompleted?: boolean;
	totalDeliverables: number;
	completedDeliverables: number;
	job: CollectionProps;
	realTimeRate: number;
}

export const TalentJobCard = ({
	price,
	title,
	jobId,
	isCompleted,
	totalDeliverables,
	completedDeliverables,
	isCancelled,
	job,
	realTimeRate,
}: TalentJobCardProps): JSX.Element => {
	const router = useRouter();
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isReportingIssue, setIsReportingIssue] = useState(false);

	const progress = Math.floor((completedDeliverables / totalDeliverables) * 100);

	const client = {
		id: job?.creator?._id ?? "",
		avatar: job?.creator?.profileImage?.url,
		name: `${job?.creator?.firstName ?? "Deleted User"}`,
		paktScore: job?.creator?.score ?? 0,
	};
	const clientHasReviewed = job.ratings?.some((review) => review?.owner?._id === job?.creator?._id);

	const reportAnIssue = () => {
		setIsUpdateModalOpen(false);
		setIsReportingIssue(true);
	};

	return (
		<div
			className={`flex w-full grow cursor-pointer flex-col gap-1 rounded-3xl border p-4 transition duration-200 hover:scale-[1.01]
				active:scale-[0.99] ${isCancelled ? "border-[#FF5247] bg-[#FFF4F4]" : "border-line bg-white"}`}
		>
			<div className="flex w-full gap-4">
				<TalentProfile score={client?.paktScore} size="md" src={client?.avatar} />
				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm font-bold text-body min-[1440px]:text-lg">{client?.name}</span>
						<JobAmountBadge
							coin={job?.meta?.coin}
							paymentFee={price}
							realTimeRate={realTimeRate}
							isFunded={job?.escrowPaid ?? false}
							usdInitialValue={job?.meta?.usdInitialValue}
							paymentRate={job?.rate}
						/>
					</div>
					<div className="flex grow items-center break-words text-2xl font-bold text-title">{title}</div>
				</div>
			</div>
			<div className="mt-auto flex w-full items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					{!isCompleted && (
						<Button
							size="md"
							variant="secondaryOutline"
							onClick={() => {
								setIsUpdateModalOpen(true);
							}}
							disabled={isCancelled as boolean}
							className={isCancelled ? "hidden" : "flex"}
						>
							{isCancelled
								? "Cancelled"
								: progress < 100
									? "Update"
									: progress === 100 &&
										  job.progress === 100 &&
										  [CollectionStatus.WAITING, CollectionStatus.PAYMENT_REQUESTED].includes(
												job.status
										  ) &&
										  !clientHasReviewed
										? "Awaiting Review"
										: progress === 100 &&
											  job.progress === 100 &&
											  [CollectionStatus.WAITING, CollectionStatus.PAYMENT_REQUESTED].includes(
													job.status
											  ) &&
											  clientHasReviewed
											? "Review"
											: "Update"}
						</Button>
					)}

					<Button
						size="md"
						variant="outlinePrimary"
						onClick={() => {
							router.push(`/messages?userId=${client.id}`);
						}}
					>
						Message Client
					</Button>
				</div>

				<DeliverableProgressBar
					totalDeliverables={totalDeliverables}
					percentageProgress={progress}
					className="w-full max-w-none"
				/>

				<DesktopSheetWrapper
					isOpen={isUpdateModalOpen}
					onOpenChange={() => {
						setIsUpdateModalOpen(false);
					}}
					className="flex flex-col"
				>
					<TalentJobSheet4Desktop
						talentId={client.id}
						jobId={jobId}
						reportAnIssue={reportAnIssue}
						closeModal={() => {
							setIsUpdateModalOpen(false);
						}}
					/>
				</DesktopSheetWrapper>
				<IssueReport {...{ jobId, isOpen: isReportingIssue, setIsOpen: setIsReportingIssue }} />
			</div>
		</div>
	);
};
