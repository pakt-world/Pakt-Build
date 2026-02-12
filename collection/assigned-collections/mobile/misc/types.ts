/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { InfiniteData } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { GetJobsResponse } from "@/lib/api/job";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { ApiError } from "@/lib/axios";

export interface AssignedJobTabProps4Mobile {
	jobs: InfiniteData<GetJobsResponse> | undefined;
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	refetch: () => void;
	error: ApiError | null;
	tooManyReq?: boolean;
	isErrorJobs: boolean;
	rates: ExchangeRateRecord | undefined;
}
