"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { OpenJobCard4Mobile } from "../_components/open-card";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { SavedCollectionProps } from "@/lib/types/collection";
import { ExchangeRateRecord } from "@/lib/api/wallet";

interface SavedJobsProps {
	rates: ExchangeRateRecord | undefined;
	loggedInUser: string;
}

export const SavedJobs4Mobile = ({ rates, loggedInUser }: SavedJobsProps): ReactElement | null => {
	const bookmarkData = useGetBookmarks({
		page: 1,
		limit: 5,
		filter: { type: "collection" },
	});
	const jobs = bookmarkData.data?.data ?? [];

	if (bookmarkData.isError) return <PageError />;
	if (bookmarkData.isLoading) return <PageLoading className="h-[calc(100vh-200px)]" color="#3055B3" />;
	if (!jobs.length)
		return <PageEmpty label="Your saved jobs will appear here." className="sm:h-[70vh] sm:rounded-lg sm:py-6" />;

	return (
		<div
			className={`"scrollbar-hide relative mt-[64px] flex w-full flex-1 flex-col overflow-y-auto ${jobs.length > 3 && "mb-[64px]"}`}
		>
			{jobs.map((job: SavedCollectionProps) => {
				return (
					<OpenJobCard4Mobile
						key={job?._id}
						onRefresh={async (): Promise<void> => {
							await bookmarkData.refetch();
						}}
						job={job?.data}
						bookmarkId={job?._id}
						rates={rates}
						loggedInUser={loggedInUser}
						isBookmarked
					/>
				);
			})}
		</div>
	);
};
