"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Lottie from "@/components/common/lottie";
import { Container } from "@/components/common/container";
import { useResetPassword } from "@/lib/api";
import { RESET_PASSWORD_OTP_KEY, spChars, VERIFY_FORGOT_PASSWORD_KEY } from "@/lib/utils";
import success from "@/lottiefiles/success.json";
import { resetPasswordSchema } from "@/lib/validations";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { Button } from "@/components/common/button";
import { useForgotPasswordDialogState } from "@/lib/store/security";
import { AuthEnums } from "@/lib/enums";
import { useGetParams } from "@/hooks/use-get-params";
import { Spinner } from "@/components/common/loader";

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm(): React.JSX.Element {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();
	const pathname = usePathname();
	const auth = useGetParams("auth");

	const { forgotPasswordResponse, otp: dotp } = useForgotPasswordDialogState();
	const forgotPasswordCookie = getCookie(VERIFY_FORGOT_PASSWORD_KEY);
	const fpCookie = forgotPasswordCookie ? JSON.parse(forgotPasswordCookie) : {};
	const resetPassworfCookie = getCookie(RESET_PASSWORD_OTP_KEY);
	const rpCookie = resetPassworfCookie ? JSON.parse(resetPassworfCookie) : {};

	const { email: vse, token: vst } = fpCookie;
	const { email: sre, token: srt } = forgotPasswordResponse;
	const { otp: motp } = rpCookie;
	const c = {
		email: vse || sre,
		token: vst || srt,
		otp: dotp || motp,
	};
	const { email, token, otp } = c;

	const changePassword = useResetPassword();

	const resetForm = useForm<ResetFormValues>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit: SubmitHandler<ResetFormValues> = (values) => {
		changePassword.mutate(
			{ tempToken: token, token: otp, password: values.password },
			{
				onSuccess: () => {
					if (isMobile) {
						router.push(`/${AuthEnums.FORGOT_PASSWORD_RESET_SUCCESS}`);
						deleteCookie(RESET_PASSWORD_OTP_KEY);
					} else {
						router.push(`/?auth=${AuthEnums.FORGOT_PASSWORD_RESET_SUCCESS}`);
					}
				},
			}
		);
	};

	const { password } = resetForm.getValues();
	const { confirmPassword } = resetForm.getValues();

	const passwordWatch = resetForm.watch("password");
	const confirmPasswordWatch = resetForm.watch("confirmPassword");

	const validatingErr = useMemo(
		() => ({
			isMinLength: password?.length >= 8 || false,
			checkLowerUpper: (/[A-Z]/.test(password) && /[a-z]/.test(password)) || false,
			checkNumber: !(password?.match(/\d+/g) == null),
			specialCharacter: spChars.test(password) || false,
			confirmedPassword:
				(password === confirmPassword && password !== "" && password !== undefined && password !== null) ||
				false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[passwordWatch, confirmPasswordWatch]
	);

	// Check if when user starts typing the password
	const isPasswordTyping = passwordWatch !== "" && passwordWatch !== undefined && passwordWatch !== null;

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
		<>
			{auth === AuthEnums.FORGOT_PASSWORD_RESET || pathname === `/${AuthEnums.FORGOT_PASSWORD_RESET}` ? (
				<Container className="flex h-full w-full flex-col items-center justify-center gap-6 max-sm:p-0 sm:max-w-2xl">
					<div className="flex flex-col items-center gap-2 text-center">
						<h3 className="font-sans text-2xl font-bold text-title sm:text-white 2xl:text-3xl">
							Reset Password
						</h3>
						<p className="font-sans text-base leading-normal tracking-tight text-body sm:text-white">
							Choose a new password for your account
						</p>
					</div>
					<form
						onSubmit={resetForm.handleSubmit(onSubmit)}
						className="relative z-[100] mx-auto flex w-full flex-col items-center gap-6 rounded-2xl bg-white max-sm:p-4 sm:max-w-[600px]
							sm:px-[40px] sm:py-10"
					>
						<div className="flex w-full flex-col gap-4">
							<div className="relative mb-2 flex flex-col gap-2">
								<label htmlFor="password" className="text-base text-body sm:text-sm">
									Create Password
								</label>
								<input
									id="password"
									{...resetForm.register("password")}
									className="input_style"
									placeholder="create password"
									type="password"
								/>
								{isPasswordTyping && (
									<div className="flex flex-col gap-4 p-4 text-xs text-body">
										<PasswordCriteria
											isValidated={validatingErr.isMinLength}
											criteria="At least 8 characters"
											isSignUp
										/>
										<PasswordCriteria
											isValidated={validatingErr.checkLowerUpper}
											criteria="Upper and lower case characters"
											isSignUp
										/>
										<PasswordCriteria
											isValidated={validatingErr.checkNumber}
											criteria="1 or more numbers"
											isSignUp
										/>
										<PasswordCriteria
											isValidated={validatingErr.specialCharacter}
											criteria="1 or more special characters"
											isSignUp
										/>
										<PasswordCriteria
											isValidated={validatingErr.confirmedPassword}
											criteria="passwords must match"
											isSignUp
										/>
									</div>
								)}
							</div>

							<div className="relative mb-2 flex flex-col gap-2">
								<label htmlFor="confirmPassword" className="text-base text-body sm:text-sm">
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									{...resetForm.register("confirmPassword")}
									className="input_style"
									placeholder="re-type password"
									type="password"
								/>
							</div>
						</div>

						<Button
							variant="primary"
							size="md"
							className=""
							fullWidth
							disabled={!resetForm.formState.isValid || changePassword.isLoading}
						>
							{changePassword.isLoading ? <Spinner /> : "Reset Password"}
						</Button>
					</form>
				</Container>
			) : null}
			{auth === AuthEnums.FORGOT_PASSWORD_RESET_SUCCESS ||
			pathname === `/${AuthEnums.FORGOT_PASSWORD_RESET_SUCCESS}` ? (
				<Container
					className="mx-auto mt-8 flex w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl bg-white p-8 px-[40px] py-10
						text-center text-body sm:mt-28"
				>
					<div className="flex w-full max-w-[150px] items-center justify-center">
						<Lottie animationData={success} />
					</div>
					<h6 className="my-4 flex-wrap text-lg font-thin opacity-[0.8]">Password Reset Successful.</h6>
					<Button
						variant="primary"
						size="md"
						className=""
						fullWidth
						onClick={() => {
							deleteCookie(VERIFY_FORGOT_PASSWORD_KEY);
							if (isMobile) {
								router.push(`/${AuthEnums.LOGIN}`);
							} else {
								router.push(`/?auth=${AuthEnums.LOGIN}`);
							}
						}}
					>
						Login
					</Button>
				</Container>
			) : null}
		</>
	);
}

export default ResetPasswordForm;
