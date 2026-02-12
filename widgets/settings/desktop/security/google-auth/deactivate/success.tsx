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
import { Button } from "@/components/common/button";

export const DeactivateAuthAppSuccess = (): React.JSX.Element => {
	const { closeModal } = useAuthApp2FAState();
	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex w-full justify-between gap-2 text-center">
				<h3 className="text-title">Authenticator App</h3>
				<XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
			</div>
			<p className="text-body">You have successfully deactivated 2FA.</p>

			<Image src="/icons/success.gif" className="my-auto" width={200} height={200} alt="" />

			<Button className="mt-auto" variant="primary" size="md" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};
