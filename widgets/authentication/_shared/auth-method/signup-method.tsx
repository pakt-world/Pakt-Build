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

export const SignupMethod = (): JSX.Element => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 600px)");
	const { signIn: signUp } = useGoogleAuth({
		isSignUp: true,
		isGoogleSignup: true,
	});

	return (
		<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
			<AuthMethod
				title="Create Your Account"
				description="Connect with world-class builders"
				instruction="Choose sign up method"
				google={() => {
					signUp();
				}}
				github={() => {
					console.log("Github authentication is not implemented yet.");
				}}
				email={() => {
					if (isMobile) {
						router.push(`/${AuthEnums.SIGNUP}`);
					} else {
						router.push(`/?auth=${AuthEnums.SIGNUP}`);
					}
				}}
			/>
			<div className="flex w-full items-center justify-end">
				<PoweredByPakt className="sm:!text-white" />
			</div>
		</div>
	);
};
