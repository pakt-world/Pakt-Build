/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { type CollectionProps } from "@/lib/types/collection";
import { ApplicantCard } from "../misc/card";
import { Button } from "@/components/common/button";
import { TalentProfile } from "@/components/common/talent-profile-image";

interface AppliedApplicantProps {
	job: CollectionProps;
	jobApplications: CollectionProps[];
	skillFilters: string[];
	tooManyReq: boolean;
	isFetchingNextPage: boolean;
}

export const Applied = forwardRef<HTMLDivElement, AppliedApplicantProps>(
	({ job, jobApplications, skillFilters, tooManyReq, isFetchingNextPage }: AppliedApplicantProps, ref) => {
		const router = useRouter();
		const skills = job.tagsData.join(", ");
		const { invite } = job;
		const hasInvite = invite !== undefined && invite !== null;

		return (
			<div className="flex h-full grow flex-col gap-4 overflow-y-auto">
				{hasInvite && skillFilters.length === 0 && (
					<div
						aria-live="polite"
						aria-busy="true"
						className="flex h-[60vh] w-full items-center justify-center rounded-2xl bg-white"
					>
						<div className="flex flex-col items-center">
							<div className="flex w-full max-w-[250px] items-center justify-center">
								<TalentProfile
									size="lg"
									score={invite.receiver.score}
									src={invite.receiver.profileImage?.url}
									url={`/talents/${invite.receiver._id}`}
								/>
							</div>
							<span className="max-w-md text-center text-lg text-body">
								Job has been assigned to{" "}
								<Link className="text-primary" href={`/talents/${invite?.receiver?._id}`}>
									{invite?.receiver?.firstName}
								</Link>
							</span>
							<div className="mt-4 flex w-full items-center justify-center">
								<Button
									className="w-4/5"
									size="lg"
									variant="primary"
									onClick={() => {
										router.push(`/jobs?jobs-type=assigned`);
									}}
								>
									View Updates
								</Button>
							</div>
						</div>
					</div>
				)}
				{!hasInvite && jobApplications.length === 0 && skillFilters.length === 0 && (
					<PageEmpty className="h-[60vh] rounded-2xl" label="No applicants yet">
						<div className="mt-4 flex w-full items-center justify-center">
							<Button
								className="w-4/5"
								size="lg"
								variant="primary"
								onClick={() => {
									router.push(`/talents${skills ? `?skills=${skills}` : ""}`);
								}}
							>
								Find Talent
							</Button>
						</div>
					</PageEmpty>
				)}

				{jobApplications.length === 0 && skillFilters.length > 0 && (
					<PageEmpty
						className="h-[60vh] rounded-2xl"
						label="No talent matches the criteria, try changing your filter"
					/>
				)}
				{!hasInvite && jobApplications.length > 0 && (
					<div className="flex flex-col gap-4 overflow-y-auto p-2">
						{jobApplications.map((applicant) => (
							<ApplicantCard
								key={applicant?.creator?._id}
								talent={applicant?.creator}
								message={applicant?.description}
								job={job}
								bid={applicant?.paymentFee}
							/>
						))}
					</div>
				)}
				{tooManyReq ? (
					<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
						<span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white shadow-md">
							Too Many Requests. Please try again later.
						</span>
					</div>
				) : isFetchingNextPage ? (
					<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
						<Loader size={25} className="animate-spin text-center text-white" />
					</div>
				) : null}
				<div ref={ref} className="!h-4 !w-full" />
			</div>
		);
	}
);

Applied.displayName = "Applied";
