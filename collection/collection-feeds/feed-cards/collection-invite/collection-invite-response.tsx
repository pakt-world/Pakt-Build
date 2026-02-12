"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { FeedCardWrapper } from "../../_components/wrapper";
import { AUTH_TOKEN_KEY, titleCase } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { CollectionInviteType } from "./enum";

export interface CollectionInviteResponseProps {
	title: string;
	jobId: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	accepted: boolean;
	cancelled: boolean;
	type: CollectionInviteType.COLLECTION_INVITE_RESPONSE;
	imageUrl?: string;
	createdAt: string;
	feedId: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	dueDate?: string;
}

export const CollectionInviteResponse = (props: CollectionInviteResponseProps) => {
	const { title, bookmark, talent, jobId, accepted, createdAt, feedId, refetchFeeds, dueDate } = props;

	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();
	const token = getCookie(AUTH_TOKEN_KEY);

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
						src={talent?.avatar}
						score={talent?.score}
						size="lg"
						url={token ? `/talents/${talent?._id}` : `/view-talent/${talent?._id}`}
					/>

					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-title">
								Job Invitation {accepted ? "Accepted" : "Cancelled"}
							</h3>
						</div>

						<p className="text-base text-body">
							{talent?.name} has {accepted ? "Accepted" : "rescinded your invite to the"}{" "}
							<span className="text-bold text-title">&quot;{title}&quot;</span> Job.
						</p>

						<div className="mt-auto flex items-center justify-between">
							<Button size="md" variant="secondaryOutline" asChild>
								<Link href={token ? `/jobs/${jobId}` : `/view-job/${jobId}`}>See Details</Link>
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="relative flex w-full flex-col items-start gap-4">
					<div className="flex w-fit items-center gap-2">
						<TalentProfile
							score={talent?.score}
							src={talent?.avatar}
							size="xs"
							url={token ? `/talents/${talent?._id}` : `/view-talent/${talent?._id}`}
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
					<div
						onClick={() => {
							if (token) {
								router.push(`/jobs/${jobId}`);
							} else {
								router.push(`/view-job/${jobId}`);
							}
						}}
						className="flex w-full flex-col gap-2"
					>
						<div className="flex items-center justify-between">
							<h3 className="text-base font-bold text-black">
								Job Invitation {accepted ? "Accepted" : "Declined"}
							</h3>
						</div>
						<div className="flex w-full items-center justify-between gap-2">
							<p className="w-[80%] text-sm text-body">
								{talent?.name} has {accepted ? "Accepted" : "rescinded your invite to the"}{" "}
								<span className="font-bold text-title">&quot;{title}&quot;</span> Job.
							</p>
						</div>
						{/* <Button
						size="md"
						fullWidth
						variant="outlinePrimary"
						onClick={() => {
							router.push(`/jobs/${jobId}`);
						}}
					>
						See Details
					</Button> */}
					</div>
				</div>
			)}
		</FeedCardWrapper>
	);
};
