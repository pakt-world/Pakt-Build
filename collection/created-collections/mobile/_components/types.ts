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

export interface JobTabProps4Mobile {
	jobs: InfiniteData<GetJobsResponse> | undefined;
	failureReason: ApiError | null;
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	refetch: () => void;
	rates: ExchangeRateRecord | undefined;
}
