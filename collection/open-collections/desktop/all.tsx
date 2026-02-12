"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { forwardRef } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import { CollectionProps } from "@/lib/types/collection";
import { PageError } from "@/components/common/page-error";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { DesktopOpenJobCard } from "./_components/open-card";

interface AllJobsProps {
	jobs: CollectionProps[];
	onRefresh?: () => void;
	loading?: boolean;
	isFetchingNextPage: boolean;
	tooManyReq: boolean;
	isError: boolean;
	rates: ExchangeRateRecord | undefined;
}

export const AllJobs = forwardRef<HTMLDivElement, AllJobsProps>((props, ref): JSX.Element => {
	const { jobs, onRefresh, loading, isFetchingNextPage, tooManyReq, isError, rates } = props;

	if (isError) return <PageError className="h-[85vh] rounded-2xl border border-red-200 bg-red-50" />;

	return (
		<div className="overflow-y-auto overflow-x-hidden p-4">
			{loading ? (
				<PageLoading className="h-[65vh] rounded-2xl border border-line bg-white shadow" color="#3055B3" />
			) : jobs.length > 0 ? (
				<div className="grid grid-cols-2 grid-rows-3 gap-4">
					{jobs.map((job: CollectionProps) => {
						return (
							<DesktopOpenJobCard
								key={job?._id}
								job={job}
								onRefresh={onRefresh}
								bookmarkId={job?._id}
								isBookmarked={job?.isBookmarked}
								rates={rates}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="No open jobs yet."
					className="h-[65vh] rounded-2xl border border-line bg-white shadow"
				/>
			)}
			{tooManyReq ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white shadow-md">
						Too Many Requests. Please try again later.
					</span>
				</div>
			) : isFetchingNextPage ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<Loader size={25} className="animate-spin text-center text-body" />
				</div>
			) : null}
			<div ref={ref} className="!h-4 !w-full" />
		</div>
	);
});

AllJobs.displayName = "AllJobs";
