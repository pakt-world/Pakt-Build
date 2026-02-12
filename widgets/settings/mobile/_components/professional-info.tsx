/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "pakt-ui";
import { useMemo } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { TagInput } from "@/components/common/tag-input";
import { useUpdateAccount } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { sentenceCase } from "@/lib/utils";
import { editProfileFormSchema4Mobile2 } from "@/lib/validations";
import { UpdateUserDataProps } from "@/lib/types/account";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema4Mobile2>;

export const ProfessionalInfo = (): JSX.Element => {
	const router = useRouter();
	const { user: userAccount } = useUserState();

	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

	// const { refetch: refetchUser, isLoading: accountIsLoading } = getAccount;

	const userData: UpdateUserDataProps = useMemo(
		() => ({
			...userAccount,
			firstName: userAccount?.firstName ?? "",
			// lastName: userAccount?.lastName ?? "",
			title: sentenceCase(userAccount?.profile?.bio?.title as string) ?? "",
			bio: userAccount?.profile?.bio?.description ?? "",
			location: userAccount?.profile?.contact?.city ?? "",
			country: userAccount?.profile?.contact?.country ?? "",
			avatar: userAccount?.profileImage?.url ?? "",
			kycVerified: userAccount?.kyc ?? false,
			tags: userAccount?.profile?.talent?.tags ?? [],
			isPrivate: userAccount?.isPrivate ?? false,
			email: userAccount?.email ?? "",
			website: userAccount?.meta?.profileLinks?.website ?? "",
			x: userAccount?.meta?.profileLinks?.x ?? "",
			tiktok: userAccount?.meta?.profileLinks?.tiktok ?? "",
			instagram: userAccount?.meta?.profileLinks?.instagram ?? "",
			github: userAccount?.meta?.profileLinks?.github ?? "",
		}),
		[userAccount]
	);

	const form = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileFormSchema4Mobile2),
		defaultValues: userData,
	});

	const updateAccount = useUpdateAccount();

	const loading = updateAccount.isLoading || form.formState.isLoading;

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
					router.back();
				},
			}
		);
	};

	return (
		<div className="relative z-[2] w-full bg-white">
			<div className="fixed top-[70px] z-50 flex h-[54px] w-full items-center gap-2 border-y border-green-lighter bg-white p-4 py-[13.5px]">
				<Button
					className="p-0"
					onClick={() => {
						router.push("/settings");
					}}
					variant="ghost"
				>
					<ChevronLeft className="text-title" />
				</Button>
				<h1 className="text-lg font-bold leading-[27px] tracking-wide text-title">Professional Information</h1>
			</div>

			<form
				className="flex w-full flex-col gap-4 overflow-y-auto bg-white p-5 py-20"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="relative w-full">
					<label className="mb-2 text-lg font-medium leading-[27px] tracking-wide text-title">
						Skill Sets
					</label>
					<div className="mb-3 text-base leading-normal tracking-tight text-gray-500">
						You can add up to 10 skills, add your top three first
					</div>
					<div className="min-h-[186px] rounded-lg border-2 border-line border-opacity-40 !bg-white">
						<Controller
							name="tags"
							control={form.control}
							render={({ field: { onChange, onBlur, value = [] } }) => (
								<TagInput<EditProfileFormValues>
									tags={value}
									setTags={onChange}
									onBlur={onBlur}
									className="grow items-start border-none bg-transparent !text-body placeholder:!text-sm"
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
									fieldName="tags"
								/>
							)}
						/>
					</div>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.tags?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.tags?.message}</span>
						)}
					</span>
				</div>
				<div className="relative w-full">
					<label className="mb-3 block text-lg font-medium leading-[27px] tracking-wide text-title">
						Bio
					</label>
					<Textarea
						maxLength={350}
						className="!min-h-[186px] w-full !border-line !bg-white !text-base text-body !shadow-none placeholder:!opacity-50"
						{...form.register("bio")}
						placeholder="Enter a description of your abilities, approaches, and ambitions (up to 350 characters)."
					/>
					<div className="ml-auto w-fit text-sm text-body">{form.watch("bio")?.length ?? 0}/350</div>

					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.bio?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.bio?.message}</span>
						)}
					</span>
				</div>

				<Button
					className="flex-end mt-auto h-[51px] w-full"
					type="submit"
					variant="primary"
					size="lg"
					disabled={loading || !form.formState.isValid}
				>
					{loading ? <Spinner size={18} /> : "Save Changes"}
				</Button>
			</form>
		</div>
	);
};
