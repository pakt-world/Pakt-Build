"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useState, type ReactElement } from "react";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useCancelJobInvite } from "@/lib/api/job";
import { Modal } from "@/components/common/headless-modal";
import { JobHeader } from "../_components/header";
import { JobDeliverables } from "../_components/deliverables";
import { JobSkills } from "../_components/skills";
import { JobDescription } from "../_components/description";
import { DeleteJobModal } from "../../../delete-collection/desktop";
import { CTAS } from "./footer";
import { isJobApplicant, isJobDeliverable } from "@/lib/actions/collection";
import { CollectionProps } from "@/lib/types/collection";
import { CollectionInviteStatus, CollectionStatus, JobType } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";
import { ClientJobSheet4Desktop } from "@/collection/actions/desktop/client";
import { Button } from "@/components/common/button";

interface ClientJobDetailsProps {
	job: CollectionProps;
}

export function DesktopClientJobDetails({ job }: ClientJobDetailsProps): ReactElement {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cancelCollection, setCancelCollection] = useState(false);

	const cancelInvite = useCancelJobInvite();
	const { data: rates } = useExchangeRateStore();

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const JOB_TYPE: JobType = job.isPrivate ? JobType.PRIVATE : JobType.OPEN;
	const JobCtas = CTAS[JOB_TYPE];
	// Rates in real time
	const realTimeRate = rates?.[job?.meta?.coin?.reference] ?? 0;
	const canStillCancelInvite = job.invite != null && job.invite.status === CollectionInviteStatus.PENDING;
	const inviteNotYetAccepted = job.invite != null && job.invite.status !== CollectionInviteStatus.ACCEPTED;
	const applicants = job.collections.filter(isJobApplicant);
	const jobIsCancelled = job.status === CollectionStatus.CANCELLED;

	const jobId = job?._id;
	const talent = job?.owner;

	return (
		<div className="flex h-full gap-6">
			<div className="scrollbar-hide flex h-full w-[867px] grow flex-col overflow-y-auto pb-20">
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
				<div className="flex w-full grow flex-col rounded-b-xl bg-white p-6">
					<JobSkills skills={job?.tags ?? []} />
					<JobDescription description={job?.description} />
					<JobDeliverables
						deliverables={job?.collections.filter(isJobDeliverable).map((collection) => collection.name)}
					/>

					{job.invite == null && !jobIsCancelled && (
						<JobCtas
							jobId={job?._id}
							skills={job?.tagsData}
							openDeleteModal={() => {
								setIsDeleteModalOpen(true);
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
						<div className="my-3 flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-lighter bg-blue-50 p-4 text-blue-500">
							<div className="flex items-center gap-2">
								<Info size={20} />
								{job.status === CollectionStatus.ONGOING ? (
									<span>Job is ongoing</span>
								) : (
									<span>Awaiting Talent Response</span>
								)}
							</div>

							<button
								className="flex h-[35px] w-[130px] items-center justify-center rounded-lg border border-red-500 bg-red-50 text-sm text-red-500"
								onClick={() => {
									if (canStillCancelInvite) {
										cancelInvite.mutate({ inviteId: job?.invite?._id ?? "" }, {});
									} else {
										setCancelCollection(true);
										setIsModalOpen(true);
									}
								}}
								type="button"
							>
								{cancelInvite.isLoading ? (
									<Spinner size={16} />
								) : canStillCancelInvite ? (
									"Cancel Invite"
								) : (
									"Cancel Job"
								)}
							</button>
						</div>
					) : null}
				</div>
			</div>

			<div className="flex h-full w-fit basis-[270px] flex-col items-center gap-7" />
			<Modal
				isOpen={isDeleteModalOpen}
				closeModal={() => {
					setIsDeleteModalOpen(false);
				}}
			>
				<DeleteJobModal jobId={job?._id} title={job?.name} setModalOpen={setIsDeleteModalOpen} />
			</Modal>
			<DesktopSheetWrapper isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
				<ClientJobSheet4Desktop
					jobId={jobId}
					talentId={talent?._id ?? ""}
					closeModal={() => {
						setIsModalOpen(false);
					}}
					cancelCollection={cancelCollection}
				/>
			</DesktopSheetWrapper>
		</div>
	);
}
