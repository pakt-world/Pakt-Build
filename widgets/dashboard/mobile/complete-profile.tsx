"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { KycVerificationStatus } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { Kyc } from "@/components/dialogs/kyc";
import { userKycIsApproved } from "@/lib/utils";

export const CompleteProfile4Mobile = (): JSX.Element | null => {
	const router = useRouter();

	const { user } = useUserState();
	const { firstName, kycStatus, profileCompleteness } = user ?? {};

	const profileCompleted = (profileCompleteness as number) > 70;

	const userHasDoneKyc = userKycIsApproved(kycStatus ?? KycVerificationStatus.EMPTY);

	if (!firstName) return null;

	if (!profileCompleted) {
		return (
			<div className="z-10 flex w-full flex-col items-start gap-3 p-4 transition-all duration-300 ease-in-out">
				<h3 className="text-2xl font-bold leading-[31.2px] tracking-wide text-title">Hello {firstName}!</h3>

				<div className="relative z-[2] flex h-auto w-full items-center gap-2 rounded-2xl bg-white p-4">
					<div className="flex flex-col items-start gap-2">
						<div className="flex flex-row items-center gap-1 text-title">
							<h3 className="text-2xl font-bold">{profileCompleteness}%</h3>
							<p className="mt-1 text-base">of your profile is completed</p>
						</div>
						<div className="flex flex-[7] flex-col gap-4">
							<p className="text-sm leading-[21px] tracking-[0.75px] text-body">
								The more complete it is, the more likely you are to start a collaboration
							</p>
							<div className="h-[48px] w-full">
								<Button
									variant="primary"
									size="lg"
									onClick={() => {
										if (profileCompleteness === 70) {
											router.push("/settings/professional-info");
										} else {
											router.push("/settings");
										}
									}}
									className="h-full w-full"
								>
									<span>Complete Profile</span>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (profileCompleted && !userHasDoneKyc) {
		return (
			<div className="z-10 w-full flex-none bg-blue-lightest/50">
				<Kyc />
			</div>
		);
	}

	return <></>;
};
