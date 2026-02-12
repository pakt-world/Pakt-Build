"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { useState } from "react";
import { Mail, MapPin, Verified } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UploadAvatar } from "@/components/common/upload-avatar";
import { type editProfileFormSchema } from "@/lib/validations";
import { sentenceCase2 } from "@/lib/utils";
import { linkChecker } from "@/lib/utils/settings";
import { useUpdateAccount } from "@/lib/api/account";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { UpdateUserDataProps } from "@/lib/types/account";

interface OptionProps {
	label: string;
	value: string;
}

const VisibilityStates: OptionProps[] = [
	{ label: "Private", value: "true" },
	{ label: "Public", value: "false" },
];

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface BasicInfoProps {
	userData: UpdateUserDataProps;
}

export const BasicInfo = ({ userData }: BasicInfoProps): JSX.Element => {
	const [isPrivate, setIsPrivate] = useState(userData.isPrivate);
	const visibility = isPrivate
		? {
				label: "Private",
				value: "true",
			}
		: {
				label: "Public",
				value: "false",
			};

	const queryClient = useQueryClient();
	const updateAccount = useUpdateAccount();

	const isDisabled =
		userData?.bio == "" ||
		userData?.country == "" ||
		userData?.avatar == "" ||
		userData.tags.length < 1 ||
		userData?.location == "";

	const updateAccountVisibility = (values: EditProfileFormValues): void => {
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
					description: values.bio,
				},
				talent: {
					tags: [...(values.tags || [])],
				},
			},
			meta: {
				profileLinks: {
					website: linkChecker(values.website as string),
					x: linkChecker(values.x as string),
					tiktok: linkChecker(values.tiktok as string),
					instagram: linkChecker(values.instagram as string),
					github: linkChecker(values.github as string),
				},
				acceptedTerms: true,
			},
			isPrivate: values.isPrivate,
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

	const toggleUserProfile = (state: OptionProps): void => {
		const validState = state.value === "true";
		setIsPrivate(validState);
		const updateUserVisibility = {
			...userData,
			isPrivate: validState,
		};
		updateAccountVisibility(updateUserVisibility);
	};

	return (
		<div className="relative flex h-fit w-full flex-col items-center rounded-2xl bg-white">
			<div className="flex w-full flex-col pt-4">
				<span className="absolute right-4 top-4 w-max rounded-lg bg-success-lighter px-2 py-1 text-xs font-thin capitalize text-success">
					{isPrivate ? "Private" : "Public"}
				</span>

				<div className="item-center mx-auto flex flex-col justify-center gap-2 text-center">
					<UploadAvatar
						size={150}
						image={userData?.avatar}
						onUploadComplete={() => {
							queryClient.invalidateQueries(["account-details"]);
						}}
					/>
				</div>
				<div className="flex flex-row items-center justify-center">
					<p className="text-lg font-bold text-title">{userData?.firstName}</p>
					{userData?.kycVerified && <Verified className="ml-2" />}
				</div>
				<div className="mb-2 flex flex-row items-center justify-center text-body">
					<Mail className="mr-2" />
					<p className="text-base font-normal leading-6 tracking-[0.75%] text-[#9B51E0]">{userData?.email}</p>
				</div>
				<div className="flex flex-row items-center justify-center text-body">
					{userData?.location && userData?.country && (
						<>
							<MapPin className="mr-2" />
							<p className="text-base font-thin text-body">
								{sentenceCase2(userData?.location)}, {sentenceCase2(userData?.country)}
							</p>
						</>
					)}
				</div>
				<div className="mt-5 flex w-full max-w-full flex-col p-4">
					<span className="mb-3 text-sm leading-[21px] tracking-wide text-body">Profile Visibility</span>
					<SelectDropdown
						options={VisibilityStates}
						value={visibility}
						onChange={(value) => {
							toggleUserProfile(value);
						}}
						placeholder="Select Visibility"
						disabled={isDisabled}
						className="sm:w-full"
						triggerClassName="h-12 w-full sm:text-base"
					/>
					<p className="my-4 text-sm text-body">
						Your visibility settings determine if your profile is searchable.
					</p>
				</div>
			</div>
		</div>
	);
};
