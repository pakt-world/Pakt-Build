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

import { UnAssignedJobCard } from "../_components/unassigned-card";
import { ApiError } from "@/lib/axios";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { unassignedJobs } from "@/lib/actions/collection";
import { GetJobsResponse } from "@/lib/api/job";
import { useUserState } from "@/lib/store/account";
import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";

interface UnassignedJobsProps {
	jobs: InfiniteData<GetJobsResponse> | undefined;
	failureReason: ApiError | null;
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	refetch: () => void;
	rates: ExchangeRateRecord | undefined;
}

export const UnassignedJobs: React.FC<UnassignedJobsProps> = ({
	jobs,
	failureReason,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	refetch,
	rates,
}) => {
	const { user } = useUserState();
	const { _id } = user ?? { _id: "" };
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
	const JOBS_DATA = unassignedJobs(currentData, _id);

	const tooManyReq =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	return (
		<div className="flex h-full min-h-[80vh] flex-col">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl" color="#ffffff" />
			) : JOBS_DATA.length > 0 ? (
				<div className="grid h-full grid-cols-1 grid-rows-3 gap-4 p-1 lg:grid-cols-2">
					{JOBS_DATA.map((job) => {
						return <UnAssignedJobCard job={job} key={job?._id} rates={rates} />;
					})}
				</div>
			) : (
				<PageEmpty label="No unassigned jobs" className="h-[80vh] rounded-2xl border border-line shadow" />
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
