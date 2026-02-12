"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";
import { NumericInput } from "@/components/common/numeric-input";
import { PaymentCoinsProps } from "@/lib/api/wallet";
import { formatNumberWithCommas, JOB_DIGIT } from "@/lib/utils";
import { JobTokens } from "./job-tokens";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface JobProposedPriceProps {
	form: UseFormReturn<FormValues>;
	amount: number;
	totalValue: number | undefined;
	coin: PaymentCoinsProps;
	rates?: Record<string, number>;
}

const JobProposedPrice = ({ form, amount, totalValue, coin, rates }: JobProposedPriceProps): ReactElement => {
	return (
		<div className="relative flex flex-col flex-wrap items-start">
			<div className="flex h-[42px] items-center gap-2 rounded-3xl border-[#198155] bg-[#ECFCE5] py-2 pl-4 pr-2 text-primary">
				<div className="text-base text-[#198155] max-sm:w-4 sm:text-lg">$</div>
				<NumericInput
					type="text"
					{...form.register("budget")}
					placeholder="Enter Amount"
					className="h-full w-full bg-transparent text-xl placeholder:text-xl placeholder:text-primary placeholder:text-opacity-50
						focus:outline-none max-sm:min-w-[70px] max-sm:max-w-[100px] max-sm:text-sm max-sm:placeholder:text-sm
						max-mdd:placeholder:!text-xs sm:w-[142px]"
				/>
				<JobTokens form={form} rates={rates} />
			</div>
			{amount >= 10 && (
				<div className="mt-2 text-sm leading-[21px] tracking-wide text-neutral-300">
					= {formatNumberWithCommas(totalValue, JOB_DIGIT)} {coin?.name?.toUpperCase()}
				</div>
			)}
			<span className="mt-2 flex w-full">
				{form.formState.errors.budget?.message != null && (
					<span className="text-sm text-red-200">{form.formState.errors.budget?.message}</span>
				)}
			</span>
		</div>
	);
};

export default JobProposedPrice;
