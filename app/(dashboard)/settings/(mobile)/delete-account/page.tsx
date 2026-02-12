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

import { DeleteAccountMobile } from "@/widgets/settings/mobile/_components/delete-account";

export default function DeleteAccountPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/settings`);
		}
	}, [router, tab]);

	return !tab ? <DeleteAccountMobile /> : <></>;
}
