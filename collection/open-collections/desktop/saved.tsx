"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { SavedCollectionProps } from "@/lib/types/collection";
import { DesktopOpenJobCard } from "./_components/open-card";

interface SavedJobsProps {
	rates: ExchangeRateRecord | undefined;
}

export const SavedJobs = ({ rates }: SavedJobsProps): JSX.Element | null => {
	const bookmarkData = useGetBookmarks({
		page: 1,
		limit: 5,
		filter: { type: "collection" },
	});
	const savedJobs = bookmarkData.data?.data ?? [];

	if (bookmarkData.isError)
		return <PageError className="h-[65vh] rounded-2xl border border-danger/50 bg-white py-6" />;
	if (bookmarkData.isLoading)
		return <PageLoading className="h-[65vh] rounded-2xl border border-line bg-white py-6 shadow" color="#3055B3" />;
	if (!savedJobs.length)
		return (
			<PageEmpty
				label="Your saved jobs will appear here."
				className="h-[65vh] rounded-2xl border border-line bg-white py-6 shadow"
			/>
		);

	return (
		<div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
			{savedJobs.map((job: SavedCollectionProps) => {
				return (
					<DesktopOpenJobCard
						key={job?._id}
						onRefresh={async (): Promise<void> => {
							await bookmarkData.refetch();
						}}
						job={job?.data}
						bookmarkId={job?._id}
						isBookmarked
						rates={rates}
					/>
				);
			})}
		</div>
	);
};
