"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeActivate2FAEmailInitiate } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { Spinner } from "@/components/common/loader";
import { Button } from "@/components/common/button";

export const InitiateDeactivateOTP = ({ goToNextStep }: { goToNextStep: () => void }): React.JSX.Element => {
	const router = useRouter();
	const { user } = useUserState();
	const { email } = user ?? { email: "" };

	const { mutateAsync, isLoading } = useDeActivate2FAEmailInitiate();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync();
		goToNextStep();
	};

	return (
		<div className="flex w-full flex-col items-center justify-between gap-14 overflow-y-auto pb-4 text-center">
			<div className="relative flex w-full flex-row justify-center">
				<ChevronLeft
					className="absolute left-0 top-1/2 my-auto -translate-y-1/2 cursor-pointer text-body"
					onClick={() => router.push("/settings/2fa")}
				/>
				<h3 className="font-bold text-title">Deactivate Email OTP</h3>
			</div>
			<p className="text-center text-body">
				A code will be sent to <span className="text-success">{email}</span>
			</p>

			<Button variant="primary" size="md" onClick={handleInitiateOtp} className="" fullWidth>
				{isLoading ? <Spinner /> : "Send OTP"}
			</Button>
		</div>
	);
};
