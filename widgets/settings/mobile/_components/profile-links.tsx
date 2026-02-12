/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@radix-ui/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useUpdateAccount } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { sentenceCase } from "@/lib/utils";
import { editProfileFormSchema4Mobile3 } from "@/lib/validations";
import { linkChecker } from "@/lib/utils/settings";
import { UpdateUserDataProps } from "@/lib/types/account";
import { FormVType } from "../../_shared/types";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema4Mobile3>;

export const ProfileLinks = (): JSX.Element => {
	const router = useRouter();
	const { user: userAccount } = useUserState();

	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

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
		resolver: zodResolver(editProfileFormSchema4Mobile3),
		defaultValues: userData,
	});

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

	const updateAccount = useUpdateAccount();

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
					refetchUser();
					router.back();
				},
			}
		);
	};

	const updating = updateAccount.isLoading;

	return (
		<div className="relative z-[2] w-full bg-white">
			<div className="fixed top-[70px] z-50 flex h-[54px] w-full items-center gap-2 border-y border-green-lighter bg-white p-4 py-[13.5px]">
				<Button
					className="p-0"
					onClick={() => {
						router.back();
					}}
					variant="ghost"
				>
					<ChevronLeft className="text-title" />
				</Button>
				<h1 className="text-lg font-bold leading-[27px] tracking-wide text-title">Profile Links</h1>
			</div>

			<Form.Root
				className="flex w-full flex-col gap-4 overflow-y-auto bg-white p-5 py-20"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Form.Field name="website" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-title">Website</Form.Label>
					<input
						{...form.register("website")}
						className="!h-[54px] w-full rounded-lg border border-line px-4 py-[13px] !text-title outline-none"
						placeholder="Enter Website url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.website?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.website?.message}</span>
						)}
					</span>
				</Form.Field>
				<Form.Field name="x" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-title">X</Form.Label>
					<input
						{...form.register("x")}
						className="h-[54px] w-full rounded-lg border border-line px-4 py-[13px] !text-title"
						placeholder="Enter X url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.x?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.x?.message}</span>
						)}
					</span>
				</Form.Field>

				<Form.Field name="tiktok" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-title">Tiktok</Form.Label>
					<input
						{...form.register("tiktok")}
						className="h-[54px] w-full rounded-lg border border-line px-4 py-[13px] !text-title"
						placeholder="Enter Tiktok url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.tiktok?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.tiktok?.message}</span>
						)}
					</span>
				</Form.Field>
				<Form.Field name="instagram" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-title">Instagram</Form.Label>
					<input
						{...form.register("instagram")}
						className="!bg-primary-light !h-[54px] w-full rounded-lg border border-line px-4 py-[13px] !text-title"
						placeholder="Enter Instagram url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.instagram?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.instagram?.message}</span>
						)}
					</span>
				</Form.Field>

				<Form.Field name="github" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-title">Github</Form.Label>
					<input
						{...form.register("github")}
						className="!bg-primary-light !h-[54px] w-full rounded-lg border border-line px-4 py-[13px] !text-title"
						placeholder="Enter Github url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.github?.message && (
							<span className="text-sm text-red-500">{form.formState.errors.github?.message}</span>
						)}
					</span>
				</Form.Field>

				<Button
					className="flex-end mt-auto h-[51px] w-full"
					// type="submit"
					type="button"
					variant="primary"
					size="lg"
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
			</Form.Root>
		</div>
	);
};
