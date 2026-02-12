"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useState, type ReactElement } from "react";
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
import { FeedCardWrapper } from "../../_components/wrapper";
import IssueReport from "@/components/dialogs/issue-resolution/report";

interface ReviewChangeProps {
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
	isAccepted: boolean;
	isCreator: boolean;
	rating?: number;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
}

export const ReviewChangeCard = ({
	title,
	jobId,
	description,
	creator,
	talent,
	isCreator,
	isAccepted,
	rating,
	createdAt,
	feedId,
	refetchFeeds,
	bookmark,
}: ReviewChangeProps): ReactElement => {
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
			borderColor="#FF5247"
			bgColor="#FFF4F4"
			iconColor="#FFE5E5"
			createdAt={createdAt}
			feedId={feedId}
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
					<div className="flex flex-col items-start justify-center gap-4">
						<div className="flex w-full items-center justify-between">
							<h3 className="text-xl font-bold text-black">{title}</h3>
						</div>

						<p className="text-[24px] font-normal text-title">{description}</p>

						<div className="flex w-full items-end justify-between">
							<div className="flex items-center gap-2">
								{!isAccepted && (
									<Button
										size="md"
										variant="outlinePrimary"
										onClick={() => {
											setIsModalOpen(true);
										}}
									>
										View Request
									</Button>
								)}
								{rating && (
									/* @ts-ignore */
									<Rating
										initialRating={rating}
										fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
										emptySymbol={<Star fill="transparent" color="#15D28E" />}
										readonly
									/>
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
								{isCreator ? talent?.name : creator?.name}
							</p>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(isCreator ? talent?.title : creator?.title)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<div className="flex items-center justify-between">
							<h3 className="text-base font-bold text-title">{title}</h3>
						</div>

						<p className="text-sm capitalize text-body">{description}</p>

						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								{rating && (
									/* @ts-ignore */
									<Rating
										initialRating={rating}
										fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
										emptySymbol={<Star fill="transparent" color="#15D28E" />}
										readonly
									/>
								)}
							</div>
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
					View Request
				</Button> */}
				</div>
			)}
		</FeedCardWrapper>
	);
};
