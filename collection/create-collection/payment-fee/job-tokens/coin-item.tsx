"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type PaymentCoinsProps } from "@/lib/api/wallet";

export const CoinItem = ({
	coin,
	onChange,
	closeModal,
	rates,
}: {
	coin: PaymentCoinsProps;
	onChange: (coin: PaymentCoinsProps) => void;
	closeModal: () => void;
	rates?: Record<string, number>;
}): JSX.Element => {
	const rate = rates ? rates[coin?.reference] : "";
	return (
		<div
			className="inline-flex h-14 w-full cursor-pointer items-center justify-center gap-4 rounded-2xl border border-body
				border-opacity-20 p-4 shadow hover:border-line hover:bg-secondary/10"
			onClick={() => {
				onChange(coin);
				closeModal();
			}}
			role="button" // role="button" is used to make the div clickable
			tabIndex={0} // tabIndex={0} is used to make the div focusable
			onKeyDown={(event) => {
				// Enter key code is 13
				if (event.keyCode === 13) {
					// Handle enter key event
					onChange(coin);
					closeModal();
				}
			}}
		>
			<div className="flex h-[39px] shrink grow basis-0 items-center justify-between">
				<div className="flex items-center justify-center gap-4">
					<Image
						className="h-6 w-[26px] rounded-[100px]"
						src={coin.icon}
						height={26}
						width={26}
						alt={coin.name}
					/>
					<p className="text-base leading-normal tracking-tight text-body">{coin.name?.toUpperCase()}</p>
				</div>
				<div className="inline-flex flex-col items-end justify-start">
					<p className="text-sm leading-[21px] tracking-tight text-body text-opacity-70">${rate}</p>
				</div>
			</div>
		</div>
	);
};
