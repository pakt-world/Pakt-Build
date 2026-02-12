"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { setCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useRequestPasswordReset } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/validations";
import { Button } from "../../../../../components/common/button";
import { useForgotPasswordDialogState } from "@/lib/store/security";
import { AuthEnums, VerifyTypesEnums } from "@/lib/enums";
import { VERIFY_FORGOT_PASSWORD_KEY } from "@/lib/utils";
// import Logger from "@/lib/utils/logger";

type FormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = (): JSX.Element => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();

	const { setForgotPasswordResponse } = useForgotPasswordDialogState();

	const requestPasswordReset = useRequestPasswordReset();

	const form = useForm<FormValues>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit: SubmitHandler<FormValues> = (values) => {
		requestPasswordReset.mutate(values, {
			onSuccess: (data) => {
				const { tempToken } = data;
				if (isMobile) {
					const mpayload = {
						email: values.email,
						token: tempToken.token,
						verifyType: VerifyTypesEnums.EMAIL,
					};
					const userString = JSON.stringify(mpayload);
					setCookie(VERIFY_FORGOT_PASSWORD_KEY, userString);
					router.push(`/${AuthEnums.VERIFY_FORGOT_PASSWORD}`);
				} else {
					setForgotPasswordResponse({
						email: values.email,
						token: tempToken.token,
					});
					router.push(`/?auth=${AuthEnums.VERIFY_FORGOT_PASSWORD}`);
				}
			},
		});
	};

	return (
		<form
			className="relative mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl bg-white p-4 sm:px-[40px] sm:py-10"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<div className="relative flex w-full flex-col gap-2">
				<label className="font-sans text-base text-body sm:text-sm" htmlFor="email">
					Email
				</label>
				<input
					{...form.register("email")}
					placeholder="Email"
					type="email"
					className="input_style"
					id="email"
				/>
			</div>

			<Button variant="primary" fullWidth disabled={!form.formState.isValid || requestPasswordReset.isLoading}>
				{requestPasswordReset.isLoading ? <Spinner /> : "Reset Password"}
			</Button>

			<Button
				variant="ordinary"
				className="text-primary"
				onClick={() => {
					if (isMobile) {
						router.push(`/${AuthEnums.LOGIN}`);
					} else {
						router.push(`/?auth=${AuthEnums.LOGIN}`);
					}
				}}
			>
				Back to Login
			</Button>
		</form>
	);
};

export default ForgotPasswordForm;
