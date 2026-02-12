"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FC } from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Pending } from "@/components/dialogs/kyc";
import { kycIsPending } from "@/lib/actions/kyc";
import { useUserState } from "@/lib/store/account";
import { KycVerificationStatus } from "@/lib/enums";
import { CollectionProps } from "@/lib/types/collection";

export interface ClientOpenJobCtasProps4Mobile {
	jobId: string;
	deletePage: () => void;
	applicants: CollectionProps[];
}

export const ClientOpenJobCtas4Mobile: FC<ClientOpenJobCtasProps4Mobile> = ({ jobId, deletePage, applicants: _a }) => {
	const { user } = useUserState();
	const { kyc = false, kycStatus = KycVerificationStatus.EMPTY } = user ?? {};

	if (kycIsPending(kyc, kycStatus)) {
		return <Pending />;
	}
	return (
		<div className="flex w-full flex-col items-center gap-4 px-4">
			<Button fullWidth asChild variant="primary" size="md">
				<Link href={`/jobs/${jobId}/applicants`}>View Applicants</Link>
			</Button>
			<div className="flex w-full items-center gap-2">
				<Button fullWidth variant="destructive" size="md" onClick={deletePage}>
					Delete Job
				</Button>

				<Button fullWidth size="md" variant="outlinePrimary" asChild>
					<Link href={`/jobs/${jobId}/edit`}>Edit Job</Link>
				</Button>
			</div>
		</div>
	);
};
