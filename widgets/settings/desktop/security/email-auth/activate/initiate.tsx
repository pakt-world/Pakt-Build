"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useInitialize2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { useEmail2FAState } from "@/lib/store/security";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { Button } from "@/components/common/button";

export const InitiateActivateOTP = ({ goToNextSlide }: SlideItemProps): React.JSX.Element => {
	const { user } = useUserState();
	const { email } = user ?? { email: "" };

	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync({ type: TwoFactorAuthEnums.EMAIL });
		goToNextSlide?.();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center justify-center gap-8 p-6">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<h3 className="text-title">Email Authentication</h3>
				<XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
			</div>

			<p className="text-body max-sm:text-center">
				A code will be sent to <span className="text-success">{email}</span>
			</p>
			<div className="m-auto flex items-center">
				<Image src="/icons/email-auth.svg" width={150} height={210} alt="" />
			</div>

			<Button onClick={handleInitiateOtp} className="w-full" size="md" variant="primary" fullWidth>
				{isLoading ? <Spinner /> : "Send Code"}
			</Button>
		</div>
	);
};
