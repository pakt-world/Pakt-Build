"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { Input } from "pakt-ui";
import { UseFormReturn } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { baseWithdrawFormSchema } from "@/lib/validations";

type FormValues = z.infer<typeof baseWithdrawFormSchema>;

interface Props {
	form: UseFormReturn<FormValues>;
}
export const RecipientAddress = ({ form }: Props) => {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-body">Recipient Wallet Address</span>
			</div>

			<div className="relative">
				<Input
					type="text"
					{...form.register("address")}
					className="!border-line !text-title placeholder:opacity-50 max-sm:placeholder:!text-sm"
					placeholder="Enter address you're sending to"
				/>
				<InputErrorMessage message={form.formState.errors.address?.message} />
			</div>

			<span className="mt-4 text-left text-sm text-info">
				Ensure you’re sending to an Avalanche C-Chain address. Sending to the wrong network will result in loss
				of funds.
			</span>
		</div>
	);
};
