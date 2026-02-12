"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById, useGetJobsInfinitely } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { useExchangeRateStore } from "@/lib/store/misc";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import { CollectionProps } from "@/lib/types/collection";
import { useUserState } from "@/lib/store/account";
import { DesktopApplicantView } from "@/collection/collection-applicants/desktop";
import { CollectionApplicantView4Mobile } from "@/collection/collection-applicants/mobile";

interface Props {
	params: {
		"job-id": string;
	};
}

export default function JobApplications({ params }: Props): JSX.Element {
	const jobId = params["job-id"];

	const isMobile = useMediaQuery("(max-width: 640px)");

	const { user } = useUserState();
	const { _id } = user ?? {};

	const { data: rates } = useExchangeRateStore();

	// Fetch data
	const jobData = useGetJobById({ jobId });
	const jobApplications = useGetJobsInfinitely({
		limit: 4,
		parent: jobData.data?._id,
		type: CollectionTypes.APPLICATION,
		status: CollectionStatus.PENDING,
	});
	const jobAcceptedInvites = useGetJobsInfinitely({
		limit: 4,
		parent: jobData.data?._id,
		status: [CollectionStatus.ONGOING, CollectionStatus.COMPLETED],
	});
	// Fetch data

	if (jobData.isLoading || rates === undefined || jobApplications.isLoading || jobAcceptedInvites.isLoading)
		return <PageLoading className="absolute inset-0" color="#3055B3" />;

	const job = jobData.data as CollectionProps;

	// Rates in real time
	const realTimeRate = rates?.[job.meta.coin?.reference] ?? 0;

	const userIsClient = _id === job?.creator?._id;

	if (!userIsClient) return <PageError className="absolute inset-0" />;

	if (isMobile) {
		return (
			<CollectionApplicantView4Mobile
				job={job}
				jobApplications={jobApplications}
				jobAcceptedInvites={jobAcceptedInvites}
				realTimeRate={realTimeRate}
			/>
		);
	}

	return (
		<DesktopApplicantView
			job={job}
			jobApplications={jobApplications}
			jobAcceptedInvites={jobAcceptedInvites}
			realTimeRate={realTimeRate}
		/>
	);
}
