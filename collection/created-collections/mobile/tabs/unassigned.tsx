"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useMemo } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UnAssignedJobCard4Mobile } from "../_components/unassigned-card";
import { PageEmpty } from "@/components/common/page-empty";
import { JobTabProps4Mobile } from "../_components/types";
import { useUserState } from "@/lib/store/account";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { unassignedJobs } from "@/lib/actions/collection";
import { PageLoading } from "@/components/common/page-loading";

export const UnassignedJobs4Mobile = ({
	jobs,
	failureReason,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	refetch,
	rates,
}: JobTabProps4Mobile): JSX.Element => {
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

	if (isLoading) {
		return <PageLoading className="fixed top-[131px] !h-[calc(100%-126px)]" color="#3055B3" />;
	}

	if (JOBS_DATA.length === 0 && !isLoading) {
		return <PageEmpty label="No unassigned jobs" className="fixed top-[131px] !h-[calc(100%-126px)]" />;
	}

	return (
		<div
			className={`scrollbar-hide relative mt-[64px] h-full w-full overflow-auto ${JOBS_DATA.length > 3 ? "pb-20" : ""}`}
		>
			<div className="relative flex w-full flex-col overflow-y-auto">
				{JOBS_DATA.map((job) => {
					return <UnAssignedJobCard4Mobile job={job} key={job?._id} rates={rates} />;
				})}
			</div>
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
			<div ref={observerTarget} className={`${JOBS_DATA.length > 3 && "!h-4"} !w-full`} />
		</div>
	);
};
