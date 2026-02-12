"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Logger from "@/lib/utils/logger";

const ScrollToTopOnRouteChange = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	Logger.info("Rendering");
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return <>{children}</>;
};

export default ScrollToTopOnRouteChange;
