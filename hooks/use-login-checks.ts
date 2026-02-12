"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { getBoolean } from "@/lib/utils";
import { useOnboardingActionState } from "@/lib/store/onboarding";
import { AuthEnums } from "@/lib/enums";
// import Logger from "@/lib/utils/logger";

interface userMeta {
	onboarding: boolean;
	acceptedTerms: boolean;
	profileImage: string;
}

export const useLoginChecks = (enableRedirects: boolean, user: string) => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();
	const { setShowOnboardingDialog } = useOnboardingActionState();

	let loggedInUser = null;
	try {
		loggedInUser = user ? JSON.parse(user) : null;
	} catch (error) {
		console.error("Invalid user JSON string:", error);
	}

	const { onboarding, acceptedTerms, profileImage } = (loggedInUser as userMeta) || {};

	const isOnboardingIncomplete = onboarding
		? !getBoolean(onboarding)
		: getBoolean(profileImage === "") || !profileImage;
	const isAcceptedTermsIncomplete = !getBoolean(acceptedTerms);

	useEffect(() => {
		if (enableRedirects) {
			if (isMobile) {
				if (isAcceptedTermsIncomplete) {
					router.push(`/${AuthEnums.TERMS_AND_CONDITIONS}`);
				} else if (isOnboardingIncomplete) {
					router.push(`/${AuthEnums.ONBOARDING}`);
				}
			} else {
				if (isAcceptedTermsIncomplete || isOnboardingIncomplete) {
					setShowOnboardingDialog(true);
				} else {
					setShowOnboardingDialog(false);
				}
			}
		}
	}, [enableRedirects, isAcceptedTermsIncomplete, isOnboardingIncomplete, setShowOnboardingDialog, isMobile, router]);
};
