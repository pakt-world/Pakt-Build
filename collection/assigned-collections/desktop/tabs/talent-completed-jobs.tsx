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
import { GetJobsResponse } from "@/lib/api/job";
import { ApiError } from "@/lib/axios";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import { PageLoading } from "@/components/common/page-loading";
import { TalentJobCard } from "../misc/talent-card";
import { PageError } from "@/components/common/page-error";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { completedJobs } from "@/lib/actions/collection";

interface CompletedJobsProps {
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

export const TalentCompletedJobs = ({
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
}: CompletedJobsProps): JSX.Element => {
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	const jobsData = useMemo(
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
		data: jobsData,
		refetch,
		error: error?.response?.data.message ?? "",
	});

	const completedBounties = completedJobs(currentData);
	const d = removeDuplicatesFromArray(completedBounties);

	if (isErrorJobs && !tooManyReq) return <PageError className="h-[65vh] rounded-2xl border border-danger/50" />;

	return (
		<div className="flex h-full min-h-[80vh] flex-col">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl border border-line bg-white shadow" color="#3055B3" />
			) : d.length > 0 ? (
				<div className="grid grid-cols-2 gap-4 overflow-y-auto px-1 pb-20 pt-1">
					{d.map((job: CollectionProps) => {
						const talentHasReviewed = job?.ratings?.some(
							(review) => review?.owner?._id === job?.owner?._id
						);
						const clientHasReviewed = job?.ratings?.some(
							(review) => review?.owner._id === job?.creator?._id
						);
						const realTimeRate = rates?.[job.meta?.coin?.reference ?? ""] ?? 0;

						return (
							<TalentJobCard
								jobId={job?._id}
								isCancelled={job?.status === CollectionStatus.CANCELLED}
								key={job?._id}
								price={job?.paymentFee ?? 0}
								title={job?.name}
								isCompleted={
									clientHasReviewed ?? talentHasReviewed ?? job?.status === CollectionStatus.CANCELLED
								}
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
								job={job}
								realTimeRate={realTimeRate}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="Your completed jobs will appear here."
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
