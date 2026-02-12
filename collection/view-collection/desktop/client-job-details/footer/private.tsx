"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

export interface ClientPrivateJobCtasProps {
	jobId: string;
	openDeleteModal: () => void;
	skills?: string[];
}

export const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({ jobId, skills = [], openDeleteModal }) => {
	const router = useRouter();

	return (
		<div className="mt-8 flex w-full items-center justify-between gap-4">
			<Button variant="destructive" size="md" onClick={openDeleteModal}>
				Delete Job
			</Button>

			<div className="flex w-full max-w-sm items-center justify-end gap-2">
				<Button
					variant="secondaryOutline"
					onClick={() => {
						router.push(`/jobs/${jobId}/edit`);
					}}
					size="md"
				>
					Edit Job
				</Button>
				<Button
					variant="primary"
					onClick={() => {
						router.push(
							`/talents${skills != null && skills?.length > 0 ? `?skills=${skills?.join(", ")}` : ""}`
						);
					}}
					size="md"
				>
					Find Talent
				</Button>
			</div>
		</div>
	);
};
