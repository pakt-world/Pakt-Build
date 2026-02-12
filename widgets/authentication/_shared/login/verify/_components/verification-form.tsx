"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import success from "@/lottiefiles/success.json";
import { formatCountdown, AUTH_TOKEN_KEY, VERIFY_LOGIN_KEY } from "@/lib/utils";
import { useResendOTP, useLoginOTP } from "@/lib/api";
import { AuthEnums, TwoFactorAuthEnums } from "@/lib/enums";
import { otpSchema } from "@/lib/validations";
import { Button } from "@/components/common/button";
import { useLoginDialogState } from "@/lib/store/security";
import { Container } from "@/components/common/container";
import Lottie from "@/components/common/lottie";
import { REDIRECT_STORAGE_KEY } from "@/hooks/use-view-mode-redirect";
import { OtpInput } from "@/components/common/otp-input";
import { Spinner } from "@/components/common/loader";

type FormValues = z.infer<typeof otpSchema>;

const RESEND_INTERVAL = 60000; // 1 minute
const COUNTDOWN_START = 60; // 60 seconds
const ONE_SECOND = 1000; // 1 second

const LoginVerificationForm = (): React.JSX.Element => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);

	// Get the last viewed job ID from localStorage
	const redirectPath = localStorage.getItem(REDIRECT_STORAGE_KEY);

	const { loginResponse } = useLoginDialogState();
	const { email: lre, token: lrtkn, type: lrty } = loginResponse;

	const loginCookies = getCookie(VERIFY_LOGIN_KEY);
	const twoFaCookie = loginCookies ? JSON.parse(loginCookies) : {};
	const { email: tce, token: tctkn, type: tcty } = twoFaCookie;

	const c = {
		email: lre || tce,
		token: lrtkn || tctkn,
		type: lrty || tcty,
	};
	const { email, token, type } = c;

	const router = useRouter();
	const resendOTP = useResendOTP();
	const loginOTP = useLoginOTP();

	// Disable resend OTP button for email verification
	useEffect(() => {
		if (type === TwoFactorAuthEnums.EMAIL) {
			setIsResendDisabled(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		if (!(type in TwoFactorAuthEnums) && (typeof token !== "string" || !token)) {
			if (isMobile) {
				router.push(`/${AuthEnums.LOGIN}`);
			} else {
				router.push(`/?auth=${AuthEnums.LOGIN}`);
			}
			return;
		}

		loginOTP.mutate(
			{
				code: otp,
				tempToken: token,
			},
			{
				onSuccess: (data) => {
					setCookie(AUTH_TOKEN_KEY, data.token);
					if (redirectPath) {
						router.push(redirectPath);
						localStorage.removeItem(REDIRECT_STORAGE_KEY);
					} else {
						router.push("/dashboard"); // Default redirect if no job was saved
					}
					// router.push("/dashboard");
					deleteCookie(VERIFY_LOGIN_KEY);
					setIsCompleted(true);
				},
			}
		);
	};

	const handleResendOTP = (): void => {
		if (typeof email !== "string" || !email) {
			if (isMobile) {
				router.push(`/${AuthEnums.SIGNUP}`);
			} else {
				router.push(`/?auth=${AuthEnums.SIGNUP}`);
			}
			return;
		}

		resendOTP.mutate(
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
		if (!(type in TwoFactorAuthEnums) && (!email || !token)) {
			if (isMobile) {
				router.push(`/${AuthEnums.LOGIN}`);
			} else {
				router.push(`/?auth=${AuthEnums.LOGIN}`);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, token, type, isMobile]);

	return (
		<>
			{!isCompleted && (
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
								return <OtpInput value={value} onChange={onChange} numInputs={6} />;
							}}
						/>

						<Button fullWidth variant="primary" disabled={loginOTP.isLoading || !form.formState.isValid}>
							{loginOTP.isLoading ? <Spinner /> : "Submit"}
						</Button>

						{type === TwoFactorAuthEnums.EMAIL && (
							<div className="flex w-full flex-col items-center gap-4">
								<span className="text-white">{formatCountdown(countdown)}</span>
								<div className="w-full max-w-[120px]">
									<Button
										size="md"
										fullWidth
										className=""
										variant="secondary"
										onClick={handleResendOTP}
										disabled={resendOTP.isLoading || isResendDisabled}
									>
										{resendOTP.isLoading ? <Spinner size={16} /> : "Resend Code"}
									</Button>
								</div>
							</div>
						)}
					</div>
				</form>
			)}
			{isCompleted && (
				<Container
					className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl bg-white p-8 px-[40px] py-10
						text-center text-body"
				>
					<div className="flex w-full max-w-[150px] items-center justify-center">
						<Lottie animationData={success} />
					</div>
					<h6 className="my-4 flex-wrap text-lg font-thin opacity-[0.8]">Login Successful</h6>
				</Container>
			)}
		</>
	);
};

export default LoginVerificationForm;
