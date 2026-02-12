"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FC } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentPrivateJobCtas4Mobile } from "./private";
import { Button } from "@/components/common/button";
import { ENVS } from "@/config";
import { kycIsPending } from "@/lib/actions/kyc";
import { useUserState } from "@/lib/store/account";
import { useKyc } from "@/lib/store/kyc";
import { Pending } from "@/components/dialogs/kyc";
import { KycVerificationStatus } from "@/lib/enums";

export interface TalentOpenJobCtasProps4Mobile {
	jobId: string;
	jobCreatorId: string;
	inviteId: string | null;
	hasAlreadyApplied: boolean;
	hasBeenInvited: boolean;
	isPrivate: boolean;
}

export const TalentOpenJobCtas4Mobile: FC<TalentOpenJobCtasProps4Mobile> = ({
	jobId,
	jobCreatorId,
	hasBeenInvited,
	inviteId,
	hasAlreadyApplied,
	isPrivate,
}) => {
	const router = useRouter();
	const { user } = useUserState();
	const { kyc = false, kycStatus = KycVerificationStatus.EMPTY } = user ?? {};

	const { setOpenKycModal } = useKyc();

	if (kycIsPending(kyc, kycStatus)) {
		return <Pending />;
	}

	if (hasBeenInvited)
		return (
			<TalentPrivateJobCtas4Mobile
				inviteId={inviteId}
				hasBeenInvited={hasBeenInvited}
				jobId={jobId}
				jobCreatorId={jobCreatorId}
				isPrivate={isPrivate}
			/>
		);

	return (
		<div className="mx-auto mt-8 w-full max-w-[348px]">
			{!hasAlreadyApplied && (
				<Button
					fullWidth
					onClick={() => {
						if (!ENVS.isProduction || kyc) {
							router.push(`/jobs/${jobId}/apply`);
						} else {
							setOpenKycModal(true);
						}
					}}
					variant="primary"
					size="md"
				>
					Apply
				</Button>
			)}
		</div>
	);
};
