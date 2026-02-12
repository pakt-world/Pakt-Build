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

import { DeleteJobMobile } from "@/collection/delete-collection/mobile";

interface Props {
	params: {
		"job-id": string;
	};
}

export default function DeleteCollectionPage({ params }: Props): JSX.Element {
	const jobId = params["job-id"];
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/jobs/${jobId}`);
		}
	}, [tab, jobId, router]);

	return !tab ? <DeleteJobMobile jobId={jobId} /> : <></>;
}
