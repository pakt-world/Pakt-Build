"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type ReactElement } from "react";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useCancelJobInvite } from "@/lib/api/job";
import { JobHeader } from "../_components/header";
import { JobDeliverables } from "../_components/deliverables";
import { JobSkills } from "../_components/skills";
import { JobDescription } from "../_components/description";
import { CTAS } from "./footer";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionInviteStatus, CollectionStatus, JobType } from "@/lib/enums";
import { isJobApplicant, isJobDeliverable } from "@/lib/actions/collection";
import { Button } from "@/components/common/button";

interface ClientJobDetails4MobileProps {
	job: CollectionProps;
	rates: ExchangeRateRecord | undefined;
}

export function ClientJobDetails4Mobile({ rates, job }: ClientJobDetails4MobileProps): ReactElement {
	const router = useRouter();
	const cancelInvite = useCancelJobInvite();

	const JOB_TYPE: JobType = job.isPrivate ? JobType.PRIVATE : JobType.OPEN;
	const JobCtas = CTAS[JOB_TYPE];
	// Rates in real time
	const realTimeRate = rates?.[job.meta.coin?.reference] ?? 0;
	const canStillCancelInvite = job.invite != null && job?.invite.status === CollectionInviteStatus.PENDING;
	const inviteNotYetAccepted = job.invite != null && job?.invite.status !== CollectionInviteStatus.ACCEPTED;
	const applicants = job.collections.filter(isJobApplicant);
	const jobIsCancelled = job.status === CollectionStatus.CANCELLED;

	return (
		<div className="relative flex size-full flex-col">
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/jobs?jobs-type=open",
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
						_id: job?.owner?._id ?? "",
						score: job?.owner?.score ?? 0,
						avatar: job?.owner?.profileImage?.url,
						name: `${job?.owner?.firstName}`,
						title: job?.owner?.profile?.bio?.title ?? "",
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

				<div className="relative mt-auto flex w-full flex-col gap-4 px-4">
					{job.invite == null && !jobIsCancelled && (
						<JobCtas
							jobId={job?._id}
							skills={job?.tagsData}
							deletePage={() => {
								router.push(`/jobs/${job?._id}/delete`);
							}}
							applicants={applicants}
						/>
					)}
					{jobIsCancelled ? (
						<div className="my-3 flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
							<div className="flex w-full items-center gap-2">
								<Info size={20} />
								<span className="text-center text-red-500">This job has been cancelled.</span>
							</div>
							<Button
								variant="primary"
								size="lg"
								onClick={() => {
									router.push("/jobs/create");
								}}
								className=""
							>
								Create New Job
							</Button>
						</div>
					) : job.status === CollectionStatus.COMPLETED ? (
						<div className="my-3 flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-500">
							<Info size={20} />
							<span className="text-center text-green-500">This job has been completed.</span>
						</div>
					) : inviteNotYetAccepted ||
					  [CollectionStatus.ONGOING, CollectionStatus.WAITING, CollectionStatus.PAYMENT_REQUESTED].includes(
							job.status
					  ) ? (
						<div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-lighter bg-blue-50 p-4 text-blue-500">
							<div className="flex items-center gap-2">
								<Info size={24} />
								{job.status === CollectionStatus.ONGOING ? (
									<span>Job is ongoing</span>
								) : (
									<span>Awaiting Talent Response</span>
								)}
							</div>
							<Button
								variant="destructive"
								className="flex h-[35px] w-[130px] items-center justify-center rounded-lg border border-red-500 bg-red-50 text-sm text-red-500"
								onClick={() => {
									if (canStillCancelInvite) {
										cancelInvite.mutate(
											{
												inviteId: job?.invite?._id ?? "",
											},
											{}
										);
									} else {
										router.push(`/jobs/${job?._id}/updates?status=${CollectionStatus.CANCELLED}`);
									}
								}}
								type="button"
								size="sm"
							>
								{cancelInvite.isLoading ? (
									<Spinner size={16} />
								) : canStillCancelInvite ? (
									"Cancel Invite"
								) : (
									"Cancel Job"
								)}
							</Button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
