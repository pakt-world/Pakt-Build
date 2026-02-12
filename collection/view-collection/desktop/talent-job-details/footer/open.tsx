"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "@/components/common/headless-modal";
import { TalentPrivateJobCtas } from "./private";
import { Button } from "@/components/common/button";
import { TalentJobApplyModal } from "@/collection/apply-for-collection/desktop";

export interface TalentOpenJobCtasProps {
	jobId: string;
	jobCreatorId: string;
	inviteId: string | null;
	hasAlreadyApplied: boolean;
	hasBeenInvited: boolean;
	isPrivate: boolean;
}

export const TalentOpenJobCtas: React.FC<TalentOpenJobCtasProps> = ({
	jobId,
	jobCreatorId,
	hasBeenInvited,
	inviteId,
	hasAlreadyApplied,
	isPrivate,
}) => {
	const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

	if (hasBeenInvited)
		return (
			<TalentPrivateJobCtas
				inviteId={inviteId}
				hasBeenInvited={hasBeenInvited}
				jobId={jobId}
				jobCreatorId={jobCreatorId}
				isPrivate={isPrivate}
			/>
		);

	return (
		<div className="ml-auto w-full max-w-[200px]">
			{!hasAlreadyApplied && (
				<Button
					variant="primary"
					size="lg"
					fullWidth
					onClick={() => {
						setIsApplyModalOpen(true);
					}}
				>
					Apply
				</Button>
			)}

			<Modal
				isOpen={isApplyModalOpen}
				closeModal={() => {
					setIsApplyModalOpen(false);
				}}
			>
				<TalentJobApplyModal jobId={jobId} jobCreator={jobCreatorId} />
			</Modal>
		</div>
	);
};
