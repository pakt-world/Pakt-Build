"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Dashboard4Mobile from "@/widgets/dashboard/mobile";
import Dashboard4Desktop from "@/widgets/dashboard/desktop";

export default function DashboardPage() {
	const isMobile = useMediaQuery("(max-width: 680px)");

	if (isMobile) {
		return <Dashboard4Mobile />;
	}

	return <Dashboard4Desktop />;
}
