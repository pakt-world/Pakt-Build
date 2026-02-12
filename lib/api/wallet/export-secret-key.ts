/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, useMutation } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

interface SecretKeyParams {
	code: string;
	password: string;
}

interface ExportPrivateKeyResponse {
	secretKey: string;
	walletAddress: string;
}

async function postExportPrivateKey(payload: SecretKeyParams): Promise<ExportPrivateKeyResponse> {
	const res = await axios.post(`/wallet/export-secret-key`, payload);
	return res.data.data;
}

export function useExportSecretKey(): UseMutationResult<ExportPrivateKeyResponse, ApiError, SecretKeyParams> {
	return useMutation({
		mutationFn: postExportPrivateKey,
		mutationKey: ["export-private-key"],
		onSuccess: async (data) => {
			return data;
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
