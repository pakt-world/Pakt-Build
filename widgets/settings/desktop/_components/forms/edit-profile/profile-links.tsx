"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Form from "@radix-ui/react-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { SubmitHandler, type UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { type z } from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type editProfileFormSchema } from "@/lib/validations";
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { AccountProps, UpdateUserDataProps } from "@/lib/types/account";
import { FormVType } from "../../../../_shared/types";
import { useUpdateAccount } from "@/lib/api/account";
import { linkChecker } from "@/lib/utils/settings";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
	form: UseFormReturn<EditProfileFormValues>;
	userAccount: AccountProps | null;
	userData: UpdateUserDataProps;
	// profileCompleted: boolean;
}

export const ProfileLinks = ({
	form,
	userData,
	userAccount,
	// profileCompleted
}: FormProps): JSX.Element => {
	const [showLinks, setShowLinks] = useState(false);

	const updateAccount = useUpdateAccount();
	const queryClient = useQueryClient();

	const getJSONV = (data: FormVType) =>
		JSON.stringify({
			// name: data.firstName,
			// role: data.title,
			// country: data.country,
			// region: data.location,
			// skills: data.tags,
			// bio: data.bio,
			x: data.x,
			website: data.website,
			instagram: data.instagram,
			github: data.github,
			tiktok: data.tiktok,
		});

	const noNewChange = useMemo(() => {
		const formV = form.getValues();
		const btaOValue = btoa(getJSONV(formV));
		const btaOV = btoa(getJSONV(form.control._defaultValues as FormVType));
		return btaOV == btaOValue;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch()]);

	const shouldIncludeCityNCountry = !!userData.location && !!userData.country;
	const shouldIncludeDescription = !!userData.bio;

	const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
		const payload = {
			firstName: userData.firstName,
			profile: {
				contact: {
					...(!shouldIncludeCityNCountry
						? {}
						: { state: userData.location, city: userData.location, country: userData.country }),
				},
				bio: {
					title: userData.title,
					...(!shouldIncludeDescription ? {} : { description: userData.bio }),
				},
				talent: {
					tags: [...(userData.tags ?? [])],
				},
			},
			meta: {
				...userAccount?.meta,
				profileLinks: {
					website: linkChecker(values.website as string),
					x: linkChecker(values.x as string),
					tiktok: linkChecker(values.tiktok as string),
					instagram: linkChecker(values.instagram as string),
					github: linkChecker(values.github as string),
				},
			},
		};
		updateAccount.mutate(
			{ ...payload },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(["account-details"]);
					// router.push("/profile");
				},
			}
		);
	};

	const updating = updateAccount.isLoading;
	return (
		<Form.Root className="flex h-auto w-full">
			<div
				className={`relative w-full overflow-hidden rounded-2xl ${showLinks ? "h-[500px]" : "h-[86px]"} transition-all `}
			>
				<div
					className="relative z-50 flex !h-[86px] cursor-pointer flex-row items-center justify-between rounded-lg bg-white p-4 shadow"
					onClick={() => {
						setShowLinks(!showLinks);
					}}
					role="button"
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setShowLinks(!showLinks);
						}
					}}
					tabIndex={0}
				>
					<p className="text-lg font-bold text-title">Profile Links</p>
					{showLinks ? <ChevronUp className="text-body" /> : <ChevronDown className="text-body" />}
				</div>
				<div className="my-4 flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
					<div className="flex flex-row gap-4">
						<Form.Field name="website" className="relative w-1/2">
							<Form.Label className="text-[15px] font-medium leading-[35px] text-body">
								Website
							</Form.Label>
							<input
								{...form.register("website")}
								className="h-[54px] w-full rounded-2xl border border-line !bg-input-bg px-4 py-[13px] !text-body outline-none"
								placeholder="Enter Website url"
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.website?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.website?.message}
									</span>
								)}
							</span>
						</Form.Field>
						<Form.Field name="x" className="relative w-1/2">
							<Form.Label className="text-[15px] font-medium leading-[35px] text-body">X</Form.Label>
							<input
								{...form.register("x")}
								className="h-[54px] w-full rounded-2xl border border-line !bg-input-bg px-4 py-[13px] !text-body"
								placeholder="Enter X url"
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.x?.message && (
									<span className="text-sm text-red-500">{form.formState.errors.x?.message}</span>
								)}
							</span>
						</Form.Field>
					</div>
					<div className="flex flex-row gap-4">
						<Form.Field name="tiktok" className="relative w-1/2">
							<Form.Label className="text-[15px] font-medium leading-[35px] text-body">Tiktok</Form.Label>
							<input
								{...form.register("tiktok")}
								className="h-[54px] w-full rounded-2xl border border-line !bg-input-bg px-4 py-[13px] !text-body"
								placeholder="Enter Tiktok url"
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.tiktok?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.tiktok?.message}
									</span>
								)}
							</span>
						</Form.Field>
						<Form.Field name="instagram" className="relative w-1/2">
							<Form.Label className="text-[15px] font-medium leading-[35px] text-body">
								Instagram
							</Form.Label>
							<input
								{...form.register("instagram")}
								className="h-[54px] w-full rounded-2xl border border-line !bg-input-bg px-4 py-[13px] !text-body"
								placeholder="Enter Instagram url"
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.instagram?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.instagram?.message}
									</span>
								)}
							</span>
						</Form.Field>
					</div>
					<div className="flex flex-row gap-4">
						<Form.Field name="github" className="relative w-1/2">
							<Form.Label className="text-[15px] font-medium leading-[35px] text-body">Github</Form.Label>
							<input
								{...form.register("github")}
								className="h-[54px] w-full rounded-2xl border border-line !bg-input-bg px-4 py-[13px] !text-body"
								placeholder="Enter Github url"
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.github?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.github?.message}
									</span>
								)}
							</span>
						</Form.Field>
					</div>
					<div id="input-row" className="flex w-full flex-row justify-between gap-4">
						<div />
						<Button
							variant="secondaryOutline"
							size="lg"
							// type="submit"
							type="button"
							className="min-w-[132px]"
							disabled={
								updating ||
								// !profileCompleted
								noNewChange
							}
							onClick={() => {
								onSubmit(form.getValues());
							}}
						>
							{updating ? <Spinner size={18} /> : "Save Changes"}
						</Button>
					</div>
				</div>
			</div>
		</Form.Root>
	);
};
