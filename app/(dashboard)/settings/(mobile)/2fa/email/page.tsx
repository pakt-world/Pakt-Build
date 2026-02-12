"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { useMediaQuery, useStep } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { InitiateDeactivateOTP } from "@/widgets/settings/mobile/_components/two-factor-authentication/email-auth/deactivate/initiate";
import { VerifyDeactivateOTP } from "@/widgets/settings/mobile/_components/two-factor-authentication/email-auth/deactivate/verify";
import { OTPDeactivateSuccess } from "@/widgets/settings/mobile/_components/two-factor-authentication/email-auth/deactivate/success";
import { InitiateActivateOTP } from "@/widgets/settings/mobile/_components/two-factor-authentication/email-auth/activate/initiate";
import { VerifyActivateOTP } from "@/widgets/settings/mobile/_components/two-factor-authentication/email-auth/activate/verify";
import { OTPActivateSuccess } from "@/widgets/settings/mobile/_components/two-factor-authentication/email-auth/activate/success";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";

export default function TwofaPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();
	const { user } = useUserState();
	const { twoFa } = user ?? {};

	const isEmailSetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.EMAIL) ?? false;
	const isEmailEnabled = isEmailSetUp;
	const [isEmailEnabledStatus, setIsEmailEnabledStatus] = useState(false);

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/settings`);
		}
	}, [router, tab]);

	useEffect(() => {
		if (isEmailEnabled) {
			setIsEmailEnabledStatus(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [currentStep, helpers] = useStep(3);

	const {
		canGoToPrevStep: _cgtps,
		canGoToNextStep: _cgtns,
		goToNextStep,
		goToPrevStep,
		reset: _r,
		setStep: _sS,
	} = helpers;

	return !tab ? (
		<div className="relative flex w-full overflow-y-auto p-4 pb-[64px]">
			{isEmailEnabledStatus ? (
				<>
					{/* Deactivate Email OTP */}
					{currentStep === 1 && <InitiateDeactivateOTP goToNextStep={goToNextStep} />}
					{currentStep === 2 && (
						<VerifyDeactivateOTP goToPrevStep={goToPrevStep} goToNextStep={goToNextStep} />
					)}
					{currentStep === 3 && <OTPDeactivateSuccess />}
				</>
			) : (
				<>
					{/* Activate Email OTP */}
					{currentStep === 1 && <InitiateActivateOTP goToNextStep={goToNextStep} />}
					{currentStep === 2 && <VerifyActivateOTP goToPrevStep={goToPrevStep} goToNextStep={goToNextStep} />}
					{currentStep === 3 && <OTPActivateSuccess />}
				</>
			)}
		</div>
	) : (
		<></>
	);
}
