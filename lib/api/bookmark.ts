/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type UseMutationResult,
	type UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { SavedCollectionProps } from "../types/collection";

interface GetBookMarkResponse {
	data: SavedCollectionProps[];
	page: number;
	limit: number;
}

interface timelineFetchParams {
	page: number;
	limit: number;
	filter: Record<string, unknown>;
	enable?: boolean;
}

async function getBookmarks({ page, limit, filter }: timelineFetchParams): Promise<GetBookMarkResponse> {
	const res = await axios.get(`/bookmark`, {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

export const useGetBookmarks = ({
	page,
	limit,
	filter,
	enable,
}: timelineFetchParams): UseQueryResult<GetBookMarkResponse, ApiError> => {
	return useQuery({
		queryFn: async () => getBookmarks({ page, limit, filter }),
		queryKey: [`get-bookmark_req_${page}`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data: GetBookMarkResponse) => {
			return data;
		},
		enabled: enable,
	});
};

// ===

interface AddToBookmarkParams {
	reference: string;
	type: string;
}

async function addToBookmark({ reference, type }: AddToBookmarkParams): Promise<AddToBookmarkParams> {
	const res = await axios.post(`/bookmark`, { reference, type });
	return res.data.data;
}

export function useSaveToBookmark(
	callBack?: () => void
): UseMutationResult<AddToBookmarkParams, ApiError, AddToBookmarkParams, unknown> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addToBookmark,
		mutationKey: ["save-bookmark"],
		onSuccess: async () => {
			await Promise.all([
				queryClient.refetchQueries([`get-bookmark_req_1`]),
				queryClient.refetchQueries(["get-timeline"]),
				callBack?.(),
			]);
			toast.success("Saved to bookmark successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// ===

interface BookmarkParams {
	id: string;
	// add other properties here if needed
}

async function removeFromBookmark({ id }: BookmarkParams): Promise<BookmarkParams> {
	const res = await axios.delete(`/bookmark/${id}`);
	return res.data.data;
}

export function useRemoveFromBookmark(
	callBack?: () => void
): UseMutationResult<BookmarkParams, ApiError, BookmarkParams, unknown> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: removeFromBookmark,
		mutationKey: ["removeFromBookmark"],
		onSuccess: async () => {
			await Promise.all([
				queryClient.refetchQueries([`get-bookmark_req_1`]),
				queryClient.refetchQueries(["get-timeline"]),
				callBack?.(),
			]);
			toast.success("Removed From bookmark successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
