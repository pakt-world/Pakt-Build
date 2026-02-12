"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useLogin } from "@/lib/api";
import { Spinner } from "@/components/common/loader";
import { loginSchema } from "@/lib/validations";
import { Button } from "@/components/common/button";
import { useLoginDialogState, useSignUpDialogState } from "@/lib/store/security";
import { AuthEnums } from "@/lib/enums";
import { handleAuthResponse } from "@/widgets/authentication/_utils";

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = (): React.JSX.Element => {
	const isMobile = useMediaQuery("(max-width: 640px)");

	const { setLoginResponse } = useLoginDialogState();
	const { setSignUpResponse } = useSignUpDialogState();
	const login = useLogin();
	const router = useRouter();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
		login.mutate(values, {
			onSuccess: (data) => {
				handleAuthResponse({
					data,
					isMobile,
					router,
					setLoginResponse,
					setSignUpResponse,
					isSignIn: true,
					isGoogleSignIn: false,
				});
			},
		});
	};

	return (
		<form
			method="post"
			onSubmit={form.handleSubmit(onSubmit)}
			className="mx-auto flex w-full flex-col items-center gap-6 rounded-2xl bg-white p-4 sm:max-w-[600px] sm:px-[40px] sm:py-10"
		>
			<Link href={`/?auth=signin_method`} className="inline-flex items-center justify-start gap-2 self-start">
				<ChevronLeft size={24} className="text-[#007C5B]" />
				<div className="text-base leading-normal tracking-tight text-[#007c5b]">Log in another way</div>
			</Link>
			<div className="flex w-full flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-base text-body sm:text-sm">
						Email Address
					</label>

					<input {...form.register("email")} className="input_style" placeholder="Email Address" />
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-base text-body sm:text-sm">
						Password
					</label>
					<input
						{...form.register("password")}
						className="input_style"
						placeholder="Password"
						type="password"
					/>
				</div>

				<div className="flex items-center justify-end">
					<span
						onClick={() => {
							if (isMobile) {
								router.push(`/${AuthEnums.FORGOT_PASSWORD}`);
							} else {
								router.push(`/?auth=${AuthEnums.FORGOT_PASSWORD}`);
							}
						}}
						className="cursor-pointer font-bold text-primary hover:underline"
					>
						Forgot Password?
					</span>
				</div>
			</div>

			<Button
				fullWidth
				disabled={!form.formState.isValid || login.isLoading}
				className="touch-manipulation"
				variant="primary"
			>
				{login.isLoading ? <Spinner /> : "Login"}
			</Button>
		</form>
	);
};

export default LoginForm;
