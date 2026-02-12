"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import ReactOTPInput from "react-otp-input";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { getCookie, setCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { Container } from "@/components/common/container";
import { useRequestPasswordReset, useVerifyResetPassword } from "@/lib/api";
import { formatCountdown, RESET_PASSWORD_OTP_KEY, VERIFY_FORGOT_PASSWORD_KEY } from "@/lib/utils";
import { otpSchema } from "@/lib/validations";
import { Button } from "@/components/common/button";
import { useForgotPasswordDialogState } from "@/lib/store/security";
import Logger from "@/lib/utils/logger";
import { AuthEnums } from "@/lib/enums";

type FormValues = z.infer<typeof otpSchema>;

const RESEND_INTERVAL = 60000; // 1 minute
const COUNTDOWN_START = 60; // 60 seconds
const ONE_SECOND = 1000; // 1 second

function ResetPasswordVerificationForm(): React.JSX.Element {
	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(true);

	const isMobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();

	const { forgotPasswordResponse, setOtp } = useForgotPasswordDialogState();

	const forgotPasswordCookie = getCookie(VERIFY_FORGOT_PASSWORD_KEY);
	const fpCookie = forgotPasswordCookie ? JSON.parse(forgotPasswordCookie) : {};

	const { email: vse, token: vst } = fpCookie;
	const { email: sre, token: srt } = forgotPasswordResponse;
	const c = {
		email: vse || sre,
		token: vst || srt,
	};
	const { email, token } = c;

	const requestPasswordReset = useRequestPasswordReset();
	const verifyResetPassword = useVerifyResetPassword();

	Logger.info("SignUp Response===>>>", forgotPasswordResponse);

	useEffect(() => {
		if (isResendDisabled) {
			setCountdown(COUNTDOWN_START);
			const timer = setInterval(() => {
				setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
			}, ONE_SECOND);
			const timeout = setTimeout(() => {
				setIsResendDisabled(false);
			}, RESEND_INTERVAL);

			return () => {
				clearInterval(timer);
				clearTimeout(timeout);
			};
		}

		return () => {};
	}, [isResendDisabled]);

	const form = useForm<FormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<FormValues> = ({ otp }) => {
		if (!email || !token) {
			if (isMobile) {
				router.push(`/${AuthEnums.FORGOT_PASSWORD}`);
			} else {
				router.push(`/?auth=${AuthEnums.FORGOT_PASSWORD}`);
			}
			return;
		}
		if (isMobile) {
			setCookie(RESET_PASSWORD_OTP_KEY, JSON.stringify({ otp }));
			router.push(`/${AuthEnums.FORGOT_PASSWORD_RESET}`);
		} else {
			setOtp(otp);
			router.push(`/?auth=${AuthEnums.FORGOT_PASSWORD_RESET}`);
		}
	};

	const handleResendOTP = (): void => {
		if (typeof email !== "string") {
			router.push(`/?auth=${AuthEnums.FORGOT_PASSWORD}`);
			return;
		}

		requestPasswordReset.mutate(
			{
				email,
			},
			{
				onSuccess: () => {
					setIsResendDisabled(true);
				},
			}
		);
	};

	useEffect(() => {
		if (!email || !token) {
			if (isMobile) {
				router.push(`/${AuthEnums.FORGOT_PASSWORD}`);
			} else {
				router.push(`/?auth=${AuthEnums.FORGOT_PASSWORD}`);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, token, isMobile]);

	return (
		<Container className="flex w-full max-w-2xl flex-col items-center gap-6 sm:mt-28">
			<div className="flex flex-col items-center gap-2 text-center">
				<h3 className="font-sans text-3xl font-bold text-title sm:text-white">Reset Password Code</h3>
				<p className="font-sans text-base text-body sm:text-white">
					A code has been sent to your email address. Enter it to verify your reset password.
				</p>
			</div>
			<form
				className="relative z-[100] mx-auto flex w-full flex-col items-center gap-6 rounded-2xl bg-white p-4 sm:max-w-[600px] sm:px-[40px]
					sm:py-10"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex w-fit flex-col gap-4">
					<Controller
						name="otp"
						control={form.control}
						render={({ field: { onChange, value } }) => {
							return (
								<ReactOTPInput
									value={value}
									onChange={onChange}
									shouldAutoFocus
									numInputs={6}
									containerStyle="gap-3 flex"
									renderInput={(props) => (
										<input
											{...props}
											className="otp_style !select-none px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
										/>
									)}
								/>
							);
						}}
					/>

					<Button
						variant="primary"
						size="md"
						fullWidth
						disabled={verifyResetPassword.isLoading || !form.formState.isValid}
					>
						{verifyResetPassword.isLoading ? <Spinner /> : "Reset Password"}
					</Button>

					<div className="flex w-full flex-col items-center gap-4">
						<span className="text-body">{formatCountdown(countdown)}</span>

						<Button
							size="xs"
							fullWidth
							variant="outlinePrimary"
							onClick={!(requestPasswordReset.isLoading || isResendDisabled) ? handleResendOTP : () => {}}
							disabled={requestPasswordReset.isLoading || isResendDisabled}
							className="!h-7 max-w-[150px] items-center justify-center !py-2"
							style={{
								opacity: requestPasswordReset.isLoading || isResendDisabled ? 0.2 : 1,
							}}
						>
							<span className="flex flex-row gap-2">
								<Timer size={16} className="" />
								{requestPasswordReset.isLoading ? <Spinner size={16} /> : "Resend Code"}
							</span>
						</Button>
					</div>
				</div>
			</form>
		</Container>
	);
}

export default ResetPasswordVerificationForm;
