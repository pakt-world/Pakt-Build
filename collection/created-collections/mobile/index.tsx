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
import { OngoingJobs4Mobile } from "./tabs/ongoing";
import { CompletedJobs4Mobile } from "./tabs/completed";
import { UnassignedJobs4Mobile } from "./tabs/unassigned";
import { UnfundedJobs4Mobile } from "./tabs/unfunded";
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";

export const CreatedJobs4Mobile = (): ReactElement => {
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
	} = useGetJobsInfinitely({ limit: 100, category: CollectionCategory.CREATED, type: CollectionTypes.JOB });

	if (isError) return <PageError className="h-[85vh] rounded-2xl border border-red-200" />;

	return (
		<div className="flex h-full flex-1 overflow-y-auto">
			<Tabs
				urlKey="my-jobs"
				tabs={[
					{
						label: "Ongoing",
						value: "ongoing",
						content: (
							<OngoingJobs4Mobile
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
							<UnassignedJobs4Mobile
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
							<UnfundedJobs4Mobile
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
							<CompletedJobs4Mobile
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
				tabListClassName="!justify-center gap-2 !px-2 !border-l-0 !border-r-0 border-t border-green-lighter max-sm:top-[131px] !bg-white !text-white !z-30 max-sm:fixed"
				tabTriggerClassName="px-2 pb-[20px] items-center justify-center text-title radix-state-active:text-title radix-state-active:border-green-lighter"
				tabContentContainerClassName="mt-[60px]"
			/>
		</div>
	);
};
