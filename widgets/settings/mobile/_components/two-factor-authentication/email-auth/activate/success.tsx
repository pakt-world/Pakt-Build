"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { useIsClient } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetAccount } from "@/lib/api/account";
import { Button } from "@/components/common/button";

export const OTPActivateSuccess = (): React.JSX.Element => {
	const isClient = useIsClient();
	const router = useRouter();
	const { refetch: fetchAccount, isFetching } = useGetAccount({ enable: isClient ? true : false });

	const Close = async (): Promise<void> => {
		if (!isFetching) void fetchAccount();
		router.push("/settings/2fa");
	};
	return (
		<div className="flex w-full flex-col items-center justify-between gap-4 overflow-y-auto">
			<div className="relative flex w-full flex-row justify-center">
				<h3 className="font-bold text-title">Email Authentication</h3>
			</div>
			<div className="flex w-full flex-col items-center justify-center">
				<Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
				<p className="text-center text-body">You have successfully secured your account with 2FA.</p>
			</div>
			<Button variant="primary" onClick={Close} fullWidth>
				Done
			</Button>
		</div>
	);
};
