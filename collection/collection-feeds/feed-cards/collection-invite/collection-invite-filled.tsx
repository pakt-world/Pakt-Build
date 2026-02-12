"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { FeedCardWrapper } from "../../_components/wrapper";
import { Button } from "@/components/common/button";
import { CollectionInviteType } from "./enum";

export interface CollectionInviteFilledProps {
	title: string;
	inviter: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	type: CollectionInviteType.COLLECTION_INVITE_FILLED;
	imageUrl?: string;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	dueDate?: string;
}

export const CollectionInviteFilled = (props: CollectionInviteFilledProps) => {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();
	const { title, inviter, createdAt, bookmark, feedId, refetchFeeds, dueDate } = props;
	return (
		<FeedCardWrapper
			borderColor="#9BDCFD"
			bgColor="#F1FBFF"
			iconColor="#C9F0FF"
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
						src={inviter?.avatar}
						score={inviter?.score}
						size="lg"
						url={`/talents/${inviter?._id}`}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-title">Job Filled</h3>
						</div>

						<p className="text-base text-body">
							The <span className="text-bold text-title">&quot;{title}&quot;</span> Job you applied to has
							been filled. You can check out more public jobs that fit your profile
						</p>

						<div className="mt-auto flex items-center justify-between">
							<Button size="md" variant="secondaryOutline" asChild>
								<Link href="/jobs">See More Jobs</Link>
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div
					onClick={() => {
						router.push(`/jobs`);
					}}
					className="relative flex w-full flex-col items-start gap-4"
				>
					<TalentProfile
						src={inviter?.avatar}
						score={inviter?.score}
						size="xs"
						url={`/talents/${inviter?._id}`}
					/>
					<div className="flex w-full flex-col gap-4 py-4">
						<div className="flex items-center justify-between">
							<h3 className="text-base font-bold text-black">Job Filled</h3>
						</div>
						<p className="text-sm text-body">
							The <span className="text-bold text-title">&quot;{title}&quot;</span> Job you applied to has
							been filled. You can check out more public jobs that fit your profile
						</p>
						{/* <div className="mt-auto flex items-center justify-between">
						<Button size="md" variant="outlinePrimary" asChild>
							<Link href="/jobs">See More Jobs</Link>
						</Button>
					</div> */}
					</div>
				</div>
			)}
		</FeedCardWrapper>
	);
};
