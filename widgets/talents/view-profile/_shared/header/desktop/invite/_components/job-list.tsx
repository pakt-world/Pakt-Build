"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { JobCard } from "./job-card";
import { CollectionProps } from "@/lib/types/collection";
import { Button } from "@/components/common/button";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { useInviteTalentToJob } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";

interface JobListProps {
	jobs: CollectionProps[];
	talentId: string;
	setIsOpen: (value: boolean) => void;
	rates: ExchangeRateRecord | undefined;
}

export const JobList = ({ jobs, talentId, setIsOpen, rates }: JobListProps): JSX.Element | null => {
	const router = useRouter();
	const [jobId, setJobId] = useState<string | null>(null);

	const job = jobs.find((b) => b._id === jobId) as CollectionProps;

	const inviteTalent = useInviteTalentToJob({ talentId, job });

	const escrowPaidJobs = jobs.filter((job) => job.escrowPaid === true);
	const escrowPaidJobIds = escrowPaidJobs.map((job) => job._id);

	return (
		<div className="flex h-full flex-col sm:gap-2">
			<div className="border-b-2 border-[#9BDCFD] bg-primary-gradient-light p-4 text-white">
				<button
					className="flex items-center gap-2"
					onClick={() => {
						setIsOpen(false);
					}}
					type="button"
				>
					<ChevronLeft size={24} strokeWidth={2} />
					<h2 className="text-2xl font-bold">Invite Talent</h2>
				</button>
			</div>
			<div className="relative flex items-center overflow-hidden px-4 py-1 max-sm:h-[48px]">
				<p className="text-xl font-bold max-sm:text-black">Select job to assign talent to</p>
			</div>
			<div className="flex grow flex-col overflow-y-auto sm:gap-4 sm:px-4">
				{jobs.map((job) => {
					return (
						<JobCard
							job={job}
							key={job._id}
							isSelected={jobId === job._id}
							setJobId={setJobId}
							rates={rates}
						/>
					);
				})}
			</div>
			<div className="flex h-fit w-full flex-col items-end justify-center gap-4 bg-[#F5F5F5] p-4 shadow-2xl">
				<Button
					variant="primary"
					size="md"
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
					fullWidth
				>
					{inviteTalent.isLoading ? <Spinner /> : "Continue"}
				</Button>
			</div>
		</div>
	);
};
