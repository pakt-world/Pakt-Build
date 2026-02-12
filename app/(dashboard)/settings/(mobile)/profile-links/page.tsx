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

import { ProfileLinks } from "@/widgets/settings/mobile/_components/profile-links";

export default function ProfileLinksPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/settings`);
		}
	}, [router, tab]);

	return !tab ? <ProfileLinks /> : <></>;
}
