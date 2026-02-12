"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useEffect, type ReactNode } from "react";
import { clarity } from "react-microsoft-clarity";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetSetting } from "@/lib/api/setting";
import { useSettingState } from "@/lib/store/settings";
import Logger from "@/lib/utils/logger";
import { BrandLoader } from "@/components/common/brand-loader";
import { TrackingCodes } from "@/components/common/tracking-codes";
import { useErrorLogger } from "@/hooks/use-error-logger";

function LoadSettingsProvider({ children }: { children: ReactNode }): JSX.Element {
	// === Get System Settings === //
	const { isFetched: settingsFetched, isFetching: settingsFetching } = useGetSetting({
		enable: true,
	});

	const settings = useSettingState((state) => state.settings);

	useErrorLogger();

	useEffect(() => {
		if (settings?.clarity_id) {
			clarity.init(settings?.clarity_id);
			Logger.warn(`Clarity initiated..`);
		} else {
			Logger.warn(`Clarity not initiated..`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Show loading indicator if fetching data
	if (!settingsFetched && settingsFetching) {
		return <BrandLoader />;
	}

	return (
		<>
			<TrackingCodes />
			{children}
		</>
	);
}

export default LoadSettingsProvider;
