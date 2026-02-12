"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ClientJobCard4Mobile } from "../_components/client-card";
import { PageEmpty } from "@/components/common/page-empty";
import { JobTabProps4Mobile } from "../_components/types";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { completedJobs } from "@/lib/actions/collection";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import { PageLoading } from "@/components/common/page-loading";
import { sortArrayLatestFirstByDate } from "@/lib/utils";

export const CompletedJobs4Mobile = ({
	jobs,
	failureReason,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	refetch,
	rates,
}: JobTabProps4Mobile): JSX.Element => {
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

	if (isLoading) {
		return <PageLoading className="fixed top-[131px] !h-[calc(100%-126px)]" color="#3055B3" />;
	}

	if (completedCollections.length === 0 && !isLoading) {
		return (
			<PageEmpty
				label="Your completed jobs will appear here."
				className="fixed top-[131px] !h-[calc(100%-126px)]"
			/>
		);
	}

	return (
		<div
			className={`scrollbar-hide relative mt-[64px] h-full w-full overflow-auto ${completedCollections.length > 3 ? "pb-20" : ""}`}
		>
			<div className="relative flex w-full flex-col overflow-y-auto">
				{completedCollections.map((job: CollectionProps) => {
					const talentHasReviewed = job?.ratings?.some((review) => review?.owner?._id === job?.owner?._id);
					const clientHasReviewed = job?.ratings?.some((review) => review?.owner?._id === job?.creator?._id);
					const realTimeRate = rates ? (rates[job.meta.coin?.reference] as number) : 0;
					return (
						<ClientJobCard4Mobile
							jobId={job?._id}
							isCancelled={job?.status === CollectionStatus.CANCELLED}
							isCompleted={
								(talentHasReviewed && clientHasReviewed) ?? job?.status === CollectionStatus.CANCELLED
							}
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
							key={job?._id}
							price={job?.paymentFee}
							title={job?.name}
							reviewText={job?.ratings?.[0]?.review ?? ""}
							ratingCount={job?.ratings?.[0]?.rating ?? 0}
							talent={{
								id: job?.owner?._id ?? "",
								paktScore: job?.owner?.score ?? 0,
								avatar: job?.owner?.profileImage?.url,
								name: `${job?.owner?.firstName}`,
								title: job?.owner?.profile?.bio?.title ?? "",
							}}
							realTimeRate={realTimeRate}
							meta={job.meta}
							paymentRate={job?.rate}
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
					<Loader size={25} className="animate-spin text-center text-body" />
				</div>
			) : null}
			<div ref={observerTarget} className={`${JOBS_DATA.length > 3 && "!h-4"} !w-full`} />
		</div>
	);
};
