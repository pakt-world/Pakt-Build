"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { formatUsd, formatUsdToSixDecimals } from "@/lib/utils";
import { WalletProps } from "@/lib/api/wallet";
import { WithdrawalModal } from "./withdraw";

interface TotalWalletBalanceProps {
	wallets: WalletProps[];
	totalWalletBalance: string | number;
	refetchWalletData: () => void;
}

export const TotalWalletBalance = ({ wallets, totalWalletBalance, refetchWalletData }: TotalWalletBalanceProps) => {
	const isMobile = useMediaQuery("(max-width: 640px)");

	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	return (
		<div
			className="flex w-full items-center justify-between gap-2 overflow-hidden border-[#198155] bg-primary-gradient-light px-4 py-2
				text-white sm:rounded-lg sm:border-2 sm:py-6"
		>
			<div className="flex flex-col gap-2">
				<span className="text-normal text-sm">Total Wallet Balance</span>
				{isMobile ? (
					<span className="text-2xl font-bold">
						{formatUsdToSixDecimals(parseFloat(totalWalletBalance as string) ?? 0.0)}
					</span>
				) : (
					<span className="text-2xl font-bold sm:text-3xl sm:font-semibold">
						{formatUsd(parseFloat(totalWalletBalance as string) ?? 0.0)}
					</span>
				)}
			</div>
			{Number(totalWalletBalance) > 0 && (
				<Button
					size={isMobile ? "md" : "lg"}
					onClick={() => {
						if (isMobile) {
							router.push("/wallet/withdraw");
						} else {
							setIsOpen(true);
						}
					}}
					variant="secondary"
					className="font-bold sm:border sm:!border-primary"
				>
					Withdraw
				</Button>
			)}
			<WithdrawalModal
				isOpen={isOpen}
				onChange={setIsOpen}
				wallets={wallets}
				refetch={() => {
					refetchWalletData();
				}}
			/>
		</div>
	);
};
