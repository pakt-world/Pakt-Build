"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { TriangleAlert } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { useShowWalletAddressStore } from "./store";
import { useInitialize2FA } from "@/lib/api/2fa";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { Spinner } from "@/components/common/loader";
import { useState } from "react";

interface EnterPassword4SecretKeyProps {
	proceed?: () => void;
	startCountDown?: () => void;
}

export const EnterPassword4SecretKey = ({ proceed, startCountDown }: EnterPassword4SecretKeyProps) => {
	const { passwordValue, setPasswordValue, setIsOtp } = useShowWalletAddressStore();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const togglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev);
	};
	const initiate = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		await initiate.mutateAsync(
			{ type: TwoFactorAuthEnums.EMAIL },
			{
				onSuccess: () => {
					setIsOtp(true);
					startCountDown?.();
					proceed?.();
				},
			}
		);
	};

	return (
		<div className="flex w-full flex-col gap-4">
			<h5 className="text-base font-[450] text-body">
				Your Private Key provides{" "}
				<span className="font-bold text-black">full access to your funds on the blockchain</span>
			</h5>
			<div className="flex w-full items-center gap-4 rounded-lg border border-[#FF9898] bg-[#FFE5E5] p-4">
				<TriangleAlert className="size-[38px] text-black sm:size-6" />
				<div className="flex flex-col justify-between">
					<p className="text-base text-black">Warning</p>
					<p className="text-sm text-black">
						Keep your key somewhere private.{" "}
						<span className="font-bold">Do not share them with anyone.</span>
					</p>
				</div>
			</div>
			<div className="flex w-full flex-col gap-4">
				<label htmlFor="cc" className="break-words text-base font-[450] text-body">
					Enter password to receive an email with a code to reveal your key.
				</label>
				<div className="relative">
					<input
						value={passwordValue}
						className="mt-1 block h-[48px] w-full rounded-lg border border-line p-4 shadow focus:outline-none"
						onChange={(e) => setPasswordValue(e.target.value)}
						placeholder="Enter your password"
						// Disable auto suggestion in the search input
						autoComplete="new-password"
						autoCorrect="off" // Disable autocorrect
						spellCheck="false" // Disable spell check
						aria-autocomplete="none"
						type="search"
						style={{
							// @ts-ignore
							"-webkit-text-security": isPasswordVisible ? "none" : "disc",
							// Hide the clear button in the search input
						}}
					/>
					<style jsx>{`
						/* Hide clear button in Chrome, Safari, Edge */
						input[type="search"]::-webkit-search-cancel-button {
							display: none;
						}

						/* Hide clear button in Firefox */
						input[type="search"]::-moz-search-clear-button {
							display: none;
						}

						/* Hide clear button in Internet Explorer */
						input[type="search"]::-ms-clear {
							display: none;
						}

						/* Optional: Hide the default search icon in all browsers */
						input[type="search"]::-webkit-search-decoration {
							display: none;
						}
					`}</style>
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute inset-y-0 right-0 z-[999] flex items-center pr-3"
					>
						{isPasswordVisible ? (
							<span className="text-gray-500">Hide</span>
						) : (
							<span className="text-gray-500">Show</span>
						)}
					</button>
				</div>

				<Button
					variant="primary"
					className="w-full"
					onClick={() => {
						handleInitiateOtp();
					}}
					disabled={initiate.isLoading || passwordValue.trim() === ""}
				>
					{initiate.isLoading ? <Spinner /> : "Proceed"}
				</Button>
			</div>
		</div>
	);
};
