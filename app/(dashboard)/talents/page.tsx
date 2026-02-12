"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentsMobileView } from "@/widgets/talents/mobile";
import { TalentsDesktopView } from "@/widgets/talents/desktop";

export default function TalentsPage() {
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();

	if (!isClient) return null;

	return tab ? <TalentsDesktopView /> : <TalentsMobileView />;
}
