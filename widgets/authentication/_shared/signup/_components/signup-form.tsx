"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useSignUp } from "@/lib/api";
import { spChars } from "@/lib/utils";
import { signupSchema } from "@/lib/validations";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { Button } from "@/components/common/button";
import { useSignUpDialogState } from "@/lib/store/security";
import { AuthEnums } from "@/lib/enums";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { Spinner } from "@/components/common/loader";
import { handleAuthResponse } from "@/widgets/authentication/_utils";

type FormValues = z.infer<typeof signupSchema>;

const SignUpForm = (): React.JSX.Element => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 640px)");

	const { setSignUpResponse } = useSignUpDialogState();

	const signup = useSignUp();

	const form = useForm<FormValues>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit: SubmitHandler<FormValues> = (values) => {
		signup.mutate(
			{ ...values },
			{
				onSuccess: (data) => {
					handleAuthResponse({
						data,
						isMobile,
						router,
						setSignUpResponse,
						isSignUp: true,
						isGoogleSignup: false,
					});
				},
			}
		);
	};

	const { password } = form.getValues();
	const { confirmPassword } = form.getValues();

	const passwordWatch = form.watch("password");
	const confirmPasswordWatch = form.watch("confirmPassword");

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

	return (
		<form
			method="post"
			onSubmit={form.handleSubmit(onSubmit)}
			className="relative z-[100] mx-auto flex w-full flex-col items-center gap-6 rounded-2xl bg-white p-4 shadow sm:max-w-[600px]
				sm:px-[40px] sm:py-10"
		>
			<Link href={`/?auth=signup_method`} className="inline-flex items-center justify-start gap-2 self-start">
				<ChevronLeft size={24} className="text-[#007C5B]" />
				<div className="text-base leading-normal tracking-tight text-[#007c5b]">Sign up another way</div>
			</Link>
			<div className="flex w-full flex-col gap-2">
				<div className="grid grid-cols-1 gap-4">
					<div className="relative mb-1 flex w-full flex-col gap-2">
						<label htmlFor="firstName" className="text-base text-body sm:text-sm">
							Full Name
						</label>
						<input
							id="firstName"
							{...form.register("firstName")}
							placeholder="Enter Full Name"
							className="input_style"
						/>
						<InputErrorMessage message={form.formState.errors.firstName?.message} />
					</div>
				</div>

				<div className="relative mb-1 flex flex-col gap-2">
					<label htmlFor="email" className="text-base text-body sm:text-sm">
						Email Address
					</label>
					<input
						id="email"
						{...form.register("email")}
						placeholder="Enter Email Address"
						className="input_style"
					/>
					<InputErrorMessage message={form.formState.errors.email?.message} />
				</div>

				<div className="relative mb-1 flex flex-col gap-2">
					<label htmlFor="password" className="text-base text-body sm:text-sm">
						Create Password
					</label>
					<input
						id="password"
						{...form.register("password")}
						className="input_style"
						placeholder="Password"
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

				<div className="relative mb-1 flex flex-col gap-2">
					<label htmlFor="confirmPassword" className="text-base text-body sm:text-sm">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						{...form.register("confirmPassword")}
						className="input_style"
						placeholder="Confirm Password"
						type="password"
					/>
				</div>
			</div>

			<Button className="" fullWidth disabled={!form.formState.isValid || signup.isLoading} variant="primary">
				{signup.isLoading ? <Spinner /> : "Signup"}
			</Button>
			{!isMobile && (
				<div className="relative flex w-full items-center justify-center gap-2">
					<span className="text-title">Already have an account? </span>
					<span
						onClick={() => {
							router.push(`/?auth=${AuthEnums.LOGIN}`);
						}}
						className="cursor-pointer font-bold text-primary hover:underline"
					>
						Login
					</span>
				</div>
			)}
		</form>
	);
};

export default SignUpForm;
