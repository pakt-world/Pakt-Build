/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

// import Logger from "@/lib/utils/logger";

export const useGetParams = (key: string): string => {
	const searchParams = useSearchParams();
	const value = searchParams.get(key) || "";

	// Logger.info("params===>>>", { auth: value });

	return value;
};
