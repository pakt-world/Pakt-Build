/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGenerateGoogleAuth, useVerifyGoogleAuth } from "@/lib/api";
import Logger from "@/lib/utils/logger";
import { handleAuthResponse } from "../_utils";

export const useGoogleAuth = ({
	isSignIn = false,
	isSignUp = false,
	isGoogleSignIn = false,
	isGoogleSignup = false,
}: {
	isSignIn?: boolean;
	isSignUp?: boolean;
	isGoogleSignIn?: boolean;
	isGoogleSignup?: boolean;
}) => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 640px)");

	const [initiate, setInitiate] = useState(true);
	const verifyGoogleAuth = useVerifyGoogleAuth();
	const { data, isSuccess } = useGenerateGoogleAuth({
		enable: initiate,
	});
	Logger.info("Google auth data", data);

	const signIn = useGoogleLogin({
		onSuccess: (codeResponse) => {
			if (!isSuccess) {
				Logger.error("Google auth data is not available");
				return;
			}
			Logger.info("Google login success", codeResponse);
			setInitiate(false);
			verifyGoogleAuth.mutate(
				{
					code: codeResponse.code,
					state: data.state,
				},
				{
					onSuccess: (data) => {
						handleAuthResponse({
							data,
							isMobile,
							router,
							isSignIn,
							isSignUp,
							isGoogleSignIn,
							isGoogleSignup,
						});
					},
					onError: (error) => {
						Logger.error("Google login error", error);
					},
				}
			);
		},
		onError: (error) => {
			Logger.error("Google login error", error);
		},
		flow: "auth-code",
		scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
		ux_mode: "popup",
	});

	return { signIn };
};
