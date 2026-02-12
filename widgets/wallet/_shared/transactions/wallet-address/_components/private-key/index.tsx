"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCountdown, useStep } from "usehooks-ts";
import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { EnterPassword4SecretKey } from "./enter-password";
import { WalletAddressHeader } from "../header";
import { useShowWalletAddressStore } from "./store";
import { EnterOTP4SecretKey } from "./enter-otp";
import { PrivateKey } from "./private-key";

interface PrivateKeyContentProps {
	currentStep: number;
	goToNextStep: () => void;
	count: number;
	startCountdown: () => void;
	resetCountdown: () => void;
}

export const PrivateKeyContent = ({
	currentStep,
	goToNextStep,
	count,
	startCountdown,
	resetCountdown,
}: PrivateKeyContentProps) => {
	return (
		<div className="flex w-full items-center justify-center">
			{currentStep === 1 && <EnterPassword4SecretKey proceed={goToNextStep} startCountDown={startCountdown} />}
			{currentStep === 2 && (
				<EnterOTP4SecretKey
					proceed={goToNextStep}
					countDown={count}
					startCountDown={startCountdown}
					resetCountdown={resetCountdown}
				/>
			)}
			{currentStep === 3 && <PrivateKey />}
		</div>
	);
};

export const PrivateKeyFlow = () => {
	const { setShowWalletAddress, setShowPrivateKeyFlow } = useShowWalletAddressStore();
	const [currentStep, helpers] = useStep(3);
	const { goToNextStep, goToPrevStep, setStep } = helpers;
	const [count, { startCountdown, stopCountdown: _s, resetCountdown }] = useCountdown({
		countStart: 60,
		intervalMs: 1000,
	});
	return (
		<div className="flex flex-col gap-4 rounded-2xl bg-white px-4 py-6 sm:rounded-lg sm:border sm:border-[#9BDCFD] sm:p-4">
			<WalletAddressHeader
				title={
					<div className="flex items-center gap-4">
						<ChevronLeft
							className="h-6 w-6 cursor-pointer text-black"
							onClick={() => {
								if (currentStep === 1) {
									setShowPrivateKeyFlow(false);
									setShowWalletAddress(true);
								} else if (currentStep === 3) {
									setStep(1);
								} else {
									goToPrevStep();
								}
							}}
						/>
						{currentStep === 2 ? "Email Authentication" : "Private Key"}
					</div>
				}
				close={() => {
					setShowPrivateKeyFlow(false);
				}}
				className="max-sm:hidden"
			/>
			<PrivateKeyContent
				currentStep={currentStep}
				goToNextStep={goToNextStep}
				count={count}
				startCountdown={startCountdown}
				resetCountdown={resetCountdown}
			/>
		</div>
	);
};
