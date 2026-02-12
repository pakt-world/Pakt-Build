"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo } from "react";
import * as Form from "@radix-ui/react-form";
import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { Button } from "@/components/common/button";
import { editProfileFormSchema } from "@/lib/validations";
import { AccountProps, UpdateUserDataProps } from "@/lib/types/account";
import { useUpdateAccount } from "@/lib/api/account";
import { FormVType } from "../../../../_shared/types";
import { CountryDropdown } from "@/widgets/settings/_shared/countries-dropdown";
import { StateDropdown } from "@/widgets/settings/_shared/states-dropdown";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
	form: UseFormReturn<EditProfileFormValues>;
	profileCompleted: boolean;
	userAccount: AccountProps | null;
	userData: UpdateUserDataProps;
}

export const ProfileDetails = ({ form, userAccount, userData, profileCompleted }: FormProps) => {
	const updateAccount = useUpdateAccount();
	const queryClient = useQueryClient();

	// Get country form value
	const countryValue = form.watch("country");

	const getJSONV = (data: FormVType) =>
		JSON.stringify({
			name: data.firstName,
			role: data.title,
			country: data.country,
			region: data.location,
			// skills: data.tags,
			// bio: data.bio,
			// x: data.x,
			// website: data.website,
			// instagram: data.instagram,
			// github: data.github,
			// tiktok: data.tiktok,
		});

	const noNewChange = useMemo(() => {
		const formV = form.getValues();
		const btaOValue = btoa(getJSONV(formV));
		const btaOV = btoa(getJSONV(form.control._defaultValues as FormVType));
		return btaOV == btaOValue;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch()]);

	const shouldIncludeDescription = !!userData.bio;

	const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
		const payload = {
			firstName: values.firstName,
			profile: {
				contact: {
					state: values.location,
					city: values.location,
					country: values.country,
				},
				bio: {
					title: values.title,
					...(!shouldIncludeDescription ? {} : { description: userData.bio }),
				},
				talent: {
					tags: [...(userData.tags || [])],
				},
			},
			meta: {
				...userAccount?.meta,
				profileLinks: {
					website: userData.website,
					x: userData.x,
					tiktok: userData.tiktok,
					instagram: userData.instagram,
					github: userData.github,
				},
			},
			isPrivate: userData.isPrivate,
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
		<Form.Root className="flex h-auto w-full flex-col gap-4">
			<div className="size-full">
				<div className="h-full rounded-2xl bg-white p-6">
					<div className="mb-4 flex flex-row items-center justify-between">
						<p className="text-lg font-bold text-title">Edit Profile Details</p>
					</div>
					<div className="flex">
						<div className="relative flex w-full flex-col gap-6">
							<div id="input-row" className="flex w-full flex-row justify-between gap-4">
								<Form.Field name="firstName" className="relative w-1/2">
									<Form.Label className="text-[15px] font-medium leading-[35px] text-body">
										Full Name
									</Form.Label>
									<input
										{...form.register("firstName")}
										className="w-full rounded-xl border border-line !bg-[#FCFCFD] px-4 py-3"
										placeholder="Enter full name"
									/>
									<span className="absolute -bottom-6 flex w-full">
										{form.formState.errors.firstName?.message && (
											<span className="text-sm text-red-500">
												{form.formState.errors.firstName?.message}
											</span>
										)}
									</span>
								</Form.Field>
								<Form.Field name="title" className="relative w-1/2">
									<Form.Label className="text-[15px] font-medium leading-[35px] text-body">
										Role
									</Form.Label>
									<input
										{...form.register("title")}
										className="w-full rounded-xl border border-line !bg-[#FCFCFD] px-4 py-3"
										placeholder="E.g Developer"
									/>
									<span className="absolute -bottom-6 flex w-full">
										{form.formState.errors.title?.message && (
											<span className="text-sm text-red-500">
												{form.formState.errors.title?.message}
											</span>
										)}
									</span>
								</Form.Field>
							</div>
							<div id="input-row" className="flex w-full flex-row justify-between gap-4">
								<Form.Field name="email" className="relative w-1/2">
									<Form.Label className="text-[15px] font-medium leading-[35px] text-body">
										Email Address
									</Form.Label>
									<input
										{...form.register("email")}
										className="w-full rounded-xl border border-line !bg-[#FCFCFD] px-4 py-3"
										placeholder="Enter email Address"
										readOnly
									/>
									<span className="absolute -bottom-6 flex w-full">
										{form.formState.errors.email?.message && (
											<span className="text-sm text-red-500">
												{form.formState.errors.email?.message}
											</span>
										)}
									</span>
								</Form.Field>
								<Form.Field name="country" className="relative w-1/2">
									<Controller
										name="country"
										control={form.control}
										render={({ field: { onChange, value } }) => {
											return (
												<Form.Field className="flex w-full flex-col" name="country">
													<Form.Label className="h-max w-max text-[15px] font-medium leading-[35px] text-body">
														Country
													</Form.Label>
													<CountryDropdown
														onChange={onChange}
														value={value}
														setValue={form.setValue}
													/>
												</Form.Field>
											);
										}}
									/>

									<span className="absolute -bottom-6 flex w-full">
										{form.formState.errors.country?.message && (
											<span className="text-sm text-red-500">
												{form.formState.errors.country?.message}
											</span>
										)}
									</span>
								</Form.Field>
							</div>
							<div id="input-row" className="flex w-full flex-row justify-between gap-4">
								<Form.Field name="location" className="relative w-1/2">
									<Controller
										name="location"
										control={form.control}
										render={({ field: { onChange, value } }) => {
											return (
												<Form.Field className="flex w-full flex-col" name="location">
													<Form.Label className="text-[15px] font-medium leading-[35px] text-body">
														Region
													</Form.Label>
													<StateDropdown
														onChange={onChange}
														value={value}
														countryValue={countryValue}
													/>
												</Form.Field>
											);
										}}
									/>
									<span className="absolute -bottom-6 flex w-full">
										{form.formState.errors.location?.message && (
											<span className="text-sm text-red-500">
												{form.formState.errors.location?.message}
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
									type="button"
									className="min-w-[132px]"
									disabled={updating || !profileCompleted || noNewChange}
									onClick={() => {
										onSubmit(form.getValues());
									}}
								>
									{updating ? <Spinner size={18} /> : "Save Changes"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Form.Root>
	);
};
