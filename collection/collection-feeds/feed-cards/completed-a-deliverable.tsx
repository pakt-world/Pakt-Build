"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { titleCase } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { ClientJobSheet4Desktop } from "@/collection/actions/desktop/client";
import { TalentJobSheet4Desktop } from "@/collection/actions/desktop/talent";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";
import { CheckBox } from "@/components/common/checkbox";
import { FeedCardWrapper } from "../_components/wrapper";
import IssueReport from "@/components/dialogs/issue-resolution/report";

interface TalentJobUpdateProps {
	feedId: string;
	title: string;
	description: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	jobId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	isCreator: boolean;
	progress: {
		total: number;
		progress: number;
	};
	jobTitle?: string;
	isMarked: boolean;
	createdAt: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	dueDate?: string;
}

const MAX_LEN = 150;

export const JobUpdateFeed = ({
	feedId,
	refetchFeeds,
	bookmark,
	jobId,
	talent,
	creator,
	title,
	description,
	progress,
	isCreator,
	jobTitle,
	isMarked,
	createdAt,
	dueDate,
}: TalentJobUpdateProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isReportingIssue, setIsReportingIssue] = useState(false);

	const router = useRouter();
	const tab = useMediaQuery("(min-width: 640px)");

	const reportAnIssue = () => {
		setIsModalOpen(false);
		setIsReportingIssue(true);
	};

	return (
		<FeedCardWrapper
			borderColor="#9BDCFD"
			bgColor="#F1FBFF"
			iconColor="#F2F4F5"
			createdAt={createdAt}
			feedId={feedId}
			dismissible
			refetchFeeds={refetchFeeds}
			bookmark={bookmark}
			dueDate={dueDate}
		>
			{tab ? (
				<div className="flex size-full items-center gap-4">
					<TalentProfile
						src={talent?.avatar}
						score={talent?.score}
						size="lg"
						url={`/talents/${talent?._id}`}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="w-fit items-center text-xl text-title">
								{!isCreator
									? title
									: `${talent?.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `}{" "}
								<span className="font-bold">{jobTitle}</span>
							</h3>
						</div>
						<p className="flex flex-row gap-4 capitalize text-body">
							{" "}
							<CheckBox isChecked={isMarked} />{" "}
							{description.length > MAX_LEN ? `${description.slice(0, MAX_LEN)}...` : description}
						</p>
						<div className="mt-auto flex items-center justify-between">
							<div className="flex w-full items-end gap-4">
								<div className="flex items-center gap-2">
									<Button
										size="md"
										variant="secondaryOutline"
										onClick={() => {
											setIsModalOpen(true);
										}}
									>
										See Update
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

					<DesktopSheetWrapper isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
						{isCreator ? (
							<ClientJobSheet4Desktop
								jobId={jobId}
								talentId={talent?._id}
								closeModal={() => {
									setIsModalOpen(false);
								}}
								reportAnIssue={reportAnIssue}
							/>
						) : (
							<TalentJobSheet4Desktop
								jobId={jobId}
								talentId={talent?._id}
								closeModal={() => {
									setIsModalOpen(false);
								}}
								reportAnIssue={reportAnIssue}
							/>
						)}
					</DesktopSheetWrapper>
					<IssueReport {...{ jobId, isOpen: isReportingIssue, setIsOpen: setIsReportingIssue }} />
				</div>
			) : (
				<div
					onClick={() => {
						router.push(`/jobs/${jobId}/updates`);
					}}
					className="relative flex w-full flex-col items-start gap-4"
				>
					<div className="flex items-center gap-2">
						<TalentProfile
							score={talent?.score}
							src={talent?.avatar}
							size="xs"
							url={`/talents/${talent?._id}`}
						/>
						<div className="flex w-[200px] flex-col items-start justify-start">
							<p className="line-clamp-1 text-lg leading-[27px] tracking-wide text-gray-800">
								{talent?.name}
							</p>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(talent?.title)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<h3 className="w-[90%] items-center text-base text-black">
							{!isCreator
								? title
								: `${talent?.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `}{" "}
							<span className="font-bold">{jobTitle}</span>
						</h3>
						<p className="flex flex-row gap-4 text-sm capitalize text-body">
							{description.length > MAX_LEN ? `${description.slice(0, MAX_LEN)}...` : `✅ ${description}`}
						</p>
						<div className="mt-auto flex items-center justify-between">
							<div className="flex w-[80%]">
								<DeliverableProgressBar
									percentageProgress={progress?.progress}
									totalDeliverables={progress?.total}
									className="w-full max-w-[300px]"
								/>
							</div>
						</div>
					</div>
					{/* <Button
				size="md"
				fullWidth
				variant="outlinePrimary"
				onClick={() => {
					router.push(`/jobs/${jobId}/updates`);
				}}
			>
				See Update
			</Button> */}
				</div>
			)}
		</FeedCardWrapper>
	);
};
