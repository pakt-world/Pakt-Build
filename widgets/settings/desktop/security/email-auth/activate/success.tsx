"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { XCircleIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEmail2FAState } from "@/lib/store/security";
import { Button } from "@/components/common/button";

export const OTPActivateSuccess = (): React.JSX.Element => {
	const { closeModal } = useEmail2FAState();

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<h3 className="text-title">Email Authentication</h3>
				<XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
			</div>
			<Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
			<p className="text-body">You have successfully secured your account with 2FA.</p>
			<Button variant="primary" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};
