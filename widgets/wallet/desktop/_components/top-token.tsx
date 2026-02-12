"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { formatNumberWithCommas, formatUsd, getWalletIcon } from "@/lib/utils";
import { WalletProps } from "@/lib/api/wallet";
import { AllTokensModal } from "../../_shared/view-all-tokens-dialog";
import { Modal } from "@/components/common/modal";

interface TopToken4DesktopProps {
	wallets: WalletProps[];
}

export const TopToken4Desktop = ({ wallets }: TopToken4DesktopProps) => {
	const [selectedToken, setSelectedToken] = useState<WalletProps | null>(null);
	const [viewTokens, setViewTokens] = useState(false);

	useEffect(() => {
		if (wallets.length > 0) {
			const sortedCoins = wallets.sort((a, b) => b.usdValue - a.usdValue);
			setSelectedToken(sortedCoins[0] ?? null);
		}
	}, [setSelectedToken, wallets]);

	return (
		<>
			<div
				className="flex w-full items-center justify-between gap-2 overflow-hidden border-b border-[#9990FF] bg-[#F9F6FE] px-4 py-2
					sm:items-end sm:rounded-lg sm:border sm:py-6"
			>
				<div className="flex items-center gap-[22px]">
					<div className="flex flex-col items-center gap-1">
						<Image
							src={getWalletIcon(selectedToken)}
							width={74}
							height={74}
							alt=""
							className="size-[40px] rounded-full sm:size-[74px]"
						/>
						<span className="text-sm text-body">{selectedToken?.coin?.toUpperCase()} </span>
					</div>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<span className="text-sm text-black">Top Token</span>
							<span className="text-gray text-xl font-bold text-black sm:text-2xl">
								{formatNumberWithCommas(selectedToken?.amount, 6) || "0.00"}
							</span>
						</div>

						<span className="mt-auto text-sm text-title">
							{formatUsd(selectedToken?.usdValue ?? 0.0)} USD
						</span>
					</div>
				</div>
				<Button
					className="inline-flex items-center justify-center gap-2 rounded-[10.12px] border border-black !bg-transparent px-4 py-2 text-sm
						leading-normal tracking-wide !text-black hover:!bg-[#E7E7FF] hover:!bg-opacity-100 sm:text-base"
					onClick={() => {
						setViewTokens(true);
					}}
				>
					View all tokens
					<ChevronRight className="relative size-4 sm:size-4" />
				</Button>
			</div>
			<Modal
				isOpen={viewTokens}
				onOpenChange={() => {
					setViewTokens(false);
				}}
				// disableClickOutside
			>
				<AllTokensModal
					wallets={wallets}
					close={() => {
						setViewTokens(false);
					}}
				/>
			</Modal>
		</>
	);
};
