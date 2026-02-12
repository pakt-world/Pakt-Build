"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useDeleteJob } from "@/lib/api/job";
import Lottie from "@/components/common/lottie";
import success from "@/lottiefiles/success.json";
import { Button } from "@/components/common/button";

interface ClientDeleteJobModalProps {
	jobId: string;
	title: string;
	setModalOpen: (state: boolean) => void;
}

export const DeleteJobModal: FC<ClientDeleteJobModalProps> = ({
	jobId,
	// @ts-expect-error --- Unused variable
	title,
	setModalOpen,
}) => {
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const deleteJobMutation = useDeleteJob();
	const router = useRouter();

	if (showSuccessMessage) {
		return (
			<div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
				<div className="flex flex-col items-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-2xl font-medium">Job Deleted</h2>
					<span className="text-body">You will be redirected to the Jobs page</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
			<div className="flex flex-col items-center gap-4">
				<h2 className="text-2xl font-medium">Delete Job</h2>
				<span className="text-center text-base text-body">
					This action is irreversible. Once you delete the job, all of its content and data will be
					permanently erased.
				</span>
				<span className="text-base font-bold text-body">
					Are you sure you want to proceed with the deletion?
				</span>
			</div>
			<div className="mt-auto flex w-full flex-row items-center justify-between gap-2">
				<Button
					fullWidth
					variant="secondary"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					No, Cancel
				</Button>
				<div className="w-full rounded-xl border border-red-400">
					<Button
						fullWidth
						variant="destructive"
						onClick={() => {
							deleteJobMutation.mutate(
								{ id: jobId },

								{
									onSuccess: () => {
										setShowSuccessMessage(true);
										setTimeout(() => {
											router.push("/jobs");
										}, 3000);
									},
								}
							);
						}}
						disabled={deleteJobMutation.isLoading}
					>
						{deleteJobMutation.isLoading ? <Spinner /> : "Yes, Proceed"}
					</Button>
				</div>
			</div>
		</div>
	);
};
