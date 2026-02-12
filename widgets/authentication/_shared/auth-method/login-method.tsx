"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import { AuthEnums } from "@/lib/enums";
import { AuthMethod } from ".";
import { useGoogleAuth } from "@/widgets/authentication/_hooks/use-google-auth";

export const SigninMethod = (): JSX.Element => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 600px)");
	const { signIn } = useGoogleAuth({
		isSignIn: true,
		isGoogleSignIn: true,
	});
	return (
		<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
			<AuthMethod
				title="Login to your account"
				description="Collaborate with world-class builders"
				instruction="Choose Log in method"
				google={() => {
					signIn();
				}}
				github={() => {
					console.log("Github authentication is not implemented yet.");
				}}
				email={() => {
					if (isMobile) {
						router.push(`/${AuthEnums.LOGIN}`);
					} else {
						router.push(`/?auth=${AuthEnums.LOGIN}`);
					}
				}}
			/>
			<div className="flex w-full items-center justify-end">
				<PoweredByPakt className="sm:!text-white" />
			</div>
		</div>
	);
};
