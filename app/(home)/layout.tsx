"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, type ReactNode } from "react";
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useViewportHeight } from "@/hooks/use-viewport-height";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { usePublicExchangeRate } from "@/lib/api/wallet";
import { BrandLoader } from "@/components/common/brand-loader";
import { AuthEnums } from "@/lib/enums";
import { useGetSetting } from "@/lib/api/setting";
import DesktopHomeLayout from "@/widgets/home/desktop/layout";
import MobileHomeLayout from "@/widgets/home/mobile/layout";

export default function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const token = getCookie(AUTH_TOKEN_KEY);
	const isMobile = useMediaQuery("(max-width: 640px)");

	// === Get Exchange Rate === //
	const { isFetched: rateFetched, isFetching: rateFetching } = usePublicExchangeRate({
		enable: true,
	});

	/// === Get System Settings === //
	const { isFetched: settingsFetched, isFetching: settingsFetching } = useGetSetting({
		enable: true,
	});

	useEffect(() => {
		if (token && pathname !== `/?auth=${AuthEnums.VERIFY_SIGNUP_SUCCESS}`) {
			router.push("/dashboard");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	useViewportHeight();

	// Show loading indicator if fetching data
	if ((!rateFetched && rateFetching) || (!settingsFetched && settingsFetching)) {
		return <BrandLoader />;
	}

	if (isMobile) {
		return <MobileHomeLayout>{children}</MobileHomeLayout>;
	}

	return <DesktopHomeLayout>{children}</DesktopHomeLayout>;
}
