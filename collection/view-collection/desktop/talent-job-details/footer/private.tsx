"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useDeclineInvite, useAcceptInvite } from "@/lib/api/invites";
import { Button } from "@/components/common/button";

export interface TalentPrivateJobCtasProps {
	inviteId: string | null;
	hasBeenInvited: boolean;
	jobId: string;
	jobCreatorId: string;
	isPrivate: boolean;
}

export const TalentPrivateJobCtas: React.FC<TalentPrivateJobCtasProps> = ({
	inviteId,
	hasBeenInvited,
	jobId,
	jobCreatorId,
	isPrivate,
}) => {
	const router = useRouter();
	const acceptInvite = useAcceptInvite({ jobId, jobCreatorId, isPrivate });
	const declineInvite = useDeclineInvite({ jobId, jobCreatorId, isPrivate });

	if (inviteId == null || !hasBeenInvited) return null;

	return (
		<div className="mt-auto flex w-full items-center justify-end">
			<div className="flex w-full max-w-sm items-center gap-4">
				<Button
					fullWidth
					size="lg"
					variant="secondary"
					onClick={() => {
						declineInvite.mutate(
							{ id: inviteId },
							{
								onSuccess: () => {
									router.push("/dashboard");
								},
							}
						);
					}}
					disabled={declineInvite.isLoading}
				>
					{declineInvite.isLoading ? <Spinner /> : "Decline"}
				</Button>

				<Button
					fullWidth
					size="lg"
					variant="primary"
					onClick={() => {
						acceptInvite.mutate(
							{ id: inviteId },
							{
								onSuccess: () => {
									router.push("/jobs?jobs-type=assigned");
								},
							}
						);
					}}
					disabled={acceptInvite.isLoading}
				>
					{acceptInvite.isLoading ? <Spinner /> : "Accept Invite"}
				</Button>
			</div>
		</div>
	);
};
