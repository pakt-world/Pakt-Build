"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useMemo } from "react";
import { Input } from "pakt-ui";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY, spChars, USER_KEY } from "@/lib/utils";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { changePasswordFormSchema } from "@/lib/validations";
import { useChangePassword } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";

type EditProfileFormValues = z.infer<typeof changePasswordFormSchema>;

export const ChangePasswordForm4Desktop = (): ReactElement => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const changePassword = useChangePassword();
	const { clearStore, setUser } = useUserState();

	const form = useForm<EditProfileFormValues>({
		resolver: zodResolver(changePasswordFormSchema),
		reValidateMode: "onChange",
	});

	const Logout = async (): Promise<void> => {
		setUser(null);
		clearStore();
		deleteCookie(AUTH_TOKEN_KEY);
		deleteCookie(USER_KEY);

		queryClient.clear();
		queryClient.removeQueries();
		queryClient.getMutationCache().clear();

		// Invalidate and refetch feed queries to reload the public feed
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["get-dashboard-timeline_1_10"] }),
			queryClient.refetchQueries({ queryKey: ["get-dashboard-timeline_1_10"], type: "active" }),
		]);
		router.push("/");
	};

	const onChangePasswordSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
		changePassword.mutate(
			{
				oldPassword: values.currentPassword,
				newPassword: values.newPassword,
			},
			{
				onSuccess: () => {
					form.reset({
						currentPassword: "",
						newPassword: "",
						confirmNewPassword: "",
					});
					Logout();
				},
			}
		);
	};

	const { newPassword } = form.getValues();
	const { confirmNewPassword } = form.getValues();

	const newPasswordWatch = form.watch("newPassword");
	const confirmNewPasswordWatch = form.watch("confirmNewPassword");

	const validatingErr = useMemo(
		() => ({
			isMinLength: newPassword?.length >= 8 || false,
			checkLowerUpper: (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) || false,
			checkNumber: !(newPassword?.match(/\d+/g) == null),
			specialCharacter: spChars.test(newPassword) || false,
			confirmedPassword:
				(newPassword === confirmNewPassword &&
					newPassword !== "" &&
					newPassword !== undefined &&
					newPassword !== null) ||
				false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[newPasswordWatch, confirmNewPasswordWatch]
	);

	// Check if when user starts typing the password
	const isPasswordTyping = newPasswordWatch !== "" && newPasswordWatch !== undefined && newPasswordWatch !== null;

	return (
		<div className="z-[2] flex h-fit w-[30%] flex-col rounded-2xl bg-white 2xl:w-1/4">
			<div className="flex flex-col gap-4 p-4" onSubmit={form.handleSubmit(onChangePasswordSubmit)}>
				<h3 className="text-lg font-bold">Change Password</h3>
				<Input
					{...form.register("currentPassword")}
					type="password"
					className="!h-[54px] w-full !rounded-2xl !border-line !bg-input-bg"
					placeholder="Enter current password"
					label="Current Password"
				/>
				{form.formState.errors.currentPassword?.message && (
					<span className="text-sm text-red-500">{form.formState.errors.currentPassword?.message}</span>
				)}
				<Input
					{...form.register("newPassword")}
					type="password"
					className="!h-[54px] w-full !rounded-2xl !border-line !bg-input-bg"
					placeholder="Enter new password"
					label="New Password"
				/>
				{isPasswordTyping && (
					<div className="flex flex-col gap-4">
						<p className="text-sm text-body">Password must contain</p>
						<div className="flex flex-col gap-4 p-4 text-xs text-body">
							<PasswordCriteria
								isValidated={validatingErr.isMinLength}
								criteria="At least 8 characters"
							/>
							<PasswordCriteria
								isValidated={validatingErr.checkLowerUpper}
								criteria="Upper and lower case characters"
							/>
							<PasswordCriteria isValidated={validatingErr.checkNumber} criteria="1 or more numbers" />
							<PasswordCriteria
								isValidated={validatingErr.specialCharacter}
								criteria="1 or more special characters"
							/>
							<PasswordCriteria
								isValidated={validatingErr.confirmedPassword}
								criteria="Password must match"
							/>
						</div>
					</div>
				)}
				<Input
					{...form.register("confirmNewPassword")}
					type="password"
					className="!h-[54px] w-full !rounded-2xl !border-line !bg-input-bg"
					placeholder="Re-enter new password"
					label="Confirm New Password"
				/>
				{form.formState.errors.confirmNewPassword?.message && (
					<span className="text-sm text-red-500">{form.formState.errors.confirmNewPassword?.message}</span>
				)}
				<Button
					variant="primary"
					size="lg"
					onClick={() => {
						onChangePasswordSubmit(form.getValues());
					}}
					disabled={
						!validatingErr.isMinLength ||
						!validatingErr.checkLowerUpper ||
						!validatingErr.checkNumber ||
						!validatingErr.specialCharacter ||
						!validatingErr.confirmedPassword ||
						changePassword.isLoading
					}
				>
					{changePassword.isLoading ? <Spinner /> : "Save Changes"}
				</Button>
			</div>
		</div>
	);
};
