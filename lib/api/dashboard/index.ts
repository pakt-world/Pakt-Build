/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type UseMutationResult,
	type UseQueryResult,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
	type UseInfiniteQueryResult,
	QueryKey,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { type DataFeedResponse } from "./types";
import { Roles } from "../../enums";

interface GetFeedsResponse {
	data: DataFeedResponse[] | [];
	limit: number;
	page: number;
	pages: number;
	total: number;
}

interface timelineFetchParams {
	isLoggedIn: boolean;
	page: number;
	limit: number;
	filter: Record<string, unknown>;
	isEnabled?: boolean;
}

async function getTimelineFeeds({ isLoggedIn, page, limit, filter }: timelineFetchParams): Promise<GetFeedsResponse> {
	const res = await axios.get(isLoggedIn ? `/feeds` : `/feeds-public`, {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

export const useGetTimeline4Dashboard = ({
	isLoggedIn,
	page,
	limit,
	filter,
}: timelineFetchParams): UseInfiniteQueryResult<[] | DataFeedResponse[], unknown> => {
	const getQueryKey: QueryKey = [`get-dashboard-timeline_${page}_${limit}`];

	return useInfiniteQuery(
		getQueryKey,
		async ({ pageParam = 1 }) => (await getTimelineFeeds({ isLoggedIn, page: pageParam, limit, filter })).data,
		{
			getNextPageParam: (_, pages) => pages.length + 1,
			cacheTime: 0,
			staleTime: 0,
		}
	);
	// return useQuery({
	//   queryFn: async () => await getTimelineFeeds({ page, limit, filter }),
	//   queryKey: [`get-timeline_${page}_${limit}`],
	//   onError: (error: ApiError) => {
	//     toast.error(error?.response?.data.message || 'An error occurred');
	//   },
	//   onSuccess: (data: GetFeedsResponse) => {
	//     return data;
	//   },
	//   enabled: false,
	// });
};

// ===

interface CreatorData {
	_id: string;
	firstName: string;
	lastName: string;
	score: number;
	profileImage?: { url: string };
	profile?: { bio?: { title: string } };
}

interface GetTimelineResponse {
	data: CreatorData[];
	total: number;
	position: number;
}

interface GetLeaderboardParams {
	isLoggedIn: boolean;
	role?: Roles;
	limit: number;
	scoreMin: number;
	sortBy?: string;
	orderBy?: string;
	profileCompletenessMin: number;
}

async function getLeaderBoard(params: GetLeaderboardParams): Promise<GetTimelineResponse> {
	const reqUrl = params.isLoggedIn ? "/account/user" : "/account-public/user";
	const res = await axios.get(reqUrl, {
		params: {
			// role: params.role,
			limit: params.limit,
			profileCompletenessMin: params.profileCompletenessMin,
			sortBy: params.sortBy,
			orderBy: params.orderBy,
			scoreMin: params.scoreMin,
		},
	});
	return res.data.data;
}

export const useGetLeaderBoard = (params: GetLeaderboardParams): UseQueryResult<GetTimelineResponse, ApiError> => {
	return useQuery({
		queryFn: async () => getLeaderBoard(params),
		queryKey: ["get-leader-board"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data: GetTimelineResponse) => {
			return data;
		},
	});
};

// ===

async function dismissFeed(id: string): Promise<void> {
	const res = await axios.put(`/feeds/${id}/dismiss`);
	return res.data.data;
}

export function useDismissFeed(): UseMutationResult<void, ApiError, string, unknown> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: dismissFeed,
		mutationKey: ["dismiss-feed-by-id"],
		onSuccess: async () => {
			await queryClient.refetchQueries([`get-timeline_1_10`], {
				stale: true,
			});
			toast.success("Feed Dismissed successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// ===

async function dismissAllFeed(): Promise<void> {
	const res = await axios.put(`/feeds/dismiss/all`);
	return res.data.data;
}

export function useDismissAllFeed(): UseMutationResult<void, ApiError, void, unknown> {
	return useMutation({
		mutationFn: dismissAllFeed,
		mutationKey: ["dismiss-all-feed"],
		onSuccess: () => {
			toast.success("All Feeds Dismissed successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
