"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TwoFactorAuthEnums } from "@/lib/enums";
import LoginVerificationForm from "@/widgets/authentication/_shared/login/verify/_components/verification-form";
import { useLoginDialogState } from "@/lib/store/security";
import { VERIFY_LOGIN_KEY } from "@/lib/utils";

export default function LoginVerificationPage(): React.JSX.Element {
	const isMobile = useMediaQuery("(max-width: 768px)");
	// For Desktop
	const { loginResponse } = useLoginDialogState();
	const { email, type } = loginResponse;
	// For Mobile
	const loginData = getCookie(VERIFY_LOGIN_KEY);
	const parsedLoginData = loginData ? JSON.parse(loginData) : {};
	const userEmail = parsedLoginData?.email;
	return (
		<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-2 text-center">
				<h3 className="font-sans text-2xl font-bold text-title sm:text-3xl sm:text-white">2FA Security</h3>
				<p className="font-sans text-base leading-normal tracking-tight text-body sm:text-white">
					{type === TwoFactorAuthEnums.AUTHENTICATOR
						? "Enter the OTP from your authenticator app"
						: "Enter the code that was sent to"}
					{type === TwoFactorAuthEnums.EMAIL && (
						<span className="ml-1 text-green-400">{isMobile ? userEmail : email}</span>
					)}
				</p>
			</div>
			<LoginVerificationForm />
		</div>
	);
}
