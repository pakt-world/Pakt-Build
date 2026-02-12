/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { axios } from "@/lib/axios";
import Logger from "@/lib/utils/logger";

interface UseSetTokenProps {
	token: string | undefined | null;
	setIsTokenSet: (isTokenSet: boolean) => void;
}

export const useSetToken = ({ token, setIsTokenSet }: UseSetTokenProps): void => {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (token !== undefined && token !== null && token !== "") {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
			setIsTokenSet(true);
		} else {
			if (!pathname.match(/^\/talents\/\w+/) && !pathname.match(/^\/jobs\/\w+/) && pathname !== "/") {
				Logger.info("Redirecting to homepage");
				router.push("/");
			}
			delete axios.defaults.headers.common.Authorization;
		}
		return () => {
			// axios.defaults.headers.common.Authorization = "";
			delete axios.defaults.headers.common.Authorization;
		};
	}, [router, setIsTokenSet, token, pathname]);
};
