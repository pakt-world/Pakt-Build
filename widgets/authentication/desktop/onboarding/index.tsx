"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
// import { memo, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "@/components/common/headless-modal";
import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import { getBoolean, USER_KEY } from "@/lib/utils";
import { useOnboardingActionState } from "@/lib/store/onboarding";
import { TermsAndConditionForm } from "./terms-and-condition";
import { UploadImage } from "../../_shared/upload-image";

interface userMeta {
	onboarding: boolean;
	acceptedTerms: boolean;
	profileImage: string;
}

const OnboardingDialog = (): JSX.Element => {
	const router = useRouter();
	const { showOnboardingDialog } = useOnboardingActionState();

	const user = getCookie(USER_KEY) as string;
	const parsedUser = user ? JSON.parse(user) : null;

	const { acceptedTerms } = (parsedUser as userMeta) || {};

	// const isOnboardingIncomplete = !onboarding || getBoolean(profileImage === "");
	const isAcceptedTermsIncomplete = !getBoolean(acceptedTerms);

	return (
		<Modal
			isOpen={showOnboardingDialog}
			closeModal={() => {
				router.push("/");
			}}
			className="w-full max-w-[874px]"
			disableClickOutside
		>
			<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
				{isAcceptedTermsIncomplete && <TermsAndConditionForm />}
				{!isAcceptedTermsIncomplete && (
					<div className="size-full rounded-2xl bg-white p-8">
						<UploadImage isOnboarding />
					</div>
				)}

				<div className="flex w-full items-center justify-end">
					<PoweredByPakt className="!text-white" />
				</div>
			</div>
		</Modal>
	);
};

export default OnboardingDialog;
