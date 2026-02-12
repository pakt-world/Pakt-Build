"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { Controller, UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatNumberWithCommas, getWalletIcon, JOB_DIGIT } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { WalletProps } from "@/lib/api/wallet";
import { baseWithdrawFormSchema } from "@/lib/validations";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";

type FormValues = z.infer<typeof baseWithdrawFormSchema>;

interface Props {
	form: UseFormReturn<FormValues>;
	coinRate: number | undefined;
	selectedToken?: WalletProps | null;
	disabled: boolean;
	setDisabled: (value: boolean) => void;
}

export const AmountInput: React.FC<Props> = ({ form, coinRate, selectedToken, disabled, setDisabled }) => {
	const isSmallerScreen = useMediaQuery("(max-width: 640px)");
	return (
		<div className="relative">
			<Controller
				name="amount"
				control={form.control}
				render={({ field: { onChange, value } }) => {
					// Handle value and conversion
					const displayValue = value === undefined || value === null ? "" : String(value); // Convert `undefined` or `null` to an empty string
					const valueInUsd = Number(value || 0) * (coinRate || 0); // Calculate value in USD

					const handleMax = (): void => {
						const max = selectedToken?.amount || 0;
						onChange(Number(max)); // Directly set the maximum value
						const exceedsBalance = max < value;
						setDisabled(exceedsBalance);
					};

					const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
						const inputValue = e.target.valueAsNumber; // Get numeric value directly

						// Check if the input value is valid
						if (isNaN(inputValue) || inputValue < 0) {
							// Optionally, you can set an error state or show an alert here
							return; // Exit if the value is invalid
						}

						onChange(inputValue || 0); // Update form value
						const exceedsBalance = (selectedToken?.amount || 0) < inputValue;
						setDisabled(exceedsBalance);
					};

					return (
						<div className="relative flex items-center rounded-xl border border-line pl-4">
							<div className="flex grow items-center pr-2">
								{selectedToken && (
									<Image
										className="h-6 w-[26px] rounded-full"
										src={getWalletIcon(selectedToken)}
										height={26}
										width={26}
										alt={selectedToken.coin}
									/>
								)}
								<input
									type="number"
									value={displayValue}
									onChange={handleChange}
									placeholder={isSmallerScreen ? "Enter amount" : "Enter amount to withdraw"}
									className="w-full grow border-none bg-transparent px-4 text-title focus:outline-none max-sm:placeholder:!text-sm"
									autoComplete="off"
									autoCorrect="off"
								/>
								<p className="text-[15px] font-medium tracking-tight text-body">
									${formatNumberWithCommas(valueInUsd, JOB_DIGIT)}
								</p>
							</div>
							<div className="h-[52px] w-px bg-line" />
							<Button
								type="button"
								variant="ghost"
								className="flex w-[67px] items-center justify-center border-none bg-transparent p-4 text-title"
								onClick={() => handleMax()}
							>
								MAX
							</Button>
						</div>
					);
				}}
			/>
			<InputErrorMessage message={disabled ? "Insufficient balance" : form.formState.errors.amount?.message} />
			<p className="mt-4 text-left text-sm text-info">
				Dollar value amount of tokens is representative of the conversion rate at this moment.
			</p>
		</div>
	);
};
