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

import { TalentProfile } from "@/components/common/talent-profile-image";
import { titleCase } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { ClientJobSheet4Desktop } from "@/collection/actions/desktop/client";
import { TalentJobSheet4Desktop } from "@/collection/actions/desktop/talent";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";
import { FeedCardWrapper } from "../../_components/wrapper";
import IssueReport from "@/components/dialogs/issue-resolution/report";

interface ReviewResponseChangeProps {
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
	jobId: string;
	isCreator: boolean;
	isDeclined: boolean;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
}

export const ReviewResponseChangeCard = ({
	title,
	jobId,
	description,
	creator,
	talent,
	isCreator,
	isDeclined,
	createdAt,
	feedId,
	refetchFeeds,
	bookmark,
}: ReviewResponseChangeProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isReportingIssue, setIsReportingIssue] = useState(false);

	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	const reportAnIssue = () => {
		setIsModalOpen(false);
		setIsReportingIssue(true);
	};

	return (
		<FeedCardWrapper
			borderColor={isDeclined ? "#FF5247" : "#9BDCFD]"}
			bgColor={isDeclined ? "#FFF4F4" : "#F1FBFF"}
			iconColor="#F2F4F5"
			createdAt={createdAt}
			feedId={feedId}
			dismissible
			refetchFeeds={refetchFeeds}
			bookmark={bookmark}
		>
			{tab ? (
				<div className="flex size-full items-center gap-4">
					<TalentProfile
						src={isCreator ? talent?.avatar : creator?.avatar}
						score={isCreator ? talent?.score : creator?.score}
						size="lg"
						url={`/talents/${isCreator ? talent?._id : creator?._id}`}
					/>
					<div className="flex flex-col justify-center gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-title">{title}</h3>
						</div>

						<p className="text-body">{description}</p>

						<div className="flex items-end justify-between">
							<Button
								size="md"
								variant="outlinePrimary"
								onClick={() => {
									setIsModalOpen(true);
								}}
							>
								{isDeclined ? "Review" : "Update"}
							</Button>
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
							score={isCreator ? talent?.score : creator.score}
							size="xs"
							url={`/talents/${isCreator ? talent._id : creator._id}`}
						/>
						<div className="flex w-[200px] flex-col items-start justify-start">
							<p className="line-clamp-1 text-lg leading-[27px] tracking-wide text-gray-800">
								{talent.name}
							</p>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(talent.title)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<h3 className="text-base font-medium text-black">{title}</h3>
						<div className="mt-auto flex items-center justify-between">
							<p className="text-sm capitalize text-body">{description}</p>
						</div>
					</div>
					{/* <Button
					size="md"
					fullWidth
					variant="outlinePrimary"
					className=""
					onClick={() => {
						router.push(`/jobs/${jobId}/updates`);
					}}
				>
					{isDeclined ? "Review" : "Update"}
				</Button> */}
				</div>
			)}
		</FeedCardWrapper>
	);
};
