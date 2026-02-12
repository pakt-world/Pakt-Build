/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, CircleCheck, CircleHelp, Mail, MapPin, Verified } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "pakt-ui";
import { useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { UploadAvatar } from "@/components/common/upload-avatar";
import { sentenceCase } from "@/lib/utils";
import { useUpdateAccount } from "@/lib/api/account";
import { linkChecker } from "@/lib/utils/settings";
import { useLogoutConfirmationStore } from "@/lib/store/misc";
import { useUserState } from "@/lib/store/account";
import { UpdateUserDataProps } from "@/lib/types/account";
import { EditProfileFormValues } from "../desktop/edit-profile";

export default function MobileSettingsView(): JSX.Element {
	const router = useRouter();
	const { user: userAccount } = useUserState();

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

	const [isPrivate, setIsPrivate] = useState(userData.isPrivate);

	const { setShowLogoutConfirmation } = useLogoutConfirmationStore();
	const updateAccount = useUpdateAccount();

	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

	const updateAccountFunc = (values: EditProfileFormValues): void => {
		const payload = {
			firstName: values.firstName,
			// lastName: values.lastName,
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

	const accountSettings = [
		{
			title: "Edit Profile",
			action: () => {
				router.push("/settings/edit-profile");
			},
		},
		{
			title: "Professional Information",
			action: () => {
				router.push("/settings/professional-info");
			},
		},
		{
			title: "Profile Links",
			action: () => {
				router.push("/settings/profile-links");
			},
		},
		{
			title: "Visibility",
			action: () => {},
		},
		{
			title: "Change Password",
			action: () => {
				router.push("/settings/change-password");
			},
		},
		{
			title: "2FA",
			action: () => {
				router.push("/settings/2fa");
			},
		},
	];

	const handleVisibilityChange = () => {
		const updatedIsPrivate = !isPrivate;
		setIsPrivate(updatedIsPrivate);
		const updatedUserData = {
			...userData,
			isPrivate: updatedIsPrivate,
		};
		updateAccountFunc(updatedUserData);
	};

	// Component that checks if Edit profile, Professional Information, Profile Links are filled completely
	// If not, it should show a warning icon
	// If filled, it should show a success icon
	const profileStatusIndicator = (title: string) => {
		if (title === "Edit Profile") {
			const isComplete =
				userData?.firstName && userData?.title && userData?.location && userData?.country && userData?.email;
			return isComplete ? (
				<CircleCheck className="h-4 w-4 scale-[1.4] fill-green-lighter stroke-white" />
			) : (
				<CircleHelp className="h-4 w-4 text-red-500" />
			);
		}
		if (title === "Professional Information") {
			const isComplete = userData?.bio && userData?.tags.length >= 3;
			return isComplete ? (
				<CircleCheck className="h-4 w-4 scale-[1.4] fill-green-lighter stroke-white" />
			) : (
				<CircleHelp className="h-4 w-4 text-red-500" />
			);
		}
		if (title === "Profile Links") {
			const isComplete =
				userData?.website && userData?.x && userData?.tiktok && userData?.instagram && userData?.github;
			return isComplete ? (
				<CircleCheck className="h-4 w-4 scale-[1.4] fill-green-lighter stroke-white" />
			) : (
				<CircleHelp className="h-4 w-4 text-red-500" />
			);
		}
		return;
	};

	return (
		<div className="relative z-[2] flex w-full flex-1 flex-col overflow-hidden sm:h-full">
			<MobileBreadcrumb
				items={[
					{
						label: "Profile",
						link: "/profile",
					},
					{ label: "Settings", active: true },
				]}
				className="!fixed top-[70px] !z-50 px-5"
			/>
			<div className="relative w-full bg-blue-lightest/20 p-4 py-20 pt-14">
				<div className="flex h-max flex-col items-start justify-start gap-4 rounded-2xl border border-line bg-white px-4 py-[15px] shadow">
					<div className="flex w-full flex-col items-start gap-4">
						<div className="flex items-center gap-4">
							<div className="item-center mx-auto flex flex-col justify-center gap-2 text-center">
								<UploadAvatar size={81} image={userData.avatar} onUploadComplete={refetchUser} />
							</div>

							<div className="flex flex-col items-start justify-center">
								<div className="mb-2 flex flex-row items-center justify-center">
									<p className="text-lg font-bold text-title">{userData?.firstName}</p>

									{userData?.kycVerified && <Verified className="ml-2 h-4 w-4 text-body" />}
								</div>
								<div className="mb-1 flex flex-row items-center justify-center text-body">
									<Mail className="mr-2 h-4 w-4" />
									<p className="text-sm font-thin leading-[21px] tracking-wide text-body">
										{userData?.email}
									</p>
								</div>
								<div className="flex flex-row items-center justify-center text-body">
									{userData?.location && userData?.country && (
										<>
											<MapPin className="mr-2 h-4 w-4" />
											<p className="text-sm font-thin leading-[21px] tracking-wide text-body">
												{sentenceCase(userData?.location)}, {sentenceCase(userData?.country)}
											</p>
										</>
									)}
								</div>
							</div>
						</div>
						<div className="h-[0.43px] w-full bg-[#E8E8E8]" />
						<div className="flex w-full flex-col items-start gap-2">
							<h4 className="text-base leading-normal tracking-tight text-body">Account</h4>
							<div className="flex w-full flex-col items-start gap-2">
								{accountSettings.slice(0, 3).map((settings) => (
									<button
										className="flex w-full items-center justify-between p-2 text-base font-medium leading-normal tracking-tight text-title
											hover:!bg-transparent"
										onClick={settings.action}
										type="button"
										key={settings.title}
									>
										{settings.title}
										<div className="flex items-center gap-2">
											{profileStatusIndicator(settings.title)}
											<ChevronRight className="h-4 w-4" />
										</div>
									</button>
								))}
								<div
									className="flex w-full items-center justify-between p-2 text-base font-medium leading-normal tracking-tight text-title
										hover:!bg-transparent"
								>
									Visibility
									<div className="flex items-center gap-2">
										<span className="text-base !font-normal text-gray-500">Public</span>
										<Switch
											className="data-[state=checked]:!bg-dark-bg"
											checked={!isPrivate}
											onCheckedChange={handleVisibilityChange}
										/>
									</div>
								</div>
								{accountSettings.slice(4, 6).map((settings) => (
									<button
										className="flex w-full items-center justify-between p-2 text-base font-medium leading-normal tracking-tight text-title
											hover:!bg-transparent"
										onClick={settings.action}
										type="button"
										key={settings.title}
									>
										{settings.title}
										<ChevronRight className="h-4 w-4" />
									</button>
								))}
								<Button
									variant="ghost"
									className="flex w-full items-center justify-between p-2 text-base font-medium leading-normal tracking-tight text-red-600
										hover:!bg-transparent"
									onClick={() => {
										setShowLogoutConfirmation(true);
									}}
									type="button"
								>
									Logout
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<div className="h-[0.43px] w-full bg-[#E8E8E8]" />

						<div className="flex w-full flex-col items-start gap-2">
							<h4 className="text-base leading-normal tracking-tight text-body">Other</h4>
							<div className="flex w-full flex-col items-start gap-2">
								<Button
									variant="ghost"
									className="flex w-full items-center justify-between p-2 text-base font-medium leading-normal tracking-tight !text-red-600
										hover:!bg-transparent"
									onClick={() => {
										router.push("/settings/delete-account");
									}}
									type="button"
								>
									Delete Account
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
