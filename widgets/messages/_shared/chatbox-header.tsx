"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { Button } from "@/components/common/button";
import { Skeleton } from "@/components/common/skeletons/skeleton";
import { formatDateHandler, sentenceCase } from "@/lib/utils";
import type { RecipientResponseProps } from "@/providers/socket-types";

export const ChatBoxHeader = ({
	sender,
	time = new Date().toString(),
	className,
}: {
	sender: RecipientResponseProps;
	time: string;
	className?: string;
}): JSX.Element => {
	const router = useRouter();

	const name = `${sender?.firstName}`;
	// Time from X with dayjs
	const timeFromNow = formatDateHandler(time, "DD MMM YYYY");

	return (
		<div className={`flex items-center justify-start gap-2 border-b border-line pb-3 ${className}`}>
			<Button
				variant="ghost"
				onClick={() => {
					router.push("/messages");
				}}
				className="p-0 sm:hidden"
			>
				<ChevronLeft className="text-black" />
			</Button>

			<div className="flex flex-row items-center gap-2">
				{((sender?.score !== 0 && !sender?.profile?.bio?.title) ?? "") ? (
					<Skeleton className="h-[65px] w-[65px] rounded-full" />
				) : (
					<TalentProfile
						score={sender?.score}
						src={sender?.profileImage?.url}
						size="sm"
						url={`/talents/${sender?._id}`}
					/>
				)}
				<div className="flex flex-col items-start gap-1">
					<div className="text-lg font-medium leading-none text-title max-sm:line-clamp-1">{name}</div>
					<div className="text-sm leading-none text-body max-sm:line-clamp-1">
						{sentenceCase(sender?.profile?.bio?.title ?? "Pakt Builder")}
					</div>
				</div>
			</div>

			{time ? (
				<span className="ml-auto text-xs text-body sm:text-base">
					Started: <br className="sm:hidden" /> <span className="whitespace-pre">{timeFromNow}</span>
				</span>
			) : (
				<Skeleton className="h-5 w-40" />
			)}
		</div>
	);
};
