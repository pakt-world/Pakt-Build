"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Timer } from "lucide-react";
import { useUserState } from "@/lib/store/account";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { OtpInput } from "@/components/common/otp-input";
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { formatCountdown } from "@/lib/utils";
import { useShowWalletAddressStore } from "./store";
import { useInitialize2FA } from "@/lib/api/2fa";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { useExportSecretKey } from "@/lib/api/wallet/export-secret-key";

interface EnterOTP4SecretKeyProps {
	proceed?: () => void;
	countDown?: number;
	startCountDown?: () => void;
	resetCountdown?: () => void;
}

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

export const EnterOTP4SecretKey = ({
	proceed,
	countDown = 0,
	startCountDown,
	resetCountdown,
}: EnterOTP4SecretKeyProps) => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const { setSecretKey, setIsOtp, passwordValue, setPasswordValue } = useShowWalletAddressStore();

	const { user } = useUserState();
	const { email } = user ?? { email: "" };

	const initiate = useInitialize2FA();
	// Incoming Endpoint
	const { mutateAsync, isLoading } = useExportSecretKey();
	const handleInitiateOtp = async (): Promise<void> => {
		resetCountdown?.();
		await initiate.mutateAsync(
			{ type: TwoFactorAuthEnums.EMAIL },
			{
				onSuccess: () => {
					startCountDown?.();
				},
			}
		);
	};

	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<EmailOtpFormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<EmailOtpFormValues> = async ({ otp }) => {
		await mutateAsync(
			{ password: passwordValue, code: otp },
			{
				onSuccess: (data) => {
					setIsOtp(false);
					setSecretKey(data.secretKey as string);
					setPasswordValue("");
					proceed?.();
				},
			}
		);
	};

	// OTP value
	const otp = control._formValues?.otp;

	return (
		<div className="relative flex w-full shrink-0 flex-col items-center gap-8">
			<form className="flex flex-col items-center gap-4 sm:w-[368px] sm:gap-8" onSubmit={handleSubmit(onSubmit)}>
				<p className="text-center text-base text-body">
					Enter the code sent to <span className="text-success">{email}</span>
				</p>
				<div className="relative">
					<Controller
						name="otp"
						control={control}
						render={({ field: { onChange, value } }) => (
							<OtpInput value={value} onChange={onChange} numInputs={6} />
						)}
					/>
					<div className="relative -top-2 my-2 flex justify-center text-center">
						<InputErrorMessage message={errors.otp?.message} />
					</div>
				</div>

				<Button
					className="w-full scale-100"
					variant="primary"
					fullWidth
					disabled={otp === undefined || otp?.length < 6}
				>
					{isLoading ? <Spinner /> : "Confirm"}
				</Button>
			</form>
			<p>{formatCountdown(countDown)}</p>
			<Button
				variant="outlinePrimary"
				size={isMobile ? "sm" : "md"}
				disabled={countDown > 0 || initiate.isLoading}
				onClick={handleInitiateOtp}
			>
				{initiate.isLoading ? (
					<Spinner />
				) : (
					<div className="flex items-center gap-2">
						<Timer size={15} /> Resend Code
					</div>
				)}
			</Button>
		</div>
	);
};
