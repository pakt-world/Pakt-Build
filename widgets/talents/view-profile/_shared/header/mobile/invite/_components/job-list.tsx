"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";

import { JobCard } from "./job-card";
import { JobListButton } from "./job-list-button";

interface JobListProps {
	jobs: CollectionProps[];
	talentId: string;
	rates: ExchangeRateRecord | undefined;
}

export const JobList = ({ jobs, talentId, rates }: JobListProps): ReactElement | null => {
	const router = useRouter();
	const [jobId, setJobId] = useState<string>("");

	if (jobs.length === 0) return <PageEmpty label="Your Created Bounties Will Appear Here" />;

	return (
		<div className="relative flex w-full flex-col overflow-y-auto bg-white">
			<div className="fixed top-[70px] z-10 flex w-full flex-col">
				<div className="flex-none border-y border-green-lighter bg-white p-4 text-title">
					<div
						className="flex cursor-pointer items-center gap-2"
						onClick={() => {
							setJobId("");
							router.back();
						}}
						onKeyDown={() => {}}
						aria-label="Go Back"
						role="button"
						tabIndex={0}
					>
						<ChevronLeft size={24} strokeWidth={2} />
						<h2 className="text-lg font-medium">Invite to Job</h2>
					</div>
				</div>
				<div className="bg-blue-lightest/50 p-2 px-4">
					<p className="text-lg font-bold text-title">Select Job to assign talent to</p>
				</div>
			</div>
			<div
				className={`scrollbar-hide relative mt-[105px] flex w-full flex-1 flex-col overflow-y-auto
					${jobId !== "" ? "mb-[200px]" : jobs.length > 2 ? "mb-[64px]" : ""}`}
			>
				{jobs.map((j: CollectionProps) => {
					return (
						<JobCard job={j} key={j._id} isSelected={jobId === j._id} setJobId={setJobId} rates={rates} />
					);
				})}
			</div>
			{jobId !== "" && <JobListButton jobId={jobId} jobs={jobs} talentId={talentId} />}
		</div>
	);
};
