"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Apply4JobMobile } from "@/collection/apply-for-collection/mobile";
interface Props {
	params: {
		"job-id": string;
	};
}

export default function ApplyToCollectionPage({ params }: Props): JSX.Element {
	const jobId = params["job-id"];
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/jobs/${jobId}`);
		}
	}, [tab, jobId, router]);

	return !tab ? <Apply4JobMobile jobId={jobId} /> : <></>;
}
