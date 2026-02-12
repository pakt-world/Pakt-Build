/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "pakt-ui";
import { useMemo } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useUpdateAccount } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { sentenceCase } from "@/lib/utils";
import { editProfileFormSchema4Mobile } from "@/lib/validations";

import { CountryDropdown } from "../../_shared/countries-dropdown";
import { StateDropdown } from "../../_shared/states-dropdown";
import { UpdateUserDataProps } from "@/lib/types/account";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema4Mobile>;

export const EditProfile = (): JSX.Element => {
	const router = useRouter();
	const { user: userAccount } = useUserState();

	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

	// const user = useUserState();
	// const { refetch: refetchUser, isLoading: accountIsLoading } = getAccount;

	const userData: UpdateUserDataProps = useMemo(
		() => ({
			...userAccount,
			firstName: userAccount?.firstName ?? "",
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
		resolver: zodResolver(editProfileFormSchema4Mobile),
		defaultValues: userData,
	});

	const updateAccount = useUpdateAccount();

	const loading = updateAccount.isLoading || form.formState.isLoading;

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
					refetchUser();
					router.back();
				},
			}
		);
	};
	// Get country form value
	const countryValue = form.watch("country");

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
				<h1 className="text-lg font-bold leading-[27px] tracking-wide text-title">Edit Profile</h1>
			</div>

			<form
				className="flex w-full flex-col overflow-y-auto bg-white p-5 py-20"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="mb-5 flex flex-col gap-3">
					<label className="text-base leading-normal tracking-tight text-title">First Name</label>
					<Input
						{...form.register("firstName")}
						className="!h-[54px] w-full !rounded-lg !border-line !text-base !text-[#72777A]"
						placeholder="enter first name"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.firstName?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.firstName?.message}</span>
						)}
					</span>
				</div>

				{/* <div className="mb-5 flex flex-col gap-3">
					<label className="text-base leading-normal tracking-tight text-title">Last Name</label>
					<Input
						{...form.register("lastName")}
						className="!h-[54px] w-full !rounded-lg !border-line !text-base !text-[#72777A]"
						placeholder="enter last name"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.lastName?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.lastName?.message}</span>
						)}
					</span>
				</div> */}

				<div className="mb-5 flex flex-col gap-3">
					<label className="text-base leading-normal tracking-tight text-title"> Role</label>
					<Input
						{...form.register("title")}
						className="placeholder:!text-red !h-[54px] w-full !rounded-lg !border-line !text-base !text-[#72777A]"
						placeholder="e.g Developer"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.title?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.title?.message}</span>
						)}
					</span>
				</div>

				<div className="mb-5 flex flex-col gap-3">
					<label className="text-base leading-normal tracking-tight text-title">Email</label>
					<Input
						{...form.register("email")}
						className="placeholder:!text-red !h-[54px] w-full !rounded-lg !border-line !text-base !text-[#72777A]"
						placeholder="enter email address"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.email?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.email?.message}</span>
						)}
					</span>
				</div>
				<div className="relative mb-5 flex flex-col">
					<Controller
						name="country"
						control={form.control}
						render={({ field: { onChange, value } }) => {
							return (
								<div className="flex w-full flex-col gap-2">
									<label className="text-base leading-normal tracking-tight text-title">
										Country
									</label>
									<CountryDropdown onChange={onChange} value={value} />
								</div>
							);
						}}
					/>

					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.country?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.country?.message}</span>
						)}
					</span>
				</div>
				<div className="relative mb-5 flex flex-col">
					<Controller
						name="location"
						control={form.control}
						render={({ field: { onChange, value } }) => {
							return (
								<div className="flex w-full flex-col gap-2">
									<label className="text-base leading-normal tracking-tight text-title">Region</label>
									<StateDropdown onChange={onChange} value={value} countryValue={countryValue} />
								</div>
							);
						}}
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.location?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.location?.message}</span>
						)}
					</span>
				</div>

				<Button
					className="h-[51px]"
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
