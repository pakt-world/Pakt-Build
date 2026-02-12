"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { GoogleAuth2FA } from "./google-auth";
import { EmailAuth2FA } from "./email-auth";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { ChangePasswordForm4Desktop } from "../_components/forms/security/change-password";

export const SecurityView = (): ReactElement => {
	const { user } = useUserState();
	const { twoFa } = user ?? {};

	const is2FASetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.AUTHENTICATOR) ?? false;
	const isEmailSetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.EMAIL) ?? false;
	const isSecuritySetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.SECURITY_QUESTION) ?? false;

	return (
		<div className="relative flex size-full grow flex-row gap-4 overflow-auto pb-4 2xl:gap-6">
			<ChangePasswordForm4Desktop />
			<div className="flex h-fit w-[70%] flex-col gap-6 rounded-2xl bg-white p-6 2xl:w-3/4">
				<h3 className="text-xl font-bold text-title">2FA</h3>

				<div className="flex justify-between gap-5">
					<GoogleAuth2FA isEnabled={is2FASetUp} disabled={isSecuritySetUp || isEmailSetUp} />
					<EmailAuth2FA isEnabled={isEmailSetUp} disabled={is2FASetUp || isSecuritySetUp} />
					{/* <SecurityQuestion2FA isEnabled={isSecuritySetUp} disabled={is2FASetUp || isEmailSetUp} /> */}
				</div>
			</div>
		</div>
	);
};
