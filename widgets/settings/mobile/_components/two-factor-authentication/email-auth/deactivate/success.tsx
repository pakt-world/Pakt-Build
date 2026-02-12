"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";

export const OTPDeactivateSuccess = (): React.JSX.Element => {
	const router = useRouter();
	return (
		<div className="relative flex w-full flex-col items-center justify-between gap-4 overflow-y-auto">
			<div className="relative flex w-full flex-row justify-center">
				<h3 className="font-bold text-title">Email</h3>
			</div>
			<div className="flex w-full flex-col items-center justify-center">
				<Image src="/icons/success.gif" className="my-auto" width={200} height={200} alt="" />
				<p className="my-auto text-body">You have successfully deactivated Email OTP.</p>
			</div>
			<Button
				variant="primary"
				fullWidth
				onClick={() => {
					router.push("/settings/2fa");
				}}
			>
				Done
			</Button>
		</div>
	);
};
