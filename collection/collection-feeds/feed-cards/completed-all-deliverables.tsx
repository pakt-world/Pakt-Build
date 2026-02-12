"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { titleCase } from "@/lib/utils";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { ClientJobSheet4Desktop } from "@/collection/actions/desktop/client";
import { TalentJobSheet4Desktop } from "@/collection/actions/desktop/talent";
import { Button } from "@/components/common/button";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";
import { FeedCardWrapper } from "../_components/wrapper";
import IssueReport from "@/components/dialogs/issue-resolution/report";

interface JobCompletedProps {
	title: string;
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
		title: string;
	};
	isCreator: boolean;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	dueDate?: string;
}
export const JobCompletionFeed = ({
	jobId,
	talent,
	creator,
	title,
	isCreator,
	createdAt,
	feedId,
	refetchFeeds,
	bookmark,
	dueDate,
}: JobCompletedProps): ReactElement => {
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
						src={isCreator ? talent?.avatar : creator?.avatar}
						score={isCreator ? talent?.score : creator?.score}
						size="lg"
						url={`/talents/${isCreator ? talent?._id : creator?._id}`}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-black">{talent?.name} completed all deliverables</h3>
						</div>
						<p className="text-[24px] font-normal text-title">{title}</p>
						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Button
									size="md"
									variant="secondaryOutline"
									onClick={() => {
										setIsModalOpen(true);
									}}
								>
									Review
								</Button>
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
							src={isCreator ? talent?.avatar : creator?.avatar}
							score={isCreator ? talent?.score : creator?.score}
							size="xs"
							url={`/talents/${isCreator ? talent?._id : creator?._id}`}
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
						<h3 className="w-[90%] items-center text-base font-bold text-black">
							{talent?.name} completed all deliverables
						</h3>
						<div className="mt-auto flex items-center justify-between">
							<p className="text-sm capitalize text-body">{title}</p>
						</div>
					</div>
					<div className="z-[1] w-full pr-5">
						<Button size="md" fullWidth variant="outlinePrimary" className="">
							Review
						</Button>
					</div>
				</div>
			)}
		</FeedCardWrapper>
	);
};
