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
import { useUserState } from "@/lib/store/account";
import { kycIsPending } from "@/lib/actions/kyc";
import { Pending } from "@/components/dialogs/kyc";
import { KycVerificationStatus } from "@/lib/enums";
export interface ClientPrivateJobCtasProps4Mobile {
	jobId: string;
	skills?: string[];
	deletePage: () => void;
}

export const ClientPrivateJobCtas4Mobile: React.FC<ClientPrivateJobCtasProps4Mobile> = ({
	jobId,
	skills = [],
	deletePage,
}) => {
	const router = useRouter();
	const { user } = useUserState();
	const { kyc = false, kycStatus = KycVerificationStatus.EMPTY } = user ?? {};

	if (kycIsPending(kyc, kycStatus)) {
		return <Pending />;
	}
	return (
		<div className="mb-20 mt-auto flex w-full flex-col items-center justify-between gap-4">
			<Button
				variant="primary"
				size="md"
				fullWidth
				onClick={() => {
					router.push(
						`/talents${skills != null && skills?.length > 0 ? `?skills=${skills?.join(", ")}` : ""}`
					);
				}}
			>
				Find Talent
			</Button>

			<div className="flex w-full max-w-sm items-center gap-2">
				<Button
					fullWidth
					variant="destructive"
					onClick={deletePage}
					size="sm"
					className="!border !border-red-400"
				>
					Delete Job
				</Button>

				<Button
					fullWidth
					variant="outlinePrimary"
					onClick={() => {
						router.push(`/jobs/${jobId}/edit`);
					}}
				>
					Edit Job
				</Button>
			</div>
		</div>
	);
};
