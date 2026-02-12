"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FC, useMemo } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { extractOngoingCreatedJobs, isReviewChangeRequest } from "@/lib/actions/collection";
import { JobTabProps4Mobile } from "../_components/types";
import { PageLoading } from "@/components/common/page-loading";
import { CollectionTypes } from "@/lib/enums";
import { ClientJobCard4Mobile } from "../_components/client-card";

export const OngoingJobs4Mobile: FC<JobTabProps4Mobile> = ({
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

	if (isLoading) {
		return <PageLoading className="fixed top-[131px] !h-[calc(100%-126px)]" color="#3055B3" />;
	}

	if (JOBS_DATA.length === 0 && !isLoading) {
		return (
			<PageEmpty
				label="Your ongoing jobs will appear here."
				className="fixed top-[131px] !h-[calc(100%-126px)]"
			/>
		);
	}

	return (
		<div
			className={`scrollbar-hide relative mt-[64px] h-full w-full overflow-auto ${JOBS_DATA.length > 3 ? "pb-20" : ""}`}
		>
			{JOBS_DATA.map((job: CollectionProps) => {
				const realTimeRate = rates?.[job.meta?.coin?.reference ?? ""] ?? 0;
				const reviewRequestChange = job?.collections.find(isReviewChangeRequest);
				return (
					<ClientJobCard4Mobile
						totalDeliverables={
							job.collections.filter((collection) => collection.type === CollectionTypes.DELIVERABLE)
								.length
						}
						completedDeliverables={
							job.collections.filter(
								(collection) =>
									collection.type === CollectionTypes.DELIVERABLE && collection.progress === 100
							).length
						}
						reviewRequestChange={reviewRequestChange}
						jobId={job._id}
						key={job._id}
						price={job.paymentFee ?? 0}
						title={job.name}
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
			{tooManyReq ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white shadow-md">
						Too Many Requests. Please try again later.
					</span>
				</div>
			) : isFetchingNextPage ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<Loader size={25} className="animate-spin text-center text-white" />
				</div>
			) : null}
			<div ref={observerTarget} className={`${JOBS_DATA.length > 3 && "!h-4"} !w-full`} />
		</div>
	);
};
