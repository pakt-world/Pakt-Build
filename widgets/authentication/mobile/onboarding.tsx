"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { deleteCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { VERIFY_SIGNUP_KEY } from "@/lib/utils";
import { UploadImage } from "../_shared/upload-image";

export default function OnboardingPage(): JSX.Element {
	useEffect(() => {
		deleteCookie(VERIFY_SIGNUP_KEY);
	}, []);

	return <UploadImage isOnboarding />;
}
