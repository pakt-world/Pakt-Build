"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import failed from "@/lottiefiles/failed.json";
import { Button } from "@/components/common/button";
import IssueLost from "@/components/dialogs/issue-resolution/issue-lost";
import { FeedCardWrapper } from "../../_components/wrapper";
import Lottie from "@/components/common/lottie";

interface SecondIssueResolutionRejectFeedProps {
	fundsAmount: string;
	description: string;
	createdAt: string;
}

export const SecondIssueResolutionRejectFeed = ({
	fundsAmount,
	description,
	createdAt,
}: SecondIssueResolutionRejectFeedProps): ReactElement => {
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
					<Lottie animationData={failed} loop />
				</div>

				<div className="flex w-full flex-col justify-between gap-4 py-5">
					<div className="flex flex-col items-start gap-2">
						<h3 className="text-xl font-bold text-title">You lost your second Issue Resolution</h3>
						<p className="text-base text-body">{description}</p>
					</div>

					<div className="flex items-center justify-between">
						<Button size="md" variant="primary" onClick={() => setModalOpen(true)}>
							See Verdict
						</Button>
					</div>
				</div>
			</FeedCardWrapper>
			<IssueLost {...{ isOpen: modalOpen, setIsOpen: setModalOpen, fundsAmount }} />
		</>
	);
};
