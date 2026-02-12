"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown } from "lucide-react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { type PaymentCoinsProps } from "@/lib/api/wallet";

export const CoinTrigger = ({
	selectedCoin,
	defaultCoin,
	setIsOpen,
}: {
	selectedCoin: PaymentCoinsProps;
	defaultCoin: PaymentCoinsProps;
	setIsOpen: (value: boolean) => void;
}): JSX.Element => {
	return (
		<Button
			className="inline-flex !h-auto w-max items-center justify-center gap-1 rounded-2xl !bg-black !bg-opacity-10 p-1"
			onClick={() => {
				setIsOpen(true);
			}}
			type="button"
		>
			<div className="flex items-center justify-center gap-2">
				<Image
					className="h-6 w-[26px] rounded-[100px]"
					src={selectedCoin?.icon ?? defaultCoin?.icon}
					height={27}
					width={27}
					alt={selectedCoin?.name ?? defaultCoin?.name}
				/>
				<p className="hidden text-base leading-normal tracking-tight text-primary sm:block">
					{selectedCoin?.name?.toUpperCase() ?? defaultCoin?.name?.toUpperCase()}
				</p>
			</div>
			<ChevronDown className="relative size-4 text-[#999999]" />
		</Button>
	);
};
