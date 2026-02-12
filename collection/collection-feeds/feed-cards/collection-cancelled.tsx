"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { Button } from "@/components/common/button";
import { FeedCardWrapper } from "../_components/wrapper";

interface JobCancelledProps {
	title: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	jobId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	isCreator: boolean;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
}

export const JobCancelled = ({
	jobId,
	talent,
	creator,
	title,
	isCreator,
	createdAt,
	feedId,
	refetchFeeds,
	bookmark,
}: JobCancelledProps): ReactElement => {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	return (
		<FeedCardWrapper
			borderColor="#FF9898"
			bgColor="#FFF4F4"
			iconColor="#FFE5E5"
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
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-title">{creator?.name} Cancelled the Job</h3>
						</div>
						<p className="text-3xl text-body">{title}</p>
						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Link href={`/job/${jobId}`}>
									<Button size="md" variant="primary">
										See Details
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div
					onClick={() => {
						router.push(`/jobs/${jobId}`);
					}}
					className="relative flex w-full flex-col items-start gap-4"
				>
					<TalentProfile
						src={isCreator ? talent?.avatar : creator?.avatar}
						score={isCreator ? talent?.score : creator?.score}
						size="xs"
						url={`/talents/${isCreator ? talent?._id : creator?._id}`}
					/>
					<div className="flex w-full flex-col gap-4 py-4">
						<h3 className="text-base font-bold text-black">{creator?.name} Cancelled the Bounty</h3>

						<p className="text-sm text-body">{title}</p>
						{/* <div className="mt-auto flex items-center gap-4">
						<Button size="sm" variant="outlinePrimary" className="" asChild>
							<Link href={`/jobs/${jobId}`}>See Details</Link>
						</Button>
					</div> */}
					</div>
				</div>
			)}
		</FeedCardWrapper>
	);
};
