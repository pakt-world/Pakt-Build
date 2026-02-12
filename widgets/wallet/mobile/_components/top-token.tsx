"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { formatNumberWithCommas, formatUsdToSixDecimals, getWalletIcon } from "@/lib/utils";
import { WalletProps } from "@/lib/api/wallet";
import { AllTokensModal } from "../../_shared/view-all-tokens-dialog";
import { Modal } from "@/components/common/modal";

interface TopToken4MobileProps {
	wallets: WalletProps[];
}

export const TopToken4Mobile = ({ wallets }: TopToken4MobileProps) => {
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
			<div className="flex h-fit w-full items-center justify-between gap-2 border-b border-[#9990FF] bg-[#F9F6FE] px-4 py-2">
				<div className="flex h-full items-center gap-[22px]">
					<div className="flex h-full flex-col justify-between">
						<div className="flex items-center gap-2 text-body">
							<span className="text-sm">Top Token</span>
							<span className="text-sm">({formatUsdToSixDecimals(selectedToken?.usdValue ?? 0.0)})</span>
						</div>
						<span className="text-2xl font-bold text-black">
							{formatNumberWithCommas(selectedToken?.amount, 6) || "0.00"}
						</span>
					</div>
				</div>
				<Button
					className="inline-flex !h-[32px] !w-fit items-center justify-center gap-2 overflow-hidden rounded-full border-none !bg-[#ECFCE5]
						px-1 py-0 text-base leading-[24px] tracking-[0.75%] !text-black"
					onClick={() => {
						setViewTokens(true);
					}}
				>
					<div className="absolute left-0 top-0 size-full bg-black/10" />
					<div className="flex items-center gap-1">
						<Image
							src={getWalletIcon(selectedToken)}
							width={26}
							height={26}
							alt=""
							className="size-[26px] rounded-full"
						/>
						<span className="text-sm text-body">{selectedToken?.coin?.toUpperCase()} </span>
					</div>
					<div className="flex size-5 items-center gap-1">
						<ChevronDown className="relative flex flex-1" />
					</div>
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
