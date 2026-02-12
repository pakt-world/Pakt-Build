"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useMemo } from "react";
import { InfiniteData } from "@tanstack/react-query";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { CollectionProps } from "@/lib/types/collection";
import { ApiError } from "@/lib/axios";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { GetJobsResponse } from "@/lib/api/job";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { completedJobs } from "@/lib/actions/collection";
import { PageLoading } from "@/components/common/page-loading";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import { DesktopClientJobCard } from "../_components/client-card";
import { sortArrayLatestFirstByDate } from "@/lib/utils";

interface CompletedJobsProps {
	jobs: InfiniteData<GetJobsResponse> | undefined;
	failureReason: ApiError | null;
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	refetch: () => void;
	rates: ExchangeRateRecord | undefined;
}

export const CompletedJobs: React.FC<CompletedJobsProps> = ({
	jobs,
	failureReason,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	refetch,
	rates,
}) => {
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
		error: failureReason?.response?.data.message ?? "",
	});
	const JOBS_DATA = completedJobs(currentData);
	const completedCollections = sortArrayLatestFirstByDate(JOBS_DATA);
	const tooManyReq =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	return (
		<div className="overflow-y-auto overflow-x-hidden">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl" color="#ffffff" />
			) : completedCollections.length > 0 ? (
				<div className="grid grid-cols-2 gap-4 overflow-y-auto px-1 pb-20 pt-1">
					{completedCollections.map((job: CollectionProps) => {
						const talentHasReviewed = job.ratings?.some((review) => review.owner?._id === job.owner?._id);
						const clientHasReviewed = job.ratings?.some((review) => review.owner?._id === job.creator?._id);
						const realTimeRate = rates ? (rates[job.meta.coin?.reference] as number) : 0;
						return (
							<DesktopClientJobCard
								jobId={job?._id}
								isCancelled={job?.status === CollectionStatus.CANCELLED}
								isCompleted={
									(talentHasReviewed && clientHasReviewed) ??
									job?.status === CollectionStatus.CANCELLED
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
								key={job?._id}
								price={job?.paymentFee ?? 0}
								title={job?.name}
								talent={{
									id: job?.owner?._id ?? "",
									paktScore: job?.owner?.score ?? 0,
									avatar: job?.owner?.profileImage?.url,
									name: `${job?.owner?.firstName}`,
									title: job?.owner?.profile?.bio?.title ?? "",
								}}
								realTimeRate={realTimeRate}
								meta={job?.meta}
								paymentRate={job?.rate}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="Your completed jobs will appear here."
					className="h-[80vh] rounded-2xl border border-line shadow"
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
