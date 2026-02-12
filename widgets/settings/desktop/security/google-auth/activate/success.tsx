"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { XCircleIcon } from "lucide-react";
import { useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useAuthApp2FAState } from "@/lib/store/security";
import { useGetAccount } from "@/lib/api/account";
import { Button } from "@/components/common/button";

export const ActivateAuthAppSuccess = (): React.JSX.Element => {
	const isClient = useIsClient();
	const { closeModal } = useAuthApp2FAState();
	const { refetch: fetchAccount, isFetching } = useGetAccount({ enable: isClient ? true : false });

	const Close = async (): Promise<void> => {
		if (!isFetching) void fetchAccount();
		closeModal();
	};
	return (
		<div className="flex w-full shrink-0 flex-col items-center">
			<div className="flex w-full flex-row justify-between">
				<h3 className="text-title">Authenticator App</h3>
				<XCircleIcon className="my-auto cursor-pointer text-body" onClick={Close} />
			</div>

			<Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
			<p className="text-center text-body">
				You have successfully secured your account with 2FA. You will input your Authentication App’s generated
				code each time you want to login or make a withdrawal.
			</p>
			<Button variant="primary" className="mt-auto" onClick={Close} fullWidth>
				Done
			</Button>
		</div>
	);
};
