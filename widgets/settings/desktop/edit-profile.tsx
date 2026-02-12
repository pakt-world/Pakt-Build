"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { ReactElement, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	editProfileFormSchema4Mobile,
	editProfileFormSchema4Mobile2,
	editProfileFormSchema4Mobile3,
	type editProfileFormSchema,
} from "@/lib/validations";
import { useUserState } from "@/lib/store/account";
import { UpdateUserDataProps } from "@/lib/types/account";
import { sentenceCase } from "@/lib/utils";
import { useProfileValidation } from "@/hooks/use-profile-validation";
import { BasicInfo } from "./_components/forms/edit-profile/basic-info";
import { ProfileDetails } from "./_components/forms/edit-profile/profile-details";
import { ProfileSteps } from "./_components/forms/edit-profile/profile-indicator";
import { ProfessionalInfo } from "./_components/forms/edit-profile/professional-info";
import { ProfileLinks } from "./_components/forms/edit-profile/profile-links";
import DeleteAccount from "../_shared/delete-account";
// import Logger from "@/lib/utils/logger";

export type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

export const EditProfile4Desktop = (): ReactElement => {
	const { user: userAccount } = useUserState();

	const userData: UpdateUserDataProps = useMemo(
		() => ({
			...userAccount,
			firstName: userAccount?.firstName ?? "",
			title: sentenceCase(userAccount?.profile?.bio?.title || "Pakt Builder"),
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

	const profileDetailsForm = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileFormSchema4Mobile),
		defaultValues: userData,
		reValidateMode: "onChange",
	});
	const professionalInformationForm = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileFormSchema4Mobile2),
		defaultValues: userData,
		reValidateMode: "onChange",
	});
	const profileLinkForm = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileFormSchema4Mobile3),
		defaultValues: userData,
		reValidateMode: "onChange",
	});

	// Realtime validation to disable the save button
	const { profileSteps } = useProfileValidation({
		profileDetailsForm,
		professionalInformationForm,
	});

	// Logger.info("ProfileForm", form.getValues());
	// Logger.info("ProfileForm", { profileSteps, profileCompleted });

	return (
		<div className="flex min-h-full flex-col items-start gap-4 overflow-y-auto">
			<div className="flex w-full flex-col gap-4 2xl:gap-6">
				<div className="grid w-full grid-cols-[30%_1fr] items-stretch gap-4 2xl:gap-6">
					<div className="size-full">
						<BasicInfo userData={userData} />
					</div>

					<ProfileDetails
						userData={userData}
						userAccount={userAccount}
						form={profileDetailsForm}
						profileCompleted={profileSteps.name && profileSteps.location}
					/>
				</div>
				<div className="grid w-full grid-cols-[30%_1fr] gap-4 overflow-y-auto 2xl:gap-6">
					<div className="flex flex-col gap-4 2xl:gap-6">
						{!profileSteps.name || !profileSteps.location || !profileSteps.skills || !profileSteps.bio ? (
							<div className="hidden lg:block">
								<ProfileSteps profileSteps={profileSteps} />
							</div>
						) : null}
					</div>
					<div className="flex w-full flex-col gap-4 2xl:gap-6">
						<ProfessionalInfo
							userData={userData}
							userAccount={userAccount}
							form={professionalInformationForm}
							profileCompleted={profileSteps.skills && profileSteps.bio}
						/>
						<ProfileLinks
							userData={userData}
							userAccount={userAccount}
							form={profileLinkForm}
							// profileCompleted={profileCompleted}
						/>
						<DeleteAccount />
					</div>
				</div>
			</div>
		</div>
	);
};
