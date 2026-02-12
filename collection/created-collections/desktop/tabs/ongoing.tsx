"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FC, useMemo } from "react";
import { InfiniteData } from "@tanstack/react-query";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isReviewChangeRequest } from "@/lib/actions/collection";
import { PageEmpty } from "@/components/common/page-empty";
import { CollectionProps } from "@/lib/types/collection";
import { extractOngoingCreatedJobs } from "@/lib/actions/collection";
import { GetJobsResponse } from "@/lib/api/job";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { ApiError } from "@/lib/axios";
import { CollectionTypes } from "@/lib/enums";
import { PageLoading } from "@/components/common/page-loading";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { DesktopClientJobCard } from "../_components/client-card";

interface OngoingJobsProps {
	jobs: InfiniteData<GetJobsResponse> | undefined;
	failureReason: ApiError | null;
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	refetch: () => void;
	rates: ExchangeRateRecord | undefined;
}

export const OngoingJobs: FC<OngoingJobsProps> = ({
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
	const JOBS_DATA = extractOngoingCreatedJobs(currentData);

	const tooManyReq =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	return (
		<div className="flex h-full min-h-[80vh] flex-col">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl" color="#ffffff" />
			) : JOBS_DATA.length > 0 ? (
				<div className="grid h-full grid-cols-1 grid-rows-3 gap-4 p-1 lg:grid-cols-2">
					{JOBS_DATA.map((job: CollectionProps) => {
						const realTimeRate = rates?.[job.meta?.coin?.reference ?? ""] ?? 0;
						const reviewRequestChange = job?.collections.find(isReviewChangeRequest);
						return (
							<DesktopClientJobCard
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
								reviewRequestChange={reviewRequestChange}
								jobId={job?._id}
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
								jobProgress={job?.progress}
								meta={job?.meta}
								realTimeRate={realTimeRate}
								paymentRate={job?.rate}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="Your ongoing jobs will appear here."
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
