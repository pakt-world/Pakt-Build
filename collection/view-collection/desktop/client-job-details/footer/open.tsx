"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { CollectionProps } from "@/lib/types/collection";

export interface ClientOpenJobCtasProps {
	jobId: string;
	openDeleteModal: () => void;
	applicants: CollectionProps[];
}

export const ClientOpenJobCtas: React.FC<ClientOpenJobCtasProps> = ({ jobId, openDeleteModal, applicants: _a }) => {
	const router = useRouter();

	return (
		<div className="mt-8 flex w-full items-center justify-between gap-4">
			<Button variant="destructive" size="md" onClick={openDeleteModal}>
				Delete Job
			</Button>

			<div className="flex w-full max-w-sm items-center justify-end gap-2">
				<Button
					variant="secondaryOutline"
					size="md"
					onClick={() => {
						router.push(`/jobs/${jobId}/edit`);
					}}
				>
					Edit Job
				</Button>
				{/* {applicants.length > 0 ? ( */}
				<Button
					variant="primary"
					size="md"
					onClick={() => {
						router.push(`/jobs/${jobId}/applicants`);
					}}
				>
					View Applicants
				</Button>
				{/* ) : (
					<Button
						variant="primary"
						size="md"
						onClick={() => {
							router.push(`/jobs`);
						}}
					>
						View Jobs
					</Button>
				)} */}
			</div>
		</div>
	);
};
