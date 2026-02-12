"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { titleCase, truncateText } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";
import { ClientJobSheet4Desktop } from "@/collection/actions/desktop/client";
import { TalentJobSheet4Desktop } from "@/collection/actions/desktop/talent";
import { FeedCardWrapper } from "../_components/wrapper";
import { CollectionStatus } from "@/lib/enums";
import IssueReport from "@/components/dialogs/issue-resolution/report";

interface ActiveCollectionProps {
	id: string;
	title: string;
	description: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	isCreator: boolean;
	progress: {
		total: number;
		progress: number;
	};
	jobProgress: number;
	tab?: boolean;
	jobStatus: CollectionStatus;
	clientHasReviewed: boolean;
	updatedAt: string;
}

export const ActiveCollection = ({
	id,
	talent,
	creator,
	title,
	description,
	progress,
	isCreator,
	jobProgress,
	tab,
	jobStatus,
	clientHasReviewed,
	updatedAt,
}: ActiveCollectionProps): JSX.Element => {
	const [seeMore, setSeeMore] = useState(false);
	const [isDesktopSheetOpen, setIsDesktopSheetOpen] = useState(false);
	const [isReportingIssue, setIsReportingIssue] = useState(false);

	const router = useRouter();

	const { user } = useUserState();
	const { _id: loggedInUser } = user ?? { _id: "" };

	const profileAccount = creator?._id === loggedInUser ? talent : creator;

	const reportAnIssue = () => {
		setIsDesktopSheetOpen(false);
		setIsReportingIssue(true);
	};

	return (
		<FeedCardWrapper
			borderColor="#9BDCFD"
			bgColor="#F1FBFF"
			iconColor="#F2F4F5"
			createdAt={updatedAt}
			feedId={id}
			refetchFeeds={() => {}}
			bookmark={{
				onBookmarksTab: false,
				isBookmarked: false,
				bookmarkId: "",
			}}
			bookmarkable={false}
		>
			{tab ? (
				<div className="flex size-full items-center gap-4">
					<TalentProfile
						src={profileAccount?.avatar}
						score={profileAccount?.score}
						size="lg"
						url={`/talents/${profileAccount?._id}`}
					/>
					<div className="flex w-full flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="line-clamp-2 text-xl font-bold text-title">{title}</h3>
						</div>

						<p className="line-clamp-2 text-lg text-body">{description}</p>
						<div className="mt-auto flex items-center justify-between">
							<div className="flex w-full items-center gap-4">
								<div className="flex items-center gap-2">
									<Button
										size="md"
										variant="secondaryOutline"
										onClick={() => {
											setIsDesktopSheetOpen(true);
										}}
									>
										{isCreator && jobProgress === 100
											? "Review"
											: isCreator && jobProgress < 100
												? "View Updates"
												: !isCreator &&
													  jobProgress === 100 &&
													  [
															CollectionStatus.WAITING,
															CollectionStatus.PAYMENT_REQUESTED,
													  ].includes(jobStatus) &&
													  !clientHasReviewed
													? "Awaiting Review"
													: !isCreator &&
														  jobProgress === 100 &&
														  [
																CollectionStatus.WAITING,
																CollectionStatus.PAYMENT_REQUESTED,
														  ].includes(jobStatus) &&
														  clientHasReviewed
														? "Review"
														: "Update"}
									</Button>
									<Button size="md" variant="outlinePrimary" asChild>
										<Link href={`/messages?userId=${isCreator ? talent?._id : creator?._id}`}>
											Message
										</Link>
									</Button>
								</div>
								<DeliverableProgressBar
									percentageProgress={progress?.progress}
									totalDeliverables={progress?.total}
									className="w-full max-w-[300px]"
								/>
							</div>
						</div>
					</div>
					<DesktopSheetWrapper
						isOpen={isDesktopSheetOpen}
						onOpenChange={setIsDesktopSheetOpen}
						className="flex flex-col"
					>
						{isCreator ? (
							<ClientJobSheet4Desktop
								jobId={id}
								talentId={talent?._id}
								closeModal={() => {
									setIsDesktopSheetOpen(false);
								}}
								reportAnIssue={reportAnIssue}
							/>
						) : (
							<TalentJobSheet4Desktop
								jobId={id}
								talentId={creator?._id}
								closeModal={() => {
									setIsDesktopSheetOpen(false);
								}}
								reportAnIssue={reportAnIssue}
							/>
						)}
					</DesktopSheetWrapper>

					<IssueReport {...{ jobId: id, isOpen: isReportingIssue, setIsOpen: setIsReportingIssue }} />
				</div>
			) : (
				<div
					role="button"
					tabIndex={0}
					onClick={() => {
						router.push(`/jobs/${id}/updates`);
					}}
					className="relative flex w-full flex-col items-start gap-4"
				>
					<div className="flex items-center gap-2">
						<TalentProfile
							src={profileAccount?.avatar}
							score={profileAccount?.score}
							size="xs"
							url={`/talents/${profileAccount?._id}`}
						/>
						<div className="flex w-[200px] flex-col items-start justify-start">
							<p className="line-clamp-1 text-lg leading-[27px] tracking-wide text-gray-800">
								{profileAccount?.name}
							</p>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(profileAccount?.title)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<h3 className="text-base font-bold text-black">{title}</h3>
						<div className="relative w-[95%]">
							<p className={`inline text-sm capitalize text-body ${!seeMore ? "line-clamp-2" : ""}`}>
								{truncateText(description as string, 120, seeMore)}
								&nbsp;
								{(description as string).length > 120 && (
									<button
										type="button"
										className="inline cursor-pointer text-white text-opacity-50 hover:text-opacity-100"
										onClick={(e) => {
											e.stopPropagation();
											setSeeMore(!seeMore);
										}}
									>
										{seeMore ? "less" : "more"}
									</button>
								)}
							</p>
						</div>
						<div className="flex">
							<DeliverableProgressBar
								percentageProgress={progress?.progress}
								totalDeliverables={progress?.total}
								className="w-full max-w-[300px]"
							/>
						</div>
					</div>
				</div>
			)}
		</FeedCardWrapper>
	);
};
