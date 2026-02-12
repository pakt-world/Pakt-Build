"use client";

import { useSettingState } from "@/lib/store/settings";

export function TrackingCodes() {
	const settings = useSettingState((state) => state.settings);
	const google_tag_id = settings?.google_tag_id;
	return (
		<>
			<script async src={`https://www.googletagmanager.com/gtag/js?id=${google_tag_id}`}></script>
			<script async>
				{`window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());

				gtag('config', '${google_tag_id}');`}
			</script>
		</>
	);
}
