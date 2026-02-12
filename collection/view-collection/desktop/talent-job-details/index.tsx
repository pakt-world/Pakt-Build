"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Info } from "lucide-react";
import { getCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { JobHeader } from "../_components/header";
import { JobDeliverables } from "../_components/deliverables";
import { JobSkills } from "../_components/skills";
import { JobDescription } from "../_components/description";
import { CTAS } from "./footer";
import { isJobApplicant, isJobDeliverable } from "@/lib/actions/collection";
import { CollectionProps } from "@/lib/types/collection";
import { AuthEnums, CollectionStatus, JobType } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";
import { Button } from "@/components/common/button";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

interface TalentJobDetailsProps {
	job: CollectionProps;
	userId: string;
}

export const DesktopTalentJobDetails: FC<TalentJobDetailsProps> = ({ job, userId }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
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
		<div className="flex h-full gap-6">
			<div className="scrollbar-hide flex h-full w-[867px] grow flex-col overflow-y-auto pb-20">
				<JobHeader
					title={job?.name}
					price={job?.paymentFee}
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

				<div className="flex w-full grow flex-col rounded-b-xl bg-white p-6">
					<JobSkills skills={job?.tags ?? []} />
					<JobDescription description={job?.description} />
					<JobDeliverables
						deliverables={job?.collections.filter(isJobDeliverable).map((collection) => collection.name)}
					/>

					{!token ? (
						// jobIsCancelled ? (
						// 	<div className="my-3 flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
						// 		<div className="flex w-full items-center gap-2">
						// 			<Info size={20} />
						// 			<span className="text-center text-red-500">
						// 				This job has been cancelled. You can apply to other jobs.
						// 			</span>
						// 		</div>
						// 		<Button
						// 			variant="primary"
						// 			size="lg"
						// 			onClick={() => {
						// 				router.push(`/?auth=${AuthEnums.SIGNUP}`);
						// 			}}
						// 			className=""
						// 		>
						// 			See More Jobs
						// 		</Button>
						// 	</div>
						// ) : jobIsAssignedToAnotherTalent ? (
						// 	<div className="my-3 flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
						// 		<div className="flex w-full items-center gap-2">
						// 			<Info size={20} />
						// 			<span className="text-center text-red-500">
						// 				This job is already assigned to another talent. You can apply to other jobs.
						// 			</span>
						// 		</div>
						// 		<Button
						// 			variant="primary"
						// 			size="lg"
						// 			onClick={() => {
						// 				router.push(`/?auth=${AuthEnums.SIGNUP}`);
						// 			}}
						// 			className=""
						// 		>
						// 			See More Jobs
						// 		</Button>
						// 	</div>
						// ) : (
						<div className="flex w-full items-center justify-end">
							<Button
								variant="primary"
								size="lg"
								onClick={() => {
									router.replace(`/?auth=${AuthEnums.SIGNUP}`);
								}}
								className=""
							>
								Apply
							</Button>
						</div>
					) : (
						// )
						<>
							{hasAlreadyApplied && !job?.inviteAccepted && !hasBeenInvited && (
								<div className="my-3 flex w-full items-center gap-2 rounded-lg border border-blue-lighter bg-blue-50 p-4 text-blue-500">
									<Info size={20} />
									<span className="text-center text-body">You have applied to this job</span>
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

							{job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
								<div className="my-3 flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-500">
									<Info size={20} />
									<span className="text-center text-green-500">
										You have already accepted this Job invite.
									</span>
								</div>
							)}

							{jobIsCancelled ? (
								<div className="my-3 flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
									<div className="flex w-full items-center gap-2">
										<Info size={20} />
										<span className="text-center text-red-500">
											This job has been cancelled. You can apply to other jobs.
										</span>
									</div>
									<Button
										variant="primary"
										size="lg"
										onClick={() => {
											router.push("/jobs");
										}}
										className=""
									>
										See More Jobs
									</Button>
								</div>
							) : jobIsAssignedToAnotherTalent ? (
								<div className="my-3 flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
									<div className="flex w-full items-center gap-2">
										<Info size={20} />
										<span className="text-center text-red-500">
											This job is already assigned to another talent. You can apply to other jobs.
										</span>
									</div>
									<Button
										variant="primary"
										size="lg"
										onClick={() => {
											router.push("/jobs");
										}}
										className=""
									>
										See More Jobs
									</Button>
								</div>
							) : null}
						</>
					)}
				</div>
			</div>

			<div className="flex h-full w-fit basis-[270px] flex-col items-center gap-7" />
		</div>
	);
};
