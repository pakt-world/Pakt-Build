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
import { ProfessionalInfo } from "@/widgets/settings/mobile/_components/professional-info";

export default function ProfessionalInfoPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/settings`);
		}
	}, [router, tab]);

	return !tab ? <ProfessionalInfo /> : <></>;
}
