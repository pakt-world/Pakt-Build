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

import { VerifyDeactivateAuthApp } from "@/widgets/settings/mobile/_components/two-factor-authentication/google-auth/deactivate/verify";
import { DeactivateAuthAppSuccess } from "@/widgets/settings/mobile/_components/two-factor-authentication/google-auth/deactivate/success";
import { InitiateAuthApp } from "@/widgets/settings/mobile/_components/two-factor-authentication/google-auth/activate/initiate";
import { ScanAuthApp } from "@/widgets/settings/mobile/_components/two-factor-authentication/google-auth/activate/scan";
import { VerifyActivateAuthApp } from "@/widgets/settings/mobile/_components/two-factor-authentication/google-auth/activate/verify";
import { ActivateAuthAppSuccess } from "@/widgets/settings/mobile/_components/two-factor-authentication/google-auth/activate/success";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";

export default function TwofaPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();
	const { user } = useUserState();
	const { twoFa } = user ?? {};

	const is2FASetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.AUTHENTICATOR) ?? false;
	const isGoogleEnabled = is2FASetUp;
	const [isGoogleEnabledStatus, setIsGoogleEnabledStatus] = useState(false);

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			router.push(`/settings`);
		}
	}, [router, tab]);

	useEffect(() => {
		if (isGoogleEnabled) {
			setIsGoogleEnabledStatus(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const steps = isGoogleEnabled ? 2 : 4;

	const [currentStep, helpers] = useStep(steps);

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
			{isGoogleEnabledStatus ? (
				<>
					{/* Deactivate */}
					{currentStep === 1 && <VerifyDeactivateAuthApp goToNextStep={goToNextStep} />}
					{currentStep === 2 && <DeactivateAuthAppSuccess />}
				</>
			) : (
				<>
					{/* Activate */}
					{currentStep === 1 && <InitiateAuthApp goToNextStep={goToNextStep} />}
					{currentStep === 2 && <ScanAuthApp goToPrevStep={goToPrevStep} goToNextStep={goToNextStep} />}
					{currentStep === 3 && (
						<VerifyActivateAuthApp goToPrevStep={goToPrevStep} goToNextStep={goToNextStep} />
					)}
					{currentStep === 4 && <ActivateAuthAppSuccess />}
				</>
			)}
		</div>
	) : (
		<></>
	);
}
