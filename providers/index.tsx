"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMediaQuery, useIsClient } from "usehooks-ts";
import { GoogleOAuthProvider } from "@react-oauth/google";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { MobileProvider } from "@/providers/mobile-context-provider";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { useBodyOverflow } from "@/hooks/use-body-overflow";
import { useViewModeRedirect } from "@/hooks/use-view-mode-redirect";
import LoadSettingsProvider from "./settings";
import { useSettingState } from "@/lib/store/settings";

interface Props {
	children: ReactNode;
}

export function Providers({ children }: Props) {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const settings = useSettingState((state) => state.settings);

	const isClient = useIsClient();

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						retryDelay: 10000,
					},
				},
			})
	);

	useViewModeRedirect();
	useViewportHeight();
	useBodyOverflow();

	if (isClient) {
		return (
			<QueryClientProvider client={queryClient}>
				<LoadSettingsProvider>
					<GoogleOAuthProvider clientId={settings?.google_oauth_client_id_front_end as string}>
						<MobileProvider>{children}</MobileProvider>
					</GoogleOAuthProvider>
				</LoadSettingsProvider>
				{!isMobile && <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />}
			</QueryClientProvider>
		);
	}

	return null;
}
