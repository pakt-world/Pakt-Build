"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo } from "react";
import { InfiniteData } from "@tanstack/react-query";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { removeDuplicatesFromArray } from "@/lib/utils";
import { PageEmpty } from "@/components/common/page-empty";
import { ApiError } from "@/lib/axios";
import { GetJobsResponse } from "@/lib/api/job";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import { TalentJobCard } from "../misc/talent-card";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { getActiveJobs } from "@/lib/actions/collection";

interface OngoingJobsProps {
	jobs: InfiniteData<GetJobsResponse> | undefined;
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	refetch: () => void;
	error: ApiError | null;
	tooManyReq?: boolean;
	isErrorJobs: boolean;
	rates: ExchangeRateRecord | undefined;
}

export const TalentOngoingJobs = ({
	jobs,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	refetch,
	error,
	tooManyReq,
	isErrorJobs,
	rates,
}: OngoingJobsProps): JSX.Element => {
	let prevPage = 0;
	let currentPage = 1;

	const bountiesData = useMemo(
		() => ({
			...jobs,
			pages: jobs?.pages?.map((page) => page.data) ?? [],
		}),
		[jobs]
	);

	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: bountiesData,
		refetch,
		error: error?.response?.data.message ?? "",
	});

	const ongoingJobs = getActiveJobs(currentData);
	const d = removeDuplicatesFromArray(ongoingJobs);

	if (isErrorJobs && !tooManyReq) return <PageError className="h-[65vh] rounded-2xl border border-danger/50" />;

	return (
		<div className="flex h-full min-h-[80vh] flex-col">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl border border-line bg-white shadow" color="#3055B3" />
			) : d.length > 0 ? (
				<div className="grid grid-cols-2 gap-4 overflow-y-auto px-1 pb-20 pt-1">
					{d.map((job: CollectionProps) => {
						const realTimeRate = rates?.[job.meta?.coin?.reference ?? ""] ?? 0;

						return (
							<TalentJobCard
								jobId={job?._id}
								key={job?._id}
								price={job?.paymentFee ?? 0}
								title={job?.name}
								totalDeliverables={
									job?.collections.filter(
										(collection) => collection.type === CollectionTypes.DELIVERABLE
									).length
								}
								completedDeliverables={
									job?.collections.filter(
										(collection) =>
											collection.type === CollectionTypes.DELIVERABLE &&
											collection.progress === 100
									).length
								}
								isCancelled={job?.status === CollectionStatus.CANCELLED}
								job={job}
								realTimeRate={realTimeRate}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="Your ongoing jobs will appear here."
					className="h-[85vh] rounded-2xl border border-line bg-white shadow"
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
			<div ref={observerTarget} className="!h-4 !w-full" />
		</div>
	);
};
