"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Checkbox, Text } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Slider } from "@/components/common/slider";

import { InitiateDeactivateOTP } from "./deactivate/initiate";
import { VerifyDeactivateOTP } from "./deactivate/verify";
import { OTPDeactivateSuccess } from "./deactivate/success";

import { InitiateActivateOTP } from "./activate/initiate";
import { VerifyActivateOTP } from "./activate/verify";
import { OTPActivateSuccess } from "./activate/success";
import { useEmail2FAState, useMscState } from "@/lib/store/security";
import { Modal } from "@/components/common/modal";

interface Email2FAProps {
	isEnabled: boolean;
	disabled?: boolean;
}

export const EmailAuth2FA = ({ isEnabled, disabled }: Email2FAProps): React.JSX.Element => {
	const { isModalOpen, closeModal, openModal } = useEmail2FAState();
	const [isActive, _setIsActive] = useState(isEnabled);
	const { isInput6DigitCode } = useMscState();

	useEffect(() => {
		if (!isModalOpen) _setIsActive(isEnabled);
	}, [isEnabled, isModalOpen]);

	return (
		<>
			<div
				onClick={openModal}
				className={`relative flex shrink grow basis-0 cursor-pointer flex-col items-center gap-6 rounded-lg border border-line bg-[#F2F2F2]
					px-7 py-4 ${disabled ? "cursor-not-allowed opacity-[0.5]" : ""} sm:rounded-md sm:border-transparent sm:py-9`}
			>
				<div className="absolute right-4 top-4 hidden sm:block">
					<Checkbox checked={isEnabled} />
				</div>
				<div className="flex h-[100px] items-center">
					<Image src="/icons/email-auth.svg" width={76} height={76} alt="" />
				</div>
				<Text.p size="lg">Email Auth</Text.p>
			</div>

			<Modal
				isOpen={isModalOpen}
				onOpenChange={closeModal}
				className={`!overflow-hidden rounded-2xl bg-white p-4 max-sm:scale-[0.9] sm:p-6
					${isInput6DigitCode ? "max-h-[266px]" : "max-h-auto"} `}
			>
				{isActive ? (
					<Slider
						items={[
							{ SlideItem: InitiateDeactivateOTP },
							{ SlideItem: VerifyDeactivateOTP },
							{ SlideItem: OTPDeactivateSuccess },
						]}
					/>
				) : (
					<Slider
						items={[
							{ SlideItem: InitiateActivateOTP },
							{ SlideItem: VerifyActivateOTP },
							{ SlideItem: OTPActivateSuccess },
						]}
					/>
				)}
			</Modal>
		</>
	);
};
