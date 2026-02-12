/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

interface GetReferrals {
	data: ReferralData[];
	limit: number;
	pages: number;
	total: number;
}

interface ReferralData {
	referral: {
		_id: string;
		firstName: string;
		lastName: string;
		profile: {
			bio: {
				title: string;
			};
		};
		score: number;
		profileImage: {
			url: string;
		};
	};
	createdAt: string;
}

interface GetReferralStat {
	referralLink: string;
	totalAllowedInvites: number;
	inviteSent: number;
	duration?: string;
}

interface FetchParams {
	page: number;
	limit: number;
	filter: Record<string, unknown>;
}

interface SendReferralInviteParams {
	emails: string[];
}

interface ReferralResponse {
	referrals: GetReferrals;
	stats: GetReferralStat;
}

async function fetchReferrals({ limit, page }: FetchParams): Promise<GetReferrals> {
	const res = await axios.get(`/referrals?limit=${limit}&page=${page}`);
	return res.data.data;
}

async function fetchReferralStats(): Promise<GetReferralStat> {
	const res = await axios.get("/referrals/stats");
	return res.data.data;
}

async function postReferralInvite(values: SendReferralInviteParams): Promise<SendReferralInviteParams> {
	const res = await axios.post("/referrals/invite", values);
	return res.data.data;
}

async function validateReferral({ token }: { token: string }): Promise<{ success: boolean }> {
	const res = await axios.post("/auth/referral/validate", { token });
	return res.data.data;
}

export const useGetReferral = ({ page, limit, filter }: FetchParams): UseQueryResult<ReferralResponse, ApiError> => {
	return useQuery({
		queryFn: async () => {
			const response = await Promise.all([fetchReferrals({ page, limit, filter }), fetchReferralStats()]);
			return { referrals: response[0], stats: response[1] };
		},
		queryKey: [`get-bookmark_req_${page}`, filter],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data: ReferralResponse) => {
			return data;
		},
	});
};

export function useSendReferralInvite(): UseMutationResult<
	SendReferralInviteParams,
	ApiError,
	SendReferralInviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postReferralInvite,
		mutationKey: ["send_referral_invite"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

export function useValidateReferral(): UseMutationResult<{ success: boolean }, ApiError, { token: string }, unknown> {
	return useMutation({
		mutationFn: validateReferral,
		mutationKey: ["validateReferral"],
	});
}
