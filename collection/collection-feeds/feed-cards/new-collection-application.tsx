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
import { FeedCardWrapper } from "../_components/wrapper";
import { titleCase } from "@/lib/utils";
import { Button } from "@/components/common/button";

interface JobApplicationCardProps {
	feedId: string;
	title: string;
	applicant: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	jobId: string;
	createdAt: string;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
}

export const JobApplicationCard = (props: JobApplicationCardProps): ReactElement => {
	const { feedId, title, jobId, bookmark, applicant, createdAt, refetchFeeds } = props;
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

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
		>
			{tab ? (
				<div className="flex size-full items-center gap-4">
					<TalentProfile
						src={applicant?.avatar}
						score={applicant?.score}
						size="lg"
						url={`/talents/${applicant?._id}`}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold text-title">New Job Application</h3>
						</div>

						<p className="text-base text-body">
							You Have Received a new job application for{" "}
							<span className="text-bold text-title">&quot;{title}&quot;</span> from {applicant?.name}
						</p>

						<div className="mt-auto flex items-center justify-between">
							<Button size="md" variant="secondaryOutline" asChild disabled={false}>
								<Link href={`/jobs/${jobId}/applicants`}>View Applicants</Link>
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div
					onClick={() => {
						router.push(`/jobs/${jobId}/applicants`);
					}}
					className="relative flex w-full flex-col items-start gap-4"
				>
					<div className="flex items-center gap-2">
						<TalentProfile
							score={applicant?.score}
							src={applicant?.avatar}
							size="xs"
							url={`/talents/${applicant?._id}`}
						/>
						<div className="flex w-[200px] flex-col items-start justify-start">
							<p className="line-clamp-1 text-lg leading-[27px] tracking-wide text-gray-800">
								{applicant?.name}
							</p>
							<span className="line-clamp-1 text-xs leading-[18px] tracking-wide text-gray-500">
								{titleCase(applicant?.title)}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<div className="flex items-center justify-between">
							<h3 className="text-base font-bold text-black">New Job Application</h3>
						</div>
						<div className="flex w-full items-center justify-between gap-2">
							<p className="w-[90%] text-sm font-normal text-body">
								You Have Received a new job application for{" "}
								<span className="text-bold text-title">&quot;{title}&quot;</span> from {applicant?.name}
							</p>
						</div>
					</div>
					{/* <Button
			size="md"
			variant="outlinePrimary"
			fullWidth
			onClick={() => {
				router.push(`/jobs/${jobId}/applicants`);
			}}
		>
			View Applicants
		</Button> */}
				</div>
			)}
		</FeedCardWrapper>
	);
};
