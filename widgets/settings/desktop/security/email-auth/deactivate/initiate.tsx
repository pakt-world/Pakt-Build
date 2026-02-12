"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeActivate2FAEmailInitiate } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { useEmail2FAState } from "@/lib/store/security";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { Button } from "@/components/common/button";

export const InitiateDeactivateOTP = ({ goToNextSlide }: SlideItemProps): React.JSX.Element => {
	const { user } = useUserState();
	const { email } = user ?? { email: "" };

	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useDeActivate2FAEmailInitiate();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync();
		goToNextSlide?.();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-8">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<h3 className="text-title">Deactivate Email OTP</h3>
				<XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
			</div>
			<p className="my-auto text-body">
				A code will be sent to <span className="text-success">{email}</span>
			</p>

			<Button variant="primary" size="md" onClick={handleInitiateOtp} className="w-full" fullWidth>
				{isLoading ? <Spinner /> : "Send OTP"}
			</Button>
		</div>
	);
};
