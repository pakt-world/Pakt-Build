/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseQueryResult, useQuery } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { useSettingState } from "../store/settings";

export interface SystemSettings {
	maximum_upload_size_site: string;
	pcc_site_url: string;
	stripe_public_key: string;
	wallet_connect_id: string;
	SNOWTRACE_URL: string;
	veriff_url: string;
	telegram_bot_api_url: string;
	telegram_bot_api_key: string;
	public_app_base_url: string;
	clarity_id: string;
	google_tag_id: string;
	tenant_id: string;
	template_id: string;
	temp_authorization_timeout_site: string;
	google_oauth_client_id_front_end: string;
}

async function fetchSystemSettings(): Promise<SystemSettings> {
	const res = await axios.get(`/settings`);
	return res.data.data;
}

export const useGetSetting = ({ enable = false }: { enable: boolean }): UseQueryResult<SystemSettings, ApiError> => {
	const { setSettings } = useSettingState();
	return useQuery({
		queryFn: async () => {
			const response = await fetchSystemSettings();
			return response;
		},
		queryKey: [`get-system-setting`],
		onSuccess: (data: SystemSettings) => {
			setSettings(data);
			return data;
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		enabled: enable,
	});
};
