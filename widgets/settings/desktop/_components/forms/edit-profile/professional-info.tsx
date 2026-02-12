"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as Form from "@radix-ui/react-form";
import { Controller, SubmitHandler, type UseFormReturn } from "react-hook-form";
import { Textarea } from "pakt-ui";
import { type z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TagInput } from "@/components/common/tag-input";
import { type editProfileFormSchema } from "@/lib/validations";
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { AccountProps, UpdateUserDataProps } from "@/lib/types/account";
import { useUpdateAccount } from "@/lib/api/account";
import { FormVType } from "../../../../_shared/types";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
	form: UseFormReturn<EditProfileFormValues>;
	profileCompleted: boolean;
	userAccount: AccountProps | null;
	userData: UpdateUserDataProps;
}

export const ProfessionalInfo = ({ form, userData, userAccount, profileCompleted }: FormProps): JSX.Element => {
	const [showInfo, setShowInfo] = useState(false);

	const updateAccount = useUpdateAccount();
	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

	const getJSONV = (data: FormVType) =>
		String.fromCharCode(
			...new TextEncoder().encode(
				JSON.stringify({
					skills: data.tags,
					bio: data.bio,
				})
			)
		);

	const noNewChange = useMemo(() => {
		const formV = form.getValues();
		const btaOValue = btoa(getJSONV(formV));
		const btaOV = btoa(getJSONV(form.control._defaultValues as FormVType));
		return btaOV == btaOValue;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch()]);

	const shouldIncludeCityNCountry = !!userData.location && !!userData.country;

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
					description: values.bio,
				},
				talent: {
					tags: [...(values.tags ?? [])],
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
		};
		updateAccount.mutate(
			{ ...payload },
			{
				onSuccess: () => {
					refetchUser();
				},
			}
		);
	};

	const updating = updateAccount.isLoading;
	return (
		<Form.Root className="flex h-auto w-full">
			<div
				className={`relative w-full overflow-hidden rounded-2xl ${showInfo ? "h-[440px]" : "h-[86px]"} transition-all `}
			>
				<div
					className="relative z-50 flex !h-[86px] cursor-pointer flex-row items-center justify-between rounded-lg bg-white p-4"
					onClick={() => {
						setShowInfo(!showInfo);
					}}
					role="button"
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setShowInfo(!showInfo);
						}
					}}
					tabIndex={0}
				>
					<p className="text-lg font-bold text-title"> Professional Information</p>
					{showInfo ? <ChevronUp className="text-body" /> : <ChevronDown className="text-body" />}
				</div>
				<div className="my-4 flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
					<div className="flex flex-row gap-4">
						<div className="relative w-1/2">
							<p className="mb-2 text-[16px]">Skill Sets</p>
							<div className="min-h-[186px] rounded-lg border-2 !border-line !bg-input-bg">
								<Controller
									name="tags"
									control={form.control}
									render={({ field: { onChange, value = [], onBlur } }) => (
										<TagInput<EditProfileFormValues>
											tags={value}
											setTags={onChange}
											className="grow items-start border-none bg-transparent"
											placeholder={
												value?.length === 1 && value?.length < 3
													? "Must add two more. Can add up to 10."
													: value?.length === 2 && value?.length < 3
														? "Must add one more. Can add up to 10."
														: value?.length < 3
															? "Enter your skills, then press enter."
															: value?.length > 3 && value?.length === 10
																? ""
																: value?.length >= 3
																	? `You can add ${10 - value.length} more skill${10 - value.length === 1 ? "" : "s"}`
																	: ""
											}
											disabled={value?.length === 10}
											form={form}
											onBlur={onBlur}
											fieldName="tags"
										/>
									)}
								/>
							</div>
							<span className="absolute -bottom-2 flex w-full">
								{form.formState.errors.tags?.message && (
									<span className="text-sm text-red-500">{form.formState.errors.tags?.message}</span>
								)}
							</span>
						</div>
						<div className="relative w-1/2">
							<p className="mb-2 text-[16px]">Bio</p>
							<Textarea
								maxLength={350}
								className="!min-h-[186px] w-full !border-2 !border-line !bg-input-bg"
								{...form.register("bio")}
								placeholder="Enter a description of your abilities, approaches, and ambitions (up to 350 characters)."
								rows={10} // Number of rows, can be adjusted as needed
								cols={50} // Number of columns, can be adjusted as needed
							/>
							<div className="ml-auto w-fit text-sm text-body">{form.watch("bio")?.length ?? 0}/350</div>

							<span className="absolute -bottom-2 flex w-full">
								{form.formState.errors.bio?.message && (
									<span className="text-sm text-red-500">{form.formState.errors.bio?.message}</span>
								)}
							</span>
						</div>
					</div>
					<div id="input-row" className="flex w-full flex-row justify-between gap-4">
						<div />
						<Button
							variant="secondaryOutline"
							size="lg"
							// type="submit"
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
		</Form.Root>
	);
};
