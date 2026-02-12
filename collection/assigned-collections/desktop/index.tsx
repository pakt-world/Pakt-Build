"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { useGetJobsInfinitely } from "@/lib/api/job";
import { TalentOngoingJobs } from "./tabs/talent-ongoing-jobs";
import { TalentCompletedJobs } from "./tabs/talent-completed-jobs";
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";

export const AssignedJobs4Desktop = (): JSX.Element => {
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
		<div className="flex h-full flex-col gap-6">
			<Tabs
				urlKey="client-jobs"
				tabs={[
					{
						label: "Ongoing",
						value: "ongoing",
						content: (
							<TalentOngoingJobs
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
							<TalentCompletedJobs
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
			/>
		</div>
	);
};
