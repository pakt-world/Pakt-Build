"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { WalletProps } from "@/lib/api/wallet";
import { formatNumberWithCommas } from "@/lib/utils";

interface AllTokensModalProps {
	wallets: WalletProps[];
	close: () => void;
	setSelectedToken?: (wallet: WalletProps) => void;
	className?: string;
	noClose?: boolean;
	noTitle?: boolean;
}

export const AllTokensModal = ({
	wallets,
	close,
	setSelectedToken,
	className,
	noClose,
	noTitle,
}: AllTokensModalProps): JSX.Element => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredCoins, setFilteredCoins] = useState<WalletProps[]>([]);

	useEffect(() => {
		const sortedCoins = wallets.sort((a, b) => b.usdValue - a.usdValue);
		setFilteredCoins(sortedCoins);
	}, [wallets]);

	const handleSearch = (value: string): void => {
		setSearchTerm(value);
		const filtered = wallets.filter((coin) => coin.coin.toLowerCase().includes(value.toLowerCase()));
		const sortedCoins = filtered.sort((a, b) => b.usdValue - a.usdValue);
		setFilteredCoins(sortedCoins);
	};

	return (
		<div
			className={`relative mx-auto flex h-full max-h-[484px] w-full max-w-[448px] flex-col gap-4 overflow-hidden rounded-2xl border
				border-line bg-white p-6 shadow ${className}`}
		>
			<div className="z-10 flex w-full items-center justify-between">
				{!noTitle && (
					<h2 className="text-2xl font-bold leading-[31.20px] tracking-wide text-gray-600">Wallet Tokens</h2>
				)}
				{!noClose && (
					<button
						className="z-10 flex h-6 w-6 items-center justify-center rounded-full border border-body duration-200 hover:border-body
							hover:text-body"
						onClick={() => {
							close();
						}}
						type="button"
						aria-label="Close"
					>
						<X size={16} strokeWidth={2} />
					</button>
				)}
			</div>
			<div className="relative z-10 flex w-full items-center gap-2">
				<div className="absolute left-3">
					<Search size={18} className="text-body" />
				</div>
				<input
					type="text"
					className="input-style w-full resize-none !rounded-[10px] border border-line px-2 py-[11px] pl-10 shadow placeholder:text-zinc-400
						placeholder:text-opacity-30 focus:outline-none"
					placeholder="Type to Search"
					value={searchTerm}
					onChange={(e) => {
						handleSearch(e.target.value);
					}}
				/>
			</div>

			<div className="z-10 flex h-full grow flex-col items-center gap-4 overflow-hidden">
				<p className="w-full text-sm leading-[21px] tracking-wide text-zinc-500">All Tokens</p>
				<div className="z-10 flex w-full grow flex-col items-center gap-4 overflow-y-scroll">
					{filteredCoins.map((wallet, index) => (
						<div
							className="inline-flex h-14 w-full cursor-pointer items-center justify-center gap-4 rounded-2xl border border-gray-600
								border-opacity-20 p-4 text-gray-600 duration-300"
							key={`${wallet?.id} - ${index}`}
							onMouseDown={() => {
								if (setSelectedToken) {
									setSelectedToken(wallet);
									close();
								}
							}}
							tabIndex={0}
							role="button"
						>
							<div className="flex h-[39px] shrink grow basis-0 items-center justify-between">
								<div className="flex items-center justify-center gap-4">
									<Image
										className="h-6 w-[26px] rounded-[100px]"
										src={wallet.icon}
										height={26}
										width={26}
										alt={wallet.coin}
									/>
									<p className="text-base font-medium leading-normal tracking-tight">
										{wallet.id?.toUpperCase()}
									</p>
								</div>
								<div className="inline-flex flex-col items-end justify-start">
									<p className="text-md leading-[21px] tracking-tight text-opacity-70">
										{formatNumberWithCommas(wallet.amount, 6) || "0"}
									</p>
									<p className="text-sm leading-[18px] tracking-tight text-opacity-50">
										${wallet.usdValue || "0.00"}
									</p>
								</div>
							</div>
						</div>
					))}
					{filteredCoins.length === 0 && (
						<div className="flex h-full w-full items-center justify-center gap-1">
							<p className="text-xl text-slate-300">
								No tokens found for <span className="text-primary">{searchTerm}</span>
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
