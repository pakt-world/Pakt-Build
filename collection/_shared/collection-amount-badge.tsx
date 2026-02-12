"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { CoinProps } from "@/lib/types/collection";
import {
	formatNumber,
	// isProductionEnvironment
} from "@/lib/utils";
// import Logger from "@/lib/utils/logger";

interface Props {
	className?: string;
	coin: CoinProps;
	realTimeRate: number;
	isFunded: boolean;
	usdInitialValue: number;
	noDollarValue?: boolean;
	paymentFee: number;
	paymentRate: string;
}

export const JobAmountBadge = ({
	className,
	paymentFee,
	coin,
	realTimeRate,
	isFunded,
	usdInitialValue,
	noDollarValue = false,
	paymentRate,
}: Props) => {
	// Logger.info("JobAmountBadge", {
	// 	paymentFee,
	// 	coin,
	// 	realTimeRate,
	// 	isFunded,
	// 	usdInitialValue,
	// });
	const ta = isFunded ? paymentFee : usdInitialValue ? usdInitialValue / realTimeRate : paymentFee;
	const tokenAmount = useMemo(() => formatNumber(ta), [ta]);

	const fundedDollarAmount = Number(paymentRate) * paymentFee;
	const dollarAmount = useMemo(
		() =>
			isFunded
				? formatNumber(fundedDollarAmount)
				: usdInitialValue
					? formatNumber(usdInitialValue)
					: formatNumber(fundedDollarAmount),
		[fundedDollarAmount, isFunded, usdInitialValue]
	);

	return (
		<div
			className={`relative flex h-7 w-max items-center gap-1 rounded-full bg-amount_badge-m px-3 text-base xl:h-10 2xl:px-4 ${className}`}
		>
			<p className="leading-normal tracking-tight text-black">{tokenAmount} </p>
			<Image
				src={coin?.icon ?? "/icons/avax-logo.svg"}
				alt={coin?.name ?? "AVAX"}
				width={20}
				height={20}
				className="mb-[1px] size-[12px] overflow-hidden rounded-full bg-cover sm:h-[20px] sm:w-[20px]"
			/>
			<p className="whitespace-nowrap leading-normal tracking-tight text-black">
				{coin?.symbol.toUpperCase() ?? "AVAX"}{" "}
				{!noDollarValue && (
					<span className="font-bold">
						($
						{dollarAmount})
					</span>
				)}
			</p>
			{/* {isFunded && !isProductionEnvironment && (
				<div className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full border border-line" />
			)} */}
		</div>
	);
};
