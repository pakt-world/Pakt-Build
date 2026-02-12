"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { titleCase } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { FeedCardWrapper } from "../_components/wrapper";

interface ReferralSignupFeedProps {
	feedId: string;
	name: string;
	userId: string;
	title?: string;
	description?: string;
	avatar?: string;
	score?: number;
	jobTitle?: string;
	createdAt: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
}
export const ReferralSignupFeed = ({
	title,
	description,
	userId,
	avatar,
	score,
	name,
	jobTitle,
	createdAt,
	feedId,
	refetchFeeds,
	bookmark,
}: ReferralSignupFeedProps): JSX.Element => {
	const tab = useMediaQuery("(min-width: 640px)");

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
			{tab ? (
				<div className="flex size-full items-center">
					<TalentProfile src={avatar} score={Number(score)} size="lg" url={`/talents/${userId}`} />
					<div className="flex w-full flex-col justify-center gap-4">
						<div className="flex w-full items-center justify-between">
							<h3 className="text-xl font-bold text-title">{title ?? `${name} just signed up`}</h3>
						</div>

						<p className="text-body">
							{description ??
								`Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌`}
						</p>

						<div className="flex items-end justify-between">
							<Button size="md" variant="outlinePrimary" asChild>
								<Link href={`/messages?userId=${userId}`}>Message</Link>
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="z-10 flex w-full flex-col gap-4 overflow-hidden border-b border-[#CDCFD0] bg-[#F9F9F9] p-4 px-[21px]">
					<div className="relative -left-[5px] flex items-center gap-2">
						<TalentProfile src={avatar} score={Number(score)} size="sm" url={`/talents/${userId}`} />
						<div className="inline-flex flex-col items-start justify-start">
							<p className="flex text-lg leading-[27px] tracking-wide text-gray-800">{name}</p>
							<span className="text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(jobTitle as string)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<h3 className="text-xl font-bold text-title">{title ?? `${name} just signed up`}</h3>
						<div className="flex items-center justify-between">
							<p className="text-sm text-body">
								{description ??
									`Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
			  support! 🙌`}
							</p>
						</div>
					</div>
				</div>
			)}
		</FeedCardWrapper>
	);
};
