"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { useGetJobsInfinitely } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { OngoingJobs } from "./tabs/ongoing";
import { CompletedJobs } from "./tabs/completed";
import { UnassignedJobs } from "./tabs/unassigned";
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";
import { UnfundedJobs } from "./tabs/unfunded";

export const CreatedJobs4Desktop = (): ReactElement => {
	// Rates
	const { data: rates } = useExchangeRateStore();

	const {
		data: jobs,
		refetch,
		isLoading,
		failureReason,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetJobsInfinitely({ category: CollectionCategory.CREATED, type: CollectionTypes.JOB });

	if (isError) return <PageError className="h-[85vh] rounded-2xl" />;

	return (
		<div className="relative w-full">
			<Tabs
				urlKey="my-jobs"
				tabs={[
					{
						label: "Ongoing",
						value: "ongoing",
						content: (
							<OngoingJobs
								jobs={jobs}
								fetchNextPage={fetchNextPage}
								hasNextPage={hasNextPage}
								isFetchingNextPage={isFetchingNextPage}
								isLoading={isLoading}
								refetch={refetch}
								failureReason={failureReason}
								rates={rates}
							/>
						),
					},
					{
						label: "Unassigned",
						value: "unassigned",
						content: (
							<UnassignedJobs
								jobs={jobs}
								fetchNextPage={fetchNextPage}
								hasNextPage={hasNextPage}
								isFetchingNextPage={isFetchingNextPage}
								isLoading={isLoading}
								refetch={refetch}
								failureReason={failureReason}
								rates={rates}
							/>
						),
					},
					{
						label: "Unfunded",
						value: "unfunded",
						content: (
							<UnfundedJobs
								jobs={jobs}
								fetchNextPage={fetchNextPage}
								hasNextPage={hasNextPage}
								isFetchingNextPage={isFetchingNextPage}
								isLoading={isLoading}
								refetch={refetch}
								failureReason={failureReason}
								rates={rates}
							/>
						),
					},
					{
						label: "Completed",
						value: "completed",
						content: (
							<CompletedJobs
								jobs={jobs}
								fetchNextPage={fetchNextPage}
								hasNextPage={hasNextPage}
								isFetchingNextPage={isFetchingNextPage}
								isLoading={isLoading}
								refetch={refetch}
								failureReason={failureReason}
								rates={rates}
							/>
						),
					},
				]}
			/>
		</div>
	);
};
