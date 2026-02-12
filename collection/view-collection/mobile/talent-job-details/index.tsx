"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { JobHeader } from "../_components/header";
import { JobDeliverables } from "../_components/deliverables";
import { JobSkills } from "../_components/skills";
import { JobDescription } from "../_components/description";
import { CTAS } from "./footer";
import { CollectionProps } from "@/lib/types/collection";
import { isJobApplicant, isJobDeliverable } from "@/lib/actions/collection";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { AuthEnums, CollectionStatus, JobType } from "@/lib/enums";
import { Button } from "@/components/common/button";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { useExchangeRateStore } from "@/lib/store/misc";

interface TalentJobDetailsProps {
	job: CollectionProps;
	userId: string;
}

export const TalentJobDetails4Mobile: FC<TalentJobDetailsProps> = ({ job, userId }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const inviteId = job?.invite?._id ?? searchParams.get("invite-id");

	const token = getCookie(AUTH_TOKEN_KEY);

	const { data: rates } = useExchangeRateStore();

	const JOB_TYPE: JobType = job.isPrivate ? JobType.PRIVATE : JobType.OPEN;
	const JobCtas = CTAS[JOB_TYPE];

	const jobApplicants = job.collections.filter(isJobApplicant);

	const hasAlreadyApplied = jobApplicants.some((applicant) => applicant.creator._id === userId);
	const hasBeenInvited = Boolean(String(job?.invite?.receiver._id) === String(userId));

	const jobIsAssignedToAnotherTalent = job?.owner != null && job?.owner._id !== userId;
	const jobIsCancelled = job.status === CollectionStatus.CANCELLED;

	// Rates in real time
	const realTimeRate = rates?.[job?.meta?.coin?.reference] ?? 0;

	return (
		<div className="relative flex size-full flex-col">
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: token ? `/jobs?job-type=open` : `/signup`,
					},
					{ label: "Job Details", active: true },
				]}
				className="!fixed left-0 top-[70px] z-10 w-full !bg-[#0E1319]"
			/>
			<div className="mt-[43px] flex w-full flex-1 flex-col overflow-y-auto pb-4">
				<JobHeader
					title={job?.name}
					price={job?.paymentFee ?? 0}
					dueDate={job?.deliveryDate ?? ""}
					creator={{
						_id: job?.creator?._id ?? "",
						score: job?.creator?.score ?? 0,
						avatar: job?.creator?.profileImage?.url,
						name: `${job?.creator?.firstName}`,
						title: job?.creator?.profile?.bio?.title ?? "",
					}}
					meta={job?.meta}
					realTimeRate={realTimeRate}
					isFunded={job?.escrowPaid ?? false}
					paymentRate={job?.rate}
				/>

				<JobSkills skills={job?.tags ?? []} />
				<JobDescription description={job?.description} />
				<JobDeliverables
					deliverables={job?.collections.filter(isJobDeliverable).map((collection) => collection.name)}
				/>

				<div className="relative mt-auto flex w-full flex-col items-center px-5">
					{!token ? (
						<div className="flex w-full items-center justify-center">
							<Button
								variant="primary"
								size="lg"
								onClick={() => {
									router.push(`/${AuthEnums.SIGNUP}`);
								}}
								className="my-4"
								fullWidth
							>
								Apply
							</Button>
						</div>
					) : (
						<>
							{hasAlreadyApplied && !job?.inviteAccepted && !hasBeenInvited && (
								<div className="my-8 flex w-full items-center gap-2 rounded-lg border border-blue-lighter bg-blue-50 p-4 text-blue-500">
									<Info size={24} />
									<span className="text-center text-sm text-body">You have applied to this job</span>
								</div>
							)}

							{!job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
								<JobCtas
									jobId={job?._id}
									inviteId={inviteId}
									hasBeenInvited={hasBeenInvited}
									hasAlreadyApplied={hasAlreadyApplied}
									jobCreatorId={job?.creator?._id}
									isPrivate={job?.isPrivate}
								/>
							)}

							{job?.inviteAccepted && !jobIsAssignedToAnotherTalent && (
								<div className="my-8 flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-500">
									<Info size={24} />
									<span className="text-center text-sm text-green-500">
										You have already accepted this Job invite.
									</span>
								</div>
							)}
							{jobIsCancelled ? (
								<div className="my-8 flex w-full items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
									<div className="flex w-full items-center gap-2">
										<Info size={24} />
										<span className="text-center text-sm text-red-500">
											This job has been cancelled. You can apply to other jobs.
										</span>
									</div>
									<Button
										variant="primary"
										size="md"
										onClick={() => {
											router.push("/jobs");
										}}
										className=""
									>
										See More Jobs
									</Button>
								</div>
							) : jobIsAssignedToAnotherTalent ? (
								<div className="my-8 flex w-full items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
									<Info size={24} />
									<span className="text-left text-sm text-red-500">
										This job is already assigned to another talent. You can apply to other jobs.
									</span>
								</div>
							) : null}
						</>
					)}
				</div>
			</div>
		</div>
	);
};
