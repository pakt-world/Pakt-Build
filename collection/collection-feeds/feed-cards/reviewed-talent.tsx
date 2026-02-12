"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { Star } from "lucide-react";
import Rating from "react-rating";
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
import { FeedCardWrapper } from "../_components/wrapper";
import IssueReport from "@/components/dialogs/issue-resolution/report";

const MAX_LEN = 150;

interface ReviewJobProps {
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
		title: string;
	};
	isCreator: boolean;
	rating?: number;
	createdAt: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
}

export const JobReviewedFeed = ({
	jobId,
	talent,
	creator,
	title,
	description,
	isCreator,
	rating,
	createdAt,
	feedId,
	refetchFeeds,
	bookmark,
}: ReviewJobProps): ReactElement => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isReportingIssue, setIsReportingIssue] = useState(false);

	const tab = useMediaQuery("(min-width: 640px)");

	const reportAnIssue = () => {
		setIsModalOpen(false);
		setIsReportingIssue(true);
	};

	return (
		<FeedCardWrapper
			borderColor="#9BDCFD"
			bgColor="#F1FBFF"
			iconColor="#C9F0FF"
			createdAt={createdAt}
			feedId={feedId}
			dismissible={tab}
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
					<div className="flex flex-col gap-4">
						<div className="flex justify-between">
							<h3 className="w-fit items-center text-xl text-title">
								{isCreator ? talent?.name : creator?.name} has Reviewed your work on{" "}
								<span className="font-bold">{title}</span>
							</h3>
						</div>

						<p className="text-body">
							{description.length > MAX_LEN ? `${description.slice(0, MAX_LEN)}...` : description}
						</p>

						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								{rating && (
									/* @ts-ignore */
									<Rating
										initialRating={rating}
										fullSymbol={<Star fill="#15D28E" color="#15D28E" className="mt-[4px]" />}
										emptySymbol={<Star fill="transparent" color="#15D28E" className="mt-[4px]" />}
										readonly
									/>
								)}
								{!isCreator && (
									<Button
										size="md"
										variant="secondaryOutline"
										onClick={() => {
											setIsModalOpen(true);
										}}
									>
										Write a Review
									</Button>
								)}
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
				<div className="relative flex w-full flex-col items-start gap-4">
					<div className="flex items-center gap-2">
						<TalentProfile
							src={isCreator ? talent?.avatar : creator?.avatar}
							score={isCreator ? talent?.score : creator?.score}
							size="xs"
							url={`/talents/${isCreator ? talent?._id : creator?._id}`}
						/>
						<div className="flex w-[200px] flex-col items-start justify-start">
							<span className="line-clamp-1 text-lg leading-[27px] tracking-wide text-gray-800">
								{talent?.name}
							</span>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(talent?.title)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<p className="text-base font-bold text-black">Reviewed your work</p>
						<h3 className="text-sm font-medium text-title">{title}</h3>

						<p className="break-words text-sm text-body">{description}</p>

						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								{rating && (
									/* @ts-ignore */
									<Rating
										initialRating={rating}
										fullSymbol={<Star fill="#15D28E" color="#15D28E" className="mt-[4px]" />}
										emptySymbol={<Star fill="transparent" color="#15D28E" className="mt-[4px]" />}
										readonly
									/>
								)}
							</div>
						</div>
						{!isCreator && (
							<div className="z-[1] w-full pr-5">
								<Button
									size="md"
									variant="outlinePrimary"
									fullWidth
									onClick={() => {
										router.push(`/jobs/${jobId}/updates`);
									}}
								>
									Write a review
								</Button>
							</div>
						)}
					</div>
				</div>
			)}
		</FeedCardWrapper>
	);
};
