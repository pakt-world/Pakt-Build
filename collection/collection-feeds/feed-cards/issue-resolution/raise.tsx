"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import alert from "@/lottiefiles/alert.json";
import Lottie from "@/components/common/lottie";
import { Button } from "@/components/common/button";
import IssueDefense from "@/components/dialogs/issue-resolution/defense";
import { FeedCardWrapper } from "../../_components/wrapper";

interface IssueResolutionRaiseFeedProps {
	issueId: string;
	issuerName: string;
	description: string;
	createdAt: string;
}

export const IssueResolutionRaiseFeed = ({
	issueId,
	issuerName,
	description,
	createdAt,
}: IssueResolutionRaiseFeedProps): ReactElement => {
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<>
			<FeedCardWrapper
				borderColor="#FF9898"
				bgColor="#FFF4F4"
				iconColor="#FFE5E5"
				createdAt={createdAt}
				feedId=""
				refetchFeeds={() => {}}
				bookmark={{
					onBookmarksTab: false,
					isBookmarked: false,
					bookmarkId: "",
				}}
				isIssueResolution
			>
				<div className="flex w-[148px] items-center justify-center">
					<Lottie animationData={alert} loop />
				</div>

				<div className="flex w-full flex-col justify-between gap-4 py-5">
					<div className="flex flex-col items-start gap-2">
						<h3 className="text-xl font-bold text-title">{issuerName} Has Raised An Issue</h3>
						<p className="text-base text-body">{description}</p>
					</div>

					<div className="flex items-center justify-between">
						<Button size="md" variant="primary" type="button" onClick={() => setModalOpen(true)}>
							See Details
						</Button>
					</div>
				</div>
			</FeedCardWrapper>

			<IssueDefense {...{ issueId, isOpen: modalOpen, setIsOpen: setModalOpen }} />
		</>
	);
};
