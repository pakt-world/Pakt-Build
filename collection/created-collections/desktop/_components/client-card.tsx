"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { CoinProps, CollectionProps } from "@/lib/types/collection";
import { DesktopSheetWrapper } from "../../../actions/desktop/_components/sheet-wrapper";
import { Button } from "@/components/common/button";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { ClientJobSheet4Desktop } from "@/collection/actions/desktop/client";
import IssueReport from "@/components/dialogs/issue-resolution/report";

interface ClientJobCardProps {
	jobId: string;
	title: string;
	price: number;
	isCompleted?: boolean;
	isCancelled?: boolean;
	totalDeliverables: number;
	completedDeliverables: number;
	talent: {
		id: string;
		name: string;
		avatar?: string;
		paktScore: number;
		title: string;
	};
	reviewRequestChange?: CollectionProps;
	jobProgress?: number;
	meta: {
		coin: CoinProps;
		usdInitialValue: number;
	};
	realTimeRate: number;
	paymentRate: string;
}

export const DesktopClientJobCard: FC<ClientJobCardProps> = ({
	talent,
	price,
	title,
	jobId,
	isCancelled,
	totalDeliverables,
	completedDeliverables,
	isCompleted,
	reviewRequestChange,
	jobProgress,
	meta,
	realTimeRate,
	paymentRate,
}) => {
	const router = useRouter();
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isReportingIssue, setIsReportingIssue] = useState(false);

	const progress = Math.floor((completedDeliverables / totalDeliverables) * 100);

	const reportAnIssue = () => {
		setIsUpdateModalOpen(false);
		setIsReportingIssue(true);
	};

	return (
		<div
			className="flex w-full grow cursor-pointer flex-col gap-1 rounded-3xl border border-line bg-white p-4 transition duration-200
				hover:scale-[1.01] active:scale-[0.99]"
		>
			{/* <p>JobId: {jobId}</p> */}
			<div className="flex w-full gap-4">
				<TalentProfile
					score={talent?.paktScore}
					size="md"
					src={talent?.avatar}
					url={`/talents/${talent?.id}`}
				/>
				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<div className="flex flex-col items-start">
							<span className="text-sm font-bold text-title min-[1440px]:text-lg">{talent?.name}</span>
							<span className="font-md text-xs text-body min-[1440px]:text-sm">{talent?.name}</span>
						</div>
						<JobAmountBadge
							coin={meta?.coin}
							paymentFee={price}
							realTimeRate={realTimeRate}
							usdInitialValue={meta?.usdInitialValue}
							isFunded
							paymentRate={paymentRate}
						/>
					</div>
					<div className="flex grow items-center break-words text-lg leading-normal tracking-wide text-body min-[1440px]:text-[22px]">
						{title}
					</div>
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
						>
							{jobProgress === 100 ? (reviewRequestChange ? "View Request" : "Review") : "See Updates"}
						</Button>
					)}
					<Button
						size="md"
						variant="outlinePrimary"
						onClick={() => {
							router.push(`/messages?userId=${talent?.id}`);
						}}
					>
						Message Talent
					</Button>
				</div>

				<DeliverableProgressBar
					isCancelled={isCancelled}
					percentageProgress={progress}
					totalDeliverables={totalDeliverables}
					className="w-full max-w-none"
				/>

				<DesktopSheetWrapper
					isOpen={isUpdateModalOpen}
					onOpenChange={() => {
						setIsUpdateModalOpen(false);
					}}
					className="flex flex-col"
				>
					<ClientJobSheet4Desktop
						jobId={jobId}
						talentId={talent?.id}
						closeModal={() => {
							setIsUpdateModalOpen(false);
						}}
						reportAnIssue={reportAnIssue}
					/>
				</DesktopSheetWrapper>
				<IssueReport {...{ jobId, isOpen: isReportingIssue, setIsOpen: setIsReportingIssue }} />
			</div>
		</div>
	);
};
