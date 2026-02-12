import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

export const REDIRECT_STORAGE_KEY = "redirectAfterAuth";

export const clearStoredJobOnLogout = () => {
	localStorage.removeItem(REDIRECT_STORAGE_KEY);
};

/**
 * Hook: `useViewModeRedirect`
 *
 * Redirects users between authenticated and unauthenticated views based on their authentication status.
 *
 * - **Authenticated users** are redirected from:
 *   - `/view-job/:id` → `/jobs/:id`
 *   - `/view-talent/:id` → `/talents/:id`
 *
 * - **Unauthenticated users** are redirected from:
 *   - `/jobs/:id` → `/view-job/:id`
 *   - `/talents/:id` → `/view-talent/:id`
 *
 *  - **Stores the last viewed job** in `localStorage` (`REDIRECT_STORAGE_KEY`)
 *   to enable redirecting back after login.
 *
 * Dependencies:
 * - Uses `next/navigation` for routing.
 * - Requires `cookies-next` to access authentication cookies.
 */
export const useViewModeRedirect = () => {
	const token = getCookie(AUTH_TOKEN_KEY);
	const pathname = usePathname();
	const router = useRouter();

	const regexMatch = (regex: RegExp) => pathname.match(regex)?.[1] ?? null;

	const jobId = regexMatch(/^\/jobs\/([^/]+)$/);
	const viewJobId = regexMatch(/^\/view-job\/([^/]+)\/?/);
	const talentId = regexMatch(/^\/talents\/([^/]+)$/);
	const viewTalentId = regexMatch(/^\/view-talent\/([^/]+)\/?/);

	useEffect(() => {
		// Store the last viewed job for post-login redirection
		if (viewJobId) {
			localStorage.setItem(REDIRECT_STORAGE_KEY, `/jobs/${viewJobId}`);
		}

		// Handle authentication-based redirection
		if (token) {
			// If authenticated, move from "view" to main routes
			if (viewJobId) router.replace(`/jobs/${viewJobId}`);
			if (viewTalentId) router.replace(`/talents/${viewTalentId}`);
		} else {
			// If not authenticated, move to "view" routes
			if (jobId) router.replace(`/view-job/${jobId}`);
			if (talentId) router.replace(`/view-talent/${talentId}`);
		}
	}, [token, jobId, viewJobId, talentId, viewTalentId, router]);
};
