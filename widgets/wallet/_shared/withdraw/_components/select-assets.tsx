"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatNumberWithCommas, getWalletIcon } from "@/lib/utils";
import { WalletProps } from "@/lib/api/wallet";
import { AllTokensModal } from "../../view-all-tokens-dialog";

interface Props {
	selectedToken: WalletProps | null;
	setSelectedToken: (token: WalletProps) => void;
	wallets: WalletProps[];
	form: any; // Assuming form comes from react-hook-form
}

export const SelectAsset: React.FC<Props> = ({ selectedToken, setSelectedToken, wallets, form }) => {
	const [viewTokens, setViewTokens] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleSelectToken = (token: WalletProps) => {
		setSelectedToken(token);
		form.setValue("coin", token.id);
		form.setValue("amount", ""); // Reset amount when selecting a new token
		setViewTokens(false);
	};

	const toggleViewTokens = () => setViewTokens((prev) => !prev);

	const handleClickOutside = (): void => {
		setViewTokens(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	return (
		<div className="relative" ref={ref}>
			<span className="text-title">Select Asset</span>

			<div
				className="mt-3 inline-flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl border border-line p-4 pr-0"
				onMouseDown={toggleViewTokens}
				tabIndex={0}
				role="button"
			>
				{selectedToken ? (
					<div className="flex h-[39px] flex-grow items-center justify-between pr-2">
						<div className="flex items-center gap-4">
							<Image
								className="h-6 w-[26px] rounded-full"
								src={getWalletIcon(selectedToken)}
								height={26}
								width={26}
								alt={selectedToken.coin}
							/>
							<p className="text-base tracking-tight text-title">{selectedToken.coin.toUpperCase()}</p>
						</div>

						<div className="flex flex-col items-end">
							<p className="text-md tracking-tight text-title text-opacity-70">
								{formatNumberWithCommas(selectedToken.amount, 6) ?? "0"}
							</p>
							<p className="text-sm tracking-tight text-body text-opacity-50">
								${formatNumberWithCommas(selectedToken.usdValue, 2) ?? "0.00"}
							</p>
						</div>
					</div>
				) : (
					<span className="w-full text-body opacity-30">Choose Asset...</span>
				)}

				<div className="h-[30px] w-px bg-line" />
				<div className="flex w-[67px] items-center justify-center p-4 text-white">
					<ChevronDown className="h-6 w-6 text-body opacity-50" />
				</div>
			</div>

			{viewTokens && (
				<div className="absolute left-0 top-6 z-[100] w-full translate-y-[15%]">
					<AllTokensModal
						wallets={wallets}
						setSelectedToken={handleSelectToken}
						close={() => setViewTokens(false)}
						className="max-w-full"
						noClose
						noTitle
					/>
				</div>
			)}
		</div>
	);
};
