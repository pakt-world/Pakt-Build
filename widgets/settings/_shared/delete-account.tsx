"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronLeft, ChevronUp, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "pakt-ui";
import { type ReactElement, useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { Modal } from "@/components/common/modal";
import { useDeleteAccount } from "@/lib/api/account";
import { useGetWalletDetails } from "@/lib/api/wallet";
import { ClearLoggedInUserCookieStates, formatNumberWithCommas } from "@/lib/utils";
import { deleteAccountSchema } from "@/lib/validations";
import { Checkbox } from "@/components/common/checkbox";

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

const DeleteAccount = (): ReactElement => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 640px)");

	const [showDelete, setShowDelete] = useState(false);
	const [passwordModal, setPasswordModal] = useState(false);
	const [showBackupModal, setShowBackupModal] = useState(false);

	const { data: walletData } = useGetWalletDetails({});

	const totalWalletBalance: number | string = walletData?.totalBalance ?? 0.0;

	const deleteAccount = useDeleteAccount();

	const queryClient = useQueryClient();

	const form = useForm<DeleteAccountFormValues>({
		resolver: zodResolver(deleteAccountSchema),
		reValidateMode: "onBlur",
		defaultValues: {
			confirm: false,
			password: "",
			irreversible: false,
		},
	});

	const onSubmit: SubmitHandler<DeleteAccountFormValues> = (values) => {
		deleteAccount.mutate(
			{
				password: values.password,
			},
			{
				onSuccess: () => {
					form.reset({
						confirm: false,
						password: "",
						irreversible: false,
					});
					setPasswordModal(false);
					// deleteCookie(AUTH_TOKEN_KEY);
					ClearLoggedInUserCookieStates();
					queryClient.clear();
					router.push("/");
				},
			}
		);
	};

	useEffect(() => {
		if (isMobile) setShowDelete(true);
	}, [isMobile]);

	return (
		<>
			<form className="" onSubmit={form.handleSubmit(onSubmit)}>
				<div
					className={`relative overflow-hidden sm:rounded-lg ${showDelete ? "h-[400px] sm:h-[350px]" : "h-[86px]"} transition-all `}
				>
					<div
						className="z-50 flex h-[54px] cursor-pointer flex-row items-center bg-white p-4 max-sm:w-full max-sm:gap-4 max-sm:border-y
							max-sm:!border-l-0 max-sm:!border-r-0 max-sm:border-green-lighter sm:relative sm:!h-[86px] sm:justify-between
							sm:rounded-lg"
						onClick={() => {
							if (!isMobile) {
								setShowDelete(!showDelete);
							} else {
								router.back();
							}
						}}
						role="button"
						onKeyDown={(e) => {
							if (!isMobile) {
								if (e.key === "Enter" || e.key === " ") {
									setShowDelete(!showDelete);
								}
							} else {
								router.back();
							}
						}}
						tabIndex={0}
					>
						{isMobile && <ChevronLeft className="text-title" />}
						<p className="text-lg font-bold text-title">Delete Account</p>
						{!isMobile &&
							(showDelete ? <ChevronUp className="text-body" /> : <ChevronDown className="text-body" />)}
					</div>

					<div
						className="my-4 flex w-full flex-col gap-4 bg-white max-sm:!border-l-0 max-sm:!border-r-0 max-sm:!border-t-0 max-sm:p-4
							sm:rounded-lg sm:p-4"
					>
						<div className="bg-yellow/200 flex w-full flex-row gap-4 rounded-lg sm:p-4">
							<InfoIcon size={40} className="text-red-700 max-sm:w-[9%]" />
							<div className="max-sm:w-[90%]">
								<p className="text-base font-bold text-body">You’re Deleting Your Account</p>
								<p className="text-sm font-thin leading-5 text-body">
									Deleting your account will permanently remove all data associated with it, including
									projects, APIs, and analytics. This action cannot be undone. Please make sure you
									have downloaded any necessary data or backups before proceeding with account
									deletion.
								</p>
							</div>
						</div>
						<div className="flex flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center">
							<div className="mb-3 flex items-center gap-4 text-sm text-body sm:mb-0 sm:text-base">
								<Controller
									name="confirm"
									control={form.control}
									render={({ field: { onChange: change, value } }) => (
										<Checkbox
											id="confirm"
											{...form.register("confirm")}
											checked={value}
											onCheckedChange={change}
											className="checkbox_style"
										/>
									)}
								/>
								I confirm my account deletion
							</div>

							<Button
								variant="destructive2"
								disabled={!form.watch("confirm")}
								onClick={() => {
									if ((totalWalletBalance as number) > 0) {
										setShowBackupModal(true);
									} else {
										setPasswordModal(true);
									}
								}}
								type="button"
								size="lg"
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
				<Modal
					isOpen={passwordModal}
					onOpenChange={() => {
						setPasswordModal(!passwordModal);
						form.reset({
							confirm: false,
							password: "",
							irreversible: false,
						});
					}}
					className="h-fit !overflow-hidden rounded-2xl border border-line bg-white p-6 shadow"
					// disableClickOutside
				>
					<div className="flex w-full flex-col items-center justify-center">
						<div className="flex w-full flex-col items-center justify-center gap-2">
							<Dialog.Title className="text-center text-2xl font-bold leading-loose tracking-wide text-title">
								Delete Account
							</Dialog.Title>
							<p className="text-center text-base leading-normal tracking-tight text-body">
								Please enter your password to confirm account deletion.
							</p>
						</div>
						<Input
							{...form.register("password")}
							type="password"
							className="my-6 w-full !rounded-xl border !border-line bg-input-bg"
							placeholder="Enter password"
						/>
						<div className="flex items-center gap-4 text-sm text-body">
							<Controller
								name="irreversible"
								control={form.control}
								render={({ field: { onChange: change, value } }) => (
									<Checkbox
										id="irreversible"
										{...form.register("irreversible")}
										checked={value}
										onCheckedChange={change}
										className="checkbox_style"
									/>
								)}
							/>
							I understand that this action is irreversible
						</div>
						<div className="mt-8 flex items-center gap-4">
							<Button
								variant="secondary"
								onClick={() => {
									setPasswordModal(false);
									form.reset({
										confirm: false,
										password: "",
										irreversible: false,
									});
								}}
								type="button"
							>
								No, Cancel
							</Button>
							<Button
								variant="primary"
								type="button"
								disabled={
									form.formState.isSubmitting || !form.formState.isValid || deleteAccount.isLoading
								}
								onClick={() => {
									onSubmit(form.getValues());
								}}
							>
								{deleteAccount.isLoading ? <Spinner size={18} /> : "Yes, Delete"}
							</Button>
						</div>
					</div>
				</Modal>
			</form>
			<Modal
				isOpen={showBackupModal}
				onOpenChange={() => {
					setShowBackupModal(!showBackupModal);
				}}
				className="h-fit !overflow-hidden rounded-2xl border border-line bg-white p-6 shadow"
				// disableClickOutside
			>
				<div className="flex w-full flex-col items-center justify-center gap-6">
					<div className="flex w-full flex-col items-center justify-center gap-2">
						<h3 className="text-center text-2xl font-bold leading-loose tracking-wide text-title">
							Withdraw Funds!
						</h3>
						<p className="text-center text-base leading-normal tracking-tight text-body">
							You still have tokens in your wallet. Please withdraw all value <br />
							before deleting your account.
						</p>
					</div>
					<div className="inline-flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-line bg-secondary/30 p-4 shadow">
						<h3 className="text-2xl font-bold leading-loose tracking-wide text-title">
							${formatNumberWithCommas((totalWalletBalance as number).toFixed(2))}
						</h3>

						<p className="text-lg leading-relaxed tracking-wide text-body">Total Wallet Balance</p>
					</div>

					<Button
						variant="primary"
						type="submit"
						className="w-full"
						size="lg"
						onClick={() => {
							setShowBackupModal(false);
						}}
						asChild
					>
						<Link href="/wallet">Go To Wallet</Link>
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default DeleteAccount;
