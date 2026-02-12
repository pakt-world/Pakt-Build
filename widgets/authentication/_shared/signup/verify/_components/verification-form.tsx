"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import ReactOTPInput from "react-otp-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { Timer } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Lottie from "@/components/common/lottie";
import success from "@/lottiefiles/success.json";
import { useVerifyEmail, useResendOTP } from "@/lib/api";
import { formatCountdown, AUTH_TOKEN_KEY, userTimezone, TIMEZONE_KEY, VERIFY_SIGNUP_KEY } from "@/lib/utils";
import { Spinner } from "@/components/common/loader";
import { useUserState } from "@/lib/store/account";
import { otpSchema } from "@/lib/validations";
import { Button } from "@/components/common/button";
import { useSignUpDialogState } from "@/lib/store/security";
import { Container } from "@/components/common/container";
import { AuthEnums, TwoFactorAuthEnums } from "@/lib/enums";
import { useGetParams } from "@/hooks/use-get-params";
// import Logger from "@/lib/utils/logger";

type FormValues = z.infer<typeof otpSchema>;

const RESEND_INTERVAL = 60000; // 1 minute
const COUNTDOWN_START = 60; // 60 seconds
const ONE_SECOND = 1000; // 1 second

const SignUpVerificationForm = (): JSX.Element => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const isClient = useIsClient();
	const router = useRouter();
	const auth = useGetParams("auth");
	const pathname = usePathname();

	const { setUser } = useUserState();
	const { signUpResponse } = useSignUpDialogState();

	// Token Set
	const authToken = getCookie(`pre_${AUTH_TOKEN_KEY}`);

	const signupCookies = getCookie(VERIFY_SIGNUP_KEY);
	const vsCookie = signupCookies ? JSON.parse(signupCookies) : {};

	const { email: vse, token: vst, verifyType: vsvt } = vsCookie;
	const { email: sre, token: srt, verifyType: srvt } = signUpResponse;
	const c = {
		email: vse || sre,
		token: vst || srt,
		verifyType: vsvt || srvt,
	};
	const { email, token, verifyType } = c;

	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(true);

	const resendOTP = useResendOTP();
	const verifyEmail = useVerifyEmail();

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
				router.push(`/${AuthEnums.SIGNUP}`);
			} else {
				router.push(`/?auth=${AuthEnums.SIGNUP}`);
			}
			return;
		}

		verifyEmail.mutate(
			{
				otp,
				token,
			},
			{
				onSuccess: (data) => {
					// Logger.info("Verify Email Response===>>>", data);
					setCookie(`pre_${AUTH_TOKEN_KEY}`, data.token);
					// Set Timezone to localStorage
					localStorage.setItem(TIMEZONE_KEY, data.timeZone ?? userTimezone);
					// @ts-expect-error TODO: Fix this
					setUser(data);
					if (isMobile) {
						router.push(`/${AuthEnums.VERIFY_SIGNUP_SUCCESS}`);
					} else {
						router.push(`/?auth=${AuthEnums.VERIFY_SIGNUP_SUCCESS}`);
					}
				},
			}
		);
	};

	const handleResendOTP = (): void => {
		if (!email) {
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
		if (!(verifyType in TwoFactorAuthEnums) && (!email || !token)) {
			if (isMobile) {
				router.push(`/${AuthEnums.SIGNUP}`);
			} else {
				router.push(`/?auth=${AuthEnums.SIGNUP}`);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, token, verifyType, isMobile]);

	// Logger.info("SignUp Response===>>>", { email, token, pathname });
	if (isClient) {
		return (
			<>
				{auth === AuthEnums.VERIFY_SIGNUP || pathname === `/${AuthEnums.VERIFY_SIGNUP}` ? (
					<form
						className="relative mx-auto flex w-full flex-col items-center gap-6 rounded-2xl bg-white p-4 sm:max-w-[600px] sm:px-[40px] sm:py-10"
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
								type="submit"
								variant="primary"
								fullWidth
								disabled={verifyEmail.isLoading || !form.formState.isValid}
							>
								{verifyEmail.isLoading ? <Spinner /> : "Verify Email"}
							</Button>

							<div className="flex w-full flex-col items-center gap-4">
								<span className="text-body">{formatCountdown(countdown)}</span>
								<div className="w-full max-w-[150px]">
									<Button
										size="xs"
										fullWidth
										type="button"
										variant="outlinePrimary"
										onClick={
											!(resendOTP.isLoading || isResendDisabled) ? handleResendOTP : () => {}
										}
										disabled={resendOTP.isLoading || isResendDisabled}
										className="!h-7 max-w-[150px] items-center justify-center !py-2"
										style={{
											opacity: resendOTP.isLoading || isResendDisabled ? 0.2 : 1,
										}}
									>
										<span className="flex flex-row gap-2">
											<Timer size={16} className="" />
											{resendOTP.isLoading ? <Spinner size={16} /> : "Resend Code"}
										</span>
									</Button>
								</div>
							</div>
						</div>
					</form>
				) : null}
				{auth === AuthEnums.VERIFY_SIGNUP_SUCCESS || pathname === `/${AuthEnums.VERIFY_SIGNUP_SUCCESS}` ? (
					<Container
						className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl bg-white p-8 px-[40px] py-10
							text-center text-body"
					>
						<div className="flex w-full max-w-[150px] items-center justify-center">
							<Lottie animationData={success} />
						</div>
						<h6 className="my-4 flex-wrap text-lg font-thin opacity-[0.8]">Email has been verified</h6>
						<Button
							variant="primary"
							size="md"
							className=""
							fullWidth
							onClick={() => {
								setCookie(AUTH_TOKEN_KEY, authToken);
								deleteCookie(`pre_${AUTH_TOKEN_KEY}`);
								if (isMobile) {
									router.push(`/${AuthEnums.TERMS_AND_CONDITIONS}`);
								} else {
									router.push(`/dashboard/?auth=${AuthEnums.ONBOARDING}`);
								}
							}}
						>
							Get Started
						</Button>
					</Container>
				) : null}
			</>
		);
	}
	return <></>;
};

export default SignUpVerificationForm;
