"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { PageEmpty } from "@/components/common/page-empty";
import { useInviteTalentToJob } from "@/lib/api/job";
import { type CollectionProps } from "@/lib/types/collection";

interface JobListProps {
	jobs: CollectionProps[];
	talentId: string;
	jobId: string;
}

export const JobListButton = ({ jobs, talentId, jobId }: JobListProps): ReactElement | null => {
	const router = useRouter();
	const job = jobs.find((b) => b._id === jobId) as CollectionProps;

	const inviteTalent = useInviteTalentToJob({ talentId, job });
	const escrowPaidJobs = jobs.filter((job) => job.escrowPaid === true);
	const escrowPaidJobIds = escrowPaidJobs.map((job) => job._id);

	if (jobs.length === 0) return <PageEmpty label="Your Created Bounties Will Appear Here" />;

	return (
		<div className="fixed bottom-[64px] flex w-full flex-col gap-4 border-t border-line bg-white px-4 py-4 !shadow-md">
			<p className="self-stretch">
				<span className="text-sm leading-[21px] tracking-tight text-gray-800">
					Clicking continue will allow you to edit and confirm job details before officially inviting talent.
				</span>
			</p>
			<Button
				variant="primary"
				disabled={!jobId}
				onClick={() => {
					if (!jobId) return;
					if (escrowPaidJobIds.includes(jobId)) {
						if (talentId !== "") {
							inviteTalent.mutate(
								{
									jobId,
									talentId,
								},
								{
									onSuccess: () => {
										router.push(`/dashboard`);
									},
								}
							);
						}
					} else {
						router.push(`/jobs/${jobId}/edit/?talent-id=${talentId}`);
					}
				}}
				size="md"
				className="float-end"
				fullWidth
			>
				{inviteTalent.isLoading ? <Spinner /> : "Continue"}
			</Button>
		</div>
	);
};
