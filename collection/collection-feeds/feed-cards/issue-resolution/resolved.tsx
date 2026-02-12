"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import win from "@/lottiefiles/win.json";
import { Button } from "@/components/common/button";
import IssueWon from "@/components/dialogs/issue-resolution/issue-won";
import { FeedCardWrapper } from "../../_components/wrapper";
import Lottie from "@/components/common/lottie";

interface IssueResolutionResolveFeedProps {
	fundsAmount: string;
	description: string;
	createdAt: string;
}

export const IssueResolutionResolveFeed = ({
	fundsAmount,
	description,
	createdAt,
}: IssueResolutionResolveFeedProps): ReactElement => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<FeedCardWrapper
				borderColor="#7DDE86"
				bgColor="#FBFFFA"
				iconColor="#ECFCE5"
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
					<Lottie animationData={win} loop />
				</div>

				<div className="flex w-full flex-col justify-between gap-4 py-5">
					<div className="flex flex-col items-start gap-2">
						<h3 className="text-xl font-bold text-title">You Won Your Issue Resolution</h3>
						<p className="text-base text-body">{description}</p>
					</div>

					<div className="flex items-center justify-between">
						<Button size="md" variant="primary" onClick={() => setModalOpen(true)}>
							See Verdict
						</Button>
					</div>
				</div>
			</FeedCardWrapper>
			<IssueWon {...{ isOpen: modalOpen, setIsOpen: setModalOpen, fundsAmount }} />
		</>
	);
};
