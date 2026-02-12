"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { DesktopSettingsView } from "@/widgets/settings/desktop";
import MobileSettingsView from "@/widgets/settings/mobile";

export default function SettingsPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? <DesktopSettingsView /> : <MobileSettingsView />;
}
