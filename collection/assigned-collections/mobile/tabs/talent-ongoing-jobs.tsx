"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, type ReactElement } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentJobCard } from "../misc/talent-card";
import { PageEmpty } from "@/components/common/page-empty";
import { AssignedJobTabProps4Mobile } from "../misc/types";
import { removeDuplicatesFromArray } from "@/lib/utils";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import { getActiveJobs } from "@/lib/actions/collection";

export const TalentOngoingJobs4Mobile = ({
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
}: AssignedJobTabProps4Mobile): ReactElement => {
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
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

	if (isLoading) {
		return <PageLoading className="fixed top-[131px] !h-[calc(100%-126px)]" color="#3055B3" />;
	}

	if (isErrorJobs && !tooManyReq) return <PageError className="h-[65vh] rounded-2xl border border-danger/50" />;

	if (d.length === 0 && !isLoading) {
		return <PageEmpty label="No ongoing jobs" className="fixed top-[131px] !h-[calc(100%-126px)]" />;
	}

	return (
		<div className={`scrollbar-hide relative mt-[64px] h-full w-full overflow-auto ${d.length > 3 ? "pb-20" : ""}`}>
			<div className="relative flex w-full flex-col overflow-y-auto">
				{d.map((job: CollectionProps) => {
					const realTimeRate = rates?.[job.meta?.coin?.reference ?? ""] ?? 0;

					return (
						<TalentJobCard
							jobId={job?._id}
							key={job?._id}
							price={job?.paymentFee ?? 0}
							title={job?.name}
							totalDeliverables={
								job?.collections.filter((collection) => collection.type === CollectionTypes.DELIVERABLE)
									.length
							}
							completedDeliverables={
								job?.collections.filter(
									(collection) =>
										collection.type === CollectionTypes.DELIVERABLE && collection.progress === 100
								).length
							}
							isCancelled={job?.status === CollectionStatus.CANCELLED}
							job={job}
							realTimeRate={realTimeRate}
							reviewText={job?.ratings?.[0]?.review ?? ""}
							ratingCount={job?.ratings?.[0]?.rating ?? 0}
						/>
					);
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
					<Loader size={25} className="animate-spin text-center text-white" />
				</div>
			) : null}
			<div ref={observerTarget} className="!h-4 !w-full" />
		</div>
	);
};
