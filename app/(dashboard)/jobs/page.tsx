"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import JobsDesktopView from "@/widgets/jobs/desktop";
import JobsMobileView from "@/widgets/jobs/mobile";

export default function JobsPage() {
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();

	if (!isClient) return null;

	return tab ? <JobsDesktopView /> : <JobsMobileView />;
}
