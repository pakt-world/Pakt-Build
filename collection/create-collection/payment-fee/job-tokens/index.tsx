"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import { useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Modal } from "@/components/common/headless-modal";
import { type PaymentCoinsProps, useGetPaymentCoins } from "@/lib/api/wallet";
import { type baseCreateJobSchema } from "@/lib/validations";

import { CoinItem } from "./coin-item";
import { CoinSearchInput } from "./coin-search-input";
import { CoinTrigger } from "./coin-trigger";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface JobTokensProps {
	form: UseFormReturn<FormValues>;
	rates?: Record<string, number>;
}

export const JobTokens = ({ form, rates }: JobTokensProps): JSX.Element => {
	const isClient = useIsClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredCoins, setFilteredCoins] = useState<PaymentCoinsProps[] | undefined>([]);
	const [isOpen, setIsOpen] = useState(false);

	const { data: paymentCoinsData, isLoading: isCoinLoading } = useGetPaymentCoins({
		enable: isClient ? true : false,
	});

	// Replicate the above but wrap with useMemo
	const defaultCoin = useMemo(() => {
		return paymentCoinsData?.find((coin) => coin?.reference === "usdc");
	}, [paymentCoinsData]);

	useEffect(() => {
		const filtered = paymentCoinsData?.filter(
			(coin) =>
				coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
				coin?.reference.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredCoins(filtered);
	}, [searchTerm, paymentCoinsData]);

	return (
		<div className="relative">
			{!isCoinLoading ? (
				<Controller
					name="coin"
					control={form.control}
					defaultValue={defaultCoin}
					render={({ field: { onChange, value } }) => {
						const selectedCoin = paymentCoinsData?.find((coin) => coin === value);
						return (
							<div className="relative">
								<CoinTrigger
									setIsOpen={setIsOpen}
									defaultCoin={value}
									selectedCoin={selectedCoin as PaymentCoinsProps}
								/>
								<Modal
									isOpen={isOpen}
									closeModal={() => {
										setIsOpen(false);
									}}
								>
									<div
										className="relative mx-auto flex h-[484px] w-full max-w-[448px] flex-col gap-4 overflow-hidden rounded-2xl border-line bg-white p-6
											shadow"
									>
										<div className="z-10 flex w-full items-center justify-between">
											<h2 className="text-2xl font-bold leading-[31.20px] tracking-wide text-body">
												Select Tokens
											</h2>

											<button
												className="z-10 flex size-6 items-center justify-center rounded-full border border-body text-body"
												onClick={() => {
													setIsOpen(false);
												}}
												type="button"
												aria-label="Close"
											>
												<X size={16} strokeWidth={2} />
											</button>
										</div>
										<CoinSearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
										<div className="z-10 flex h-full grow flex-col items-center gap-4 overflow-hidden">
											<div className="flex w-full items-center justify-between">
												<p className="text-sm leading-[21px] tracking-wide text-zinc-500">
													All Tokens
												</p>
												<p className="text-sm leading-[21px] tracking-wide text-zinc-500">
													Price
												</p>
											</div>
											<div className="z-10 flex w-full grow flex-col items-center gap-4 overflow-y-scroll">
												{(filteredCoins ?? [])?.length > 0 &&
													filteredCoins?.map((coin) => (
														<CoinItem
															key={coin._id}
															coin={coin}
															onChange={onChange}
															closeModal={() => {
																setIsOpen(false);
															}}
															rates={rates}
														/>
													))}
											</div>
										</div>
									</div>
								</Modal>
							</div>
						);
					}}
				/>
			) : (
				<div className="flex grow items-center justify-center">
					<div className="size-6 animate-spin rounded-full border-y-2 border-primary" />
				</div>
			)}
		</div>
	);
};
