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
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";
import { TalentCompletedJobs4Mobile } from "./tabs/talent-completed-jobs";
import { TalentOngoingJobs4Mobile } from "./tabs/talent-ongoing-jobs";

export const AssignedJobs4Mobile = (): ReactElement => {
	const {
		data: jobs,
		refetch: refetchJobs,
		failureReason,
		isLoading: isLoadingJobs,
		isError: isErrorJobs,
		error: errorJobs,
		fetchNextPage: fetchNextPageJobs,
		hasNextPage: hasNextPageJobs,
		isFetchingNextPage: isFetchingNextPageJobs,
	} = useGetJobsInfinitely({ category: CollectionCategory.ASSIGNED, type: CollectionTypes.JOB });

	// Rates
	const { data: rates } = useExchangeRateStore();

	const tooManyReqJobs =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	return (
		<div className="flex h-full flex-1 overflow-y-auto">
			<Tabs
				urlKey="client-jobs"
				tabs={[
					{
						label: "Ongoing",
						value: "ongoing",
						content: (
							<TalentOngoingJobs4Mobile
								jobs={jobs}
								fetchNextPage={fetchNextPageJobs}
								hasNextPage={hasNextPageJobs}
								isFetchingNextPage={isFetchingNextPageJobs}
								isLoading={isLoadingJobs}
								refetch={refetchJobs}
								error={errorJobs}
								tooManyReq={tooManyReqJobs}
								isErrorJobs={isErrorJobs}
								rates={rates}
							/>
						),
					},
					{
						label: "Completed",
						value: "completed",
						content: (
							<TalentCompletedJobs4Mobile
								jobs={jobs}
								fetchNextPage={fetchNextPageJobs}
								hasNextPage={hasNextPageJobs}
								isFetchingNextPage={isFetchingNextPageJobs}
								isLoading={isLoadingJobs}
								refetch={refetchJobs}
								error={errorJobs}
								tooManyReq={tooManyReqJobs}
								isErrorJobs={isErrorJobs}
								rates={rates}
							/>
						),
					},
				]}
				tabListClassName="!justify-start gap-4 px-5 !border-t border-green-lighter top-[131px] !z-30 fixed !border-l-0 !border-r-0 !bg-white !text-white"
				tabTriggerClassName="px-2 text-title radix-state-active:text-title radix-state-active:border-green-lighter"
				tabContentContainerClassName="mt-[60px]"
			/>
		</div>
	);
};
