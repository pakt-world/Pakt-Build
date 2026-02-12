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

import { useInitialize2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { Spinner } from "@/components/common/loader";
import { Button } from "@/components/common/button";

export const InitiateActivateOTP = ({ goToNextStep }: { goToNextStep: () => void }): React.JSX.Element => {
	const router = useRouter();
	const { user } = useUserState();
	const { email } = user ?? { email: "" };

	const { mutateAsync, isLoading } = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync({ type: TwoFactorAuthEnums.EMAIL });
		goToNextStep();
	};

	return (
		<div className="flex w-full flex-col items-center gap-14 overflow-y-auto pb-4 text-center">
			<div className="relative flex w-full flex-row justify-center">
				<ChevronLeft
					className="absolute left-0 top-1/2 my-auto -translate-y-1/2 cursor-pointer text-body"
					onClick={() => router.push("/settings/2fa")}
				/>
				<h3 className="font-bold text-title">Email Authentication</h3>
			</div>

			<p className="text-center text-body">
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
