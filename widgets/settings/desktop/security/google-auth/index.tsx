"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Checkbox, Text } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { VerifyDeactivateAuthApp } from "./deactivate/verify";
import { DeactivateAuthAppSuccess } from "./deactivate/success";
import { InitiateAuthApp } from "./activate/initiate";
import { ScanAuthApp } from "./activate/scan";
import { VerifyActivateAuthApp } from "./activate/verify";
import { ActivateAuthAppSuccess } from "./activate/success";
import { useAuthApp2FAState, useMscState } from "@/lib/store/security";
import { Modal } from "@/components/common/modal";
import { Slider } from "@/components/common/slider";

interface AuthApp2FAProps {
	isEnabled: boolean;
	disabled?: boolean;
}

export const GoogleAuth2FA = ({ isEnabled, disabled }: AuthApp2FAProps): React.JSX.Element => {
	const { isModalOpen, closeModal, openModal } = useAuthApp2FAState();
	const { isInput6DigitCode } = useMscState();
	const [isActive, _setIsActive] = useState(isEnabled);

	useEffect(() => {
		if (!isModalOpen) _setIsActive(isEnabled);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEnabled, isModalOpen]);

	return (
		<>
			<div
				onClick={openModal}
				className={`relative flex shrink grow basis-0 cursor-pointer flex-col items-center gap-6 rounded-lg border border-line bg-[#F2F2F2]
					px-7 py-4 disabled:cursor-not-allowed disabled:opacity-[0.5] sm:rounded-md sm:border-transparent sm:py-9
					${disabled ? "cursor-not-allowed opacity-[0.5]" : ""}`}
			>
				<div className="absolute right-4 top-4 hidden sm:block">
					<Checkbox checked={isEnabled} />
				</div>
				<div className="flex h-[100px] items-center">
					<Image
						className="-translate-x-[10px]"
						src="/icons/authenticator-app.svg"
						width={76}
						height={76}
						alt="Authenticator app"
					/>
				</div>
				<Text.p size="lg">Authenticator app</Text.p>
			</div>

			<Modal
				isOpen={isModalOpen}
				onOpenChange={closeModal}
				className={`!overflow-hidden rounded-2xl bg-white p-4 max-sm:scale-[0.9] sm:p-6
					${isInput6DigitCode ? "max-h-[266px]" : "max-h-auto"} `}
			>
				{isActive ? (
					<Slider items={[{ SlideItem: VerifyDeactivateAuthApp }, { SlideItem: DeactivateAuthAppSuccess }]} />
				) : (
					<Slider
						items={[
							{ SlideItem: InitiateAuthApp },
							{ SlideItem: ScanAuthApp },
							{ SlideItem: VerifyActivateAuthApp },
							{ SlideItem: ActivateAuthAppSuccess },
						]}
					/>
				)}
			</Modal>
		</>
	);
};
