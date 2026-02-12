"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery, useIsClient } from "usehooks-ts";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { CollectionProps } from "@/lib/types/collection";
import { useExchangeRateStore } from "@/lib/store/misc";
import { useUserState } from "@/lib/store/account";
import { DesktopClientJobDetails } from "@/collection/view-collection/desktop/client-job-details";
import { DesktopTalentJobDetails } from "@/collection/view-collection/desktop/talent-job-details";
import { TalentJobDetails4Mobile } from "@/collection/view-collection/mobile/talent-job-details";
import { ClientJobDetails4Mobile } from "@/collection/view-collection/mobile/client-job-details";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

interface Props {
	params: {
		"public-jobId": string;
	};
}

export default function JobDetailsPage({ params }: Props): JSX.Element {
	const jobId = params["public-jobId"];
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();
	const token = getCookie(AUTH_TOKEN_KEY);

	const { user } = useUserState();
	const { _id } = user ?? { _id: "" };

	const { data: rates } = useExchangeRateStore();
	const jobQuery = useGetJobById({ jobId });
	const { data: job } = jobQuery;

	const USER_ROLE: "client" | "talent" = token ? (_id === job?.creator._id ? "client" : "talent") : "talent";

	const VIEWS = {
		client: tab ? DesktopClientJobDetails : ClientJobDetails4Mobile,
		talent: tab ? DesktopTalentJobDetails : TalentJobDetails4Mobile,
	};

	const CurrentView = token ? VIEWS[USER_ROLE] : tab ? DesktopTalentJobDetails : TalentJobDetails4Mobile;

	return (
		<div className="relative flex w-full flex-col sm:grow sm:overflow-hidden xl:px-4 2xl:px-8">
			{jobQuery.isError ? (
				<PageError className="absolute inset-0" />
			) : jobQuery.isLoading ? (
				<PageLoading className="absolute inset-0" color="#3055B3" />
			) : (
				isClient && <CurrentView job={job as CollectionProps} rates={rates} userId={_id} />
			)}
		</div>
	);
}
