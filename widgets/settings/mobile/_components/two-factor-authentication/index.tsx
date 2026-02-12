/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox, Text } from "pakt-ui";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";

export const TwoFa = (): JSX.Element => {
	const router = useRouter();
	const { user } = useUserState();
	const { twoFa } = user ?? {};

	const is2FASetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.AUTHENTICATOR) ?? false;
	const isEmailSetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.EMAIL) ?? false;
	const isSecuritySetUp = (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.SECURITY_QUESTION) ?? false;

	const googleDisabled = isSecuritySetUp || isEmailSetUp;
	const emailDisabled = is2FASetUp || isSecuritySetUp;

	const isGoogleEnabled = is2FASetUp;
	const isEmailEnabled = isEmailSetUp;

	return (
		<div className="relative flex w-full flex-col overflow-y-auto bg-white">
			<div className="fixed top-[70px] z-50 flex h-[54px] w-full items-center gap-2 border-y border-green-lighter bg-white p-4 py-[13.5px]">
				<Button
					className="p-0"
					onClick={() => {
						router.push("/settings");
					}}
					variant="ghost"
				>
					<ChevronLeft className="text-title" />
				</Button>
				<h1 className="text-lg font-bold leading-[27px] tracking-wide text-title">2FA</h1>
			</div>

			<div className="scrollbar-hide relative mb-[54px] mt-[70px] flex w-full flex-1 flex-col gap-4 overflow-y-auto p-4">
				<div
					onClick={() => {
						if (!googleDisabled) {
							router.push("/settings/2fa/authenticator");
						}
					}}
					className={`relative flex cursor-pointer flex-col items-center justify-center gap-6 rounded-lg border border-line bg-[#F2F2F2] px-7
						py-4 disabled:cursor-not-allowed disabled:opacity-[0.5] ${googleDisabled ? "cursor-not-allowed opacity-[0.5]" : ""}`}
				>
					<div className="absolute right-4 top-4">
						<Checkbox checked={isGoogleEnabled} />
					</div>
					<div className="flex h-[100px] items-center">
						<Image
							className="-translate-x-[10px]"
							src="/icons/authenticator-app.svg"
							width={76}
							height={76}
							alt="Authenticator app"
						/>
					</div>
					<Text.p size="lg">Authenticator app</Text.p>
				</div>
				<div
					onClick={() => {
						if (!emailDisabled) {
							router.push("/settings/2fa/email");
						}
					}}
					className={`relative flex cursor-pointer flex-col items-center justify-center gap-6 rounded-lg border border-line bg-[#F2F2F2] px-7
						py-4 ${emailDisabled ? "cursor-not-allowed opacity-[0.5]" : ""}`}
				>
					<div className="absolute right-4 top-4">
						<Checkbox checked={isEmailEnabled} />
					</div>
					<div className="flex h-[100px] items-center">
						<Image src="/icons/email-auth.svg" width={76} height={76} alt="" />
					</div>
					<Text.p size="lg">Email Auth</Text.p>
				</div>
			</div>
		</div>
	);
};
