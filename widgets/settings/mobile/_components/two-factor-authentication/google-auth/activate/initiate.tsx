"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useAuthApp2FAState } from "@/lib/store/security";
import { useInitialize2FA } from "@/lib/api/account";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { toast } from "@/components/common/toaster";
import { Spinner } from "@/components/common/loader";
import { Button } from "@/components/common/button";

export const InitiateAuthApp = ({ goToNextStep }: { goToNextStep: () => void }): React.JSX.Element => {
	const router = useRouter();
	const { mutateAsync, isLoading } = useInitialize2FA();
	const { setSecret, setQrCode } = useAuthApp2FAState();

	const handleInitiateAuthApp = async (): Promise<void> => {
		try {
			const data = await mutateAsync({
				type: TwoFactorAuthEnums.AUTHENTICATOR,
			});
			// Logger.info(data);
			if (data.qrCodeUrl) {
				setSecret(data?.secret ?? "A5treyQJHS-JHFNKE-OPJ0unekVyt");
				setQrCode(data.qrCodeUrl);
				goToNextStep();
			} else toast.error("An Error Occurred, Try Again!!!");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<div className="flex w-full flex-col items-center gap-14 overflow-y-auto pb-4 text-center">
			<div className="relative flex w-full flex-row justify-center">
				<ChevronLeft
					className="absolute left-0 top-1/2 my-auto -translate-y-1/2 cursor-pointer text-body"
					onClick={() => router.push("/settings/2fa")}
				/>
				<h3 className="font-bold text-title">Authenticator App</h3>
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
