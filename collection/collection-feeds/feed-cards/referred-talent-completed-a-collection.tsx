"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Star } from "lucide-react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { Button } from "@/components/common/button";
import { FeedCardWrapper } from "../_components/wrapper";

interface ReferralJobCompletionProps {
	title: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	rating: number;
	jobId: string;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
}
export const ReferralJobCompletion = ({
	jobId: _jId,
	talent,
	title,
	rating,
	createdAt,
	feedId,
	refetchFeeds,
	bookmark,
}: ReferralJobCompletionProps): ReactElement => {
	return (
		<FeedCardWrapper
			borderColor="#CDCFD0"
			bgColor="#F9F9F9"
			iconColor="#F2F4F5"
			createdAt={createdAt}
			feedId={feedId}
			dismissible
			refetchFeeds={refetchFeeds}
			bookmark={bookmark}
		>
			<TalentProfile src={talent.avatar} score={talent.score} size="lg" url={`/talents/${talent?._id}`} />
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">
						{talent.name} a{" "}
						{
							/* @ts-ignore */
							<Rating
								readonly
								initialRating={rating || 0}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" />}
							/>
						}{" "}
						completed a job
					</h3>
				</div>
				<p className="text-3xl text-body">{title}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button size="md" variant="outlinePrimary">
							See Review
						</Button>
					</div>
				</div>
			</div>
		</FeedCardWrapper>
	);
};
