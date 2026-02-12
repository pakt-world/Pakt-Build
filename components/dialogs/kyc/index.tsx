"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { kycIsPending } from "@/lib/actions/kyc";
import { KycVerificationStatus } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useKyc } from "@/lib/store/kyc";
// import { userKycIsApproved } from "@/lib/utils";

export const Pending = (): JSX.Element => (
	<div className="flex h-[59px] w-full items-center justify-start rounded-lg border border-blue-400 bg-[#0065D01A] bg-opacity-40 p-4">
		<p className="text-lg leading-[27px] tracking-wide text-blue-400">
			Your KYC is in review. Approval should take no more than 30 minutes.
		</p>
	</div>
);

export const Kyc = (): JSX.Element | null => {
	const pathname = usePathname();
	const { user } = useUserState();
	const { firstName, kyc = false, kycStatus = KycVerificationStatus.EMPTY } = user ?? {};
	// const userHasDoneKyc = userKycIsApproved(kycStatus || KycVerificationStatus.EMPTY);

	const { setOpenKycModal } = useKyc();
	// Logger.info("KYC Status:", kycStatus);
	// if (userHasDoneKyc) {
	// 	return null;
	// }

	if (kycIsPending(kyc, kycStatus)) {
		return <Pending />;
	}

	if (kycStatus !== KycVerificationStatus.APPROVED) {
		return (
			<div className="z-10 flex flex-col items-start justify-center gap-3 max-sm:w-full max-sm:p-4">
				{pathname === "/dashboard" && (
					<h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-title sm:hidden">
						Hello {firstName}!
					</h3>
				)}
				<div
					className="flex w-full flex-col items-start justify-between gap-4 rounded-[16px] border border-line bg-blue-darkest p-4 sm:flex-row
						sm:items-center sm:gap-0"
				>
					<p className="text-base font-normal text-white">
						A Know Your Customer (KYC) security check is required before you can create or apply for a job.
					</p>
					<Button
						variant="white"
						size="lg"
						className="max-sm:w-full max-sm:!px-4 max-sm:!py-2 max-sm:!text-sm sm:h-9"
						onClick={() => {
							setOpenKycModal(true);
						}}
					>
						Setup KYC
					</Button>
				</div>
			</div>
		);
	}
	return null;
};
