"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import Lottie from "@/components/common/lottie";
import { useDeleteJob, useGetJobById } from "@/lib/api/job";
import success from "@/lottiefiles/success.json";
import { Button } from "@/components/common/button";

interface ClientDeleteJobModalProps {
	jobId: string;
}

export const DeleteJobMobile: FC<ClientDeleteJobModalProps> = ({ jobId }) => {
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const deleteJobMutation = useDeleteJob();
	const router = useRouter();

	const jobQuery = useGetJobById({ jobId });
	const { data: job } = jobQuery;
	const title = job?.name as string;

	if (showSuccessMessage) {
		return (
			<div className="flex h-full w-full max-w-xl flex-col justify-center gap-4 bg-white p-6">
				<div className="flex flex-col items-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-2xl font-medium">Job Deleted</h2>
					<span className="text-body">This Job has been deleted.</span>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex h-full w-full flex-col bg-white pb-8">
			<div className="fixed top-[70px] z-20 flex w-full items-center justify-start gap-2 bg-brand_gradient p-4 text-white">
				<Button
					onClick={() => {
						router.back();
					}}
					type="button"
					aria-label="Back"
					variant="ordinary"
					size="noSize"
					className="!w-max gap-2"
				>
					<ChevronLeft />
					<span className="text-lg font-bold">Delete Job</span>
				</Button>
			</div>
			<div className="z-10 mt-[60px] flex flex-col items-center justify-center gap-4 border-t px-4 py-4">
				{title && (
					<h3 className="flex items-center gap-1 text-xl font-medium text-body">
						<span className="text-red-600">-</span>
						<span className="text-center text-title">{title}</span>
						<span className="text-red-600">-</span>
					</h3>
				)}
				<span className="text-center text-body-light">
					This action is irreversible. Once you delete the job, all of its content and data will be
					permanently erased. The funds will be returned to your wallet.
				</span>
			</div>
			<div className="z-10 mb-4 mt-auto flex w-full flex-col items-center justify-between gap-8 px-4">
				<span className="text-center text-sm font-normal text-body">
					Are you sure you want to proceed with the deletion?
				</span>
				<div className="flex w-full flex-row items-center justify-between gap-2">
					<Button
						fullWidth
						variant="secondary"
						onClick={() => {
							router.back();
						}}
						size="md"
					>
						No, Cancel
					</Button>
					<Button
						fullWidth
						variant="destructive"
						size="md"
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
