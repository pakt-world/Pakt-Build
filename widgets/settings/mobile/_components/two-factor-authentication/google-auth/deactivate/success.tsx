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

export const DeactivateAuthAppSuccess = (): React.JSX.Element => {
	const router = useRouter();
	return (
		<div className="flex size-full flex-col items-center justify-between">
			<div className="relative flex w-full flex-row justify-center">
				<h3 className="font-bold text-title">Authenticator App</h3>
			</div>
			<div className="flex w-full flex-col items-center justify-center">
				<p className="text-body">You have successfully deactivated 2FA.</p>
				<Image src="/icons/success.gif" className="my-auto" width={200} height={200} alt="" />
			</div>

			<Button
				className=""
				variant="primary"
				size="md"
				onClick={() => {
					router.push("/settings/2fa");
				}}
				fullWidth
			>
				Done
			</Button>
		</div>
	);
};
