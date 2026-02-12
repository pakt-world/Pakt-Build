"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useAuthApp2FAState } from "@/lib/store/security";
import { useInitialize2FA } from "@/lib/api/account";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { toast } from "@/components/common/toaster";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { Button } from "@/components/common/button";

export const InitiateAuthApp = ({ goToNextSlide }: SlideItemProps): React.JSX.Element => {
	const { mutateAsync, isLoading } = useInitialize2FA();
	const { setSecret, setQrCode, closeModal } = useAuthApp2FAState();

	const handleInitiateAuthApp = async (): Promise<void> => {
		try {
			const data = await mutateAsync({
				type: TwoFactorAuthEnums.AUTHENTICATOR,
			});
			// Logger.info(data);
			if (data.qrCodeUrl) {
				setSecret(data?.secret ?? "A5treyQJHS-JHFNKE-OPJ0unekVyt");
				setQrCode(data.qrCodeUrl);
				goToNextSlide?.();
			} else toast.error("An Error Occurred, Try Again!!!");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-14 text-center">
			<div className="flex w-full flex-row justify-between">
				<h3 className="text-title">Authenticator App</h3>
				<XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
			</div>
			<p className="max-w-xs text-title">
				To begin, you will need to install an Authenticator app on your phone.
			</p>
			<div className="my-auto flex -translate-x-7 items-center">
				<Image src="/icons/authenticator-app.svg" width={150} height={210} alt="" />
			</div>
			<Button variant="primary" size="md" onClick={handleInitiateAuthApp} className="mt-auto" fullWidth>
				{isLoading ? <Spinner /> : "Next"}
			</Button>
		</div>
	);
};
