/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { FeedType, Roles } from "../enums";
import { CollectionProps, MetaProps } from "../types/collection";
import { useCreateFeed } from "./feed";
// import Logger from "../utils/logger";
// import { useCreateFeed } from "./feed";

const refetchTime = 60000;

// Get Invites
interface getInviteParams {
	page?: number;
	limit?: number;
	filter?: Record<string, unknown>;
	enable?: boolean;
}

export interface JobInvitesDataProps {
	_id: string;
	name: string;
	isPrivate: boolean;
	escrowPaid: boolean;
	deliveryDate: string;
	description: string;
	paymentFee: number;
	creator: {
		_id: string;
		firstName: string;
		lastName: string;
		score: number;
		profileImage?: {
			url: string;
		};
		profile: {
			bio: {
				title: string;
				description: string;
			};
			talent: {
				tags: string[];
			};
		};
		type: string;
	};
	meta: MetaProps;
	parent: CollectionProps;
	status?: string;
	type?: string;
}

export interface JobInvitesProps {
	status: "pending" | "accepted" | "rejected";
	_id: string;
	createdAt: string;
	data: CollectionProps;
	sender?: {
		_id: string;
		firstName: string;
		lastName: string;
		score: number;
		profileImage?: {
			url: string;
		};
		profile: {
			bio: {
				title: string;
				description: string;
			};
			talent: {
				tags: string[];
			};
		};
		type: Roles;
		role?: Roles;
	};
	receiver?: {
		_id: string;
		firstName: string;
		lastName: string;
		score: number;
		profileImage?: {
			url: string;
		};
		profile: {
			bio: {
				title: string;
				description: string;
			};
			talent: {
				tags: string[];
			};
		};
		type: Roles;
		role?: Roles;
	};
}

interface GetInviteResponse {
	data: JobInvitesProps[];
	page: number;
	limit: number;
	total: number;
	pages: number;
}

async function getInvites({ page = 1, limit = 10, filter }: getInviteParams): Promise<GetInviteResponse> {
	const res = await axios.get("/invite", {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

export const useGetInvites = ({
	page,
	limit,
	filter,
	enable,
}: getInviteParams): UseQueryResult<GetInviteResponse, ApiError> => {
	return useQuery({
		queryFn: async () => getInvites({ page, limit, filter }),
		queryKey: [`get_invites_${page}_${limit}_${JSON.stringify(filter)}`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchInterval: refetchTime,
		refetchOnWindowFocus: false,
		enabled: enable,
	});
};

// Accept Invite

interface AcceptInviteResponse {
	meta: string;
	message: string;
}

async function acceptInvite({ id }: { id: string }): Promise<AcceptInviteResponse> {
	const res = await axios.post(`/invite/${id}/accept`);
	return res.data.data;
}

export function useAcceptInvite({
	jobId,
	jobCreatorId,
	isPrivate,
}: {
	jobId: string;
	jobCreatorId: string;
	isPrivate: boolean;
}): UseMutationResult<AcceptInviteResponse, ApiError, { id: string }> {
	const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: acceptInvite,
		mutationKey: ["accept-private-job-invite"],
		onSuccess: () => {
			if (jobCreatorId) {
				// create feed for accept invite
				createFeed.mutate({
					title: "Invite Accepted",
					description: "Invite Accepted",
					data: jobId,
					type: FeedType.JOB_INVITATION_ACCEPTED,
					isPublic: !isPrivate,
					owners: [jobCreatorId],
				});
			}
			toast.success("Invite Accepted successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Decline Invite

interface DeclineInviteResponse {
	meta: string;
	message: string;
}

async function declineInvite({ id }: { id: string }): Promise<DeclineInviteResponse> {
	const res = await axios.post(`/invite/${id}/decline`);
	return res.data.data;
}

// interface DeclineInviteParams {
//     JobCreator: string;
//     jobId: string;
// }

// export function useDeclineInvite({ jobCreator, jobId }: DeclineInviteParams): UseMutationResult<
//     DeclineInviteResponse,
//     ApiError,
//     {
//         id: string;
//     },
//     unknown
// > {
export function useDeclineInvite({
	jobId,
	jobCreatorId,
	isPrivate,
}: {
	jobId: string;
	jobCreatorId: string;
	isPrivate: boolean;
}): UseMutationResult<DeclineInviteResponse, ApiError, { id: string }, unknown> {
	const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: declineInvite,
		mutationKey: ["decline-private-job-invite"],
		onSuccess: () => {
			// create feed for decline invite
			createFeed.mutate({
				owners: [jobCreatorId],
				title: "Invite Declined",
				description: "Invite Declined",
				data: jobId,
				type: FeedType.JOB_INVITATION_DECLINED,
				isPublic: !isPrivate,
			});
			toast.success("Invite Declined successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
