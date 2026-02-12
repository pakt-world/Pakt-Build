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

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { useUserState } from "@/lib/store/account";
import { useGetJobById } from "@/lib/api/job";
import { ClientJobSheet4Mobile } from "@/collection/actions/mobile/client";
import { TalentJobSheet4Mobile } from "@/collection/actions/mobile/talent";

interface Props {
	params: {
		"job-id": string;
	};
}

export default function UpdateJobDeliverablePage({ params }: Props): JSX.Element {
	const jobId = params["job-id"];
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();
	const { user } = useUserState();
	const loggedInUser = user?._id;

	const query = useGetJobById({ jobId });

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/jobs/${jobId}`);
		}
	}, [tab, jobId, router]);

	if (query.isError) return <PageError className="absolute inset-0" />;

	if (query.isLoading) return <PageLoading className="absolute inset-0" color="#3055B3" />;

	const job = query.data;

	const clientId = job?.creator._id;
	const isCreator = clientId === loggedInUser;
	const talentId = job?.owner?._id ?? "";

	return !tab ? (
		<div className="relative size-full overflow-hidden">
			{isCreator ? (
				<ClientJobSheet4Mobile
					job={job}
					jobId={jobId}
					talentId={talentId}
					closeMobileSheet={() => {
						router.push("/dashboard");
					}}
				/>
			) : (
				<TalentJobSheet4Mobile
					job={job}
					jobId={jobId}
					talentId={clientId}
					closeMobileSheet={() => {
						router.push("/dashboard");
					}}
				/>
			)}
		</div>
	) : (
		<></>
	);
}
