"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { Checkbox } from "@/components/common/checkbox";
import { Controller, UseFormReturn } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { baseWithdrawFormSchema } from "@/lib/validations";

type FormValues = z.infer<typeof baseWithdrawFormSchema>;

interface Props {
	form: UseFormReturn<FormValues>;
}

export const ConfirmWithdrawal = ({ form }: Props) => {
	return (
		<div className="relative my-2 flex cursor-pointer flex-col">
			<div className="flex flex-row gap-2">
				<Controller
					name="confirm"
					control={form.control}
					render={({ field: { onChange: change, value } }) => (
						<Checkbox
							id="confirm-withdrawal"
							{...form.register("confirm")}
							checked={value}
							onCheckedChange={change}
							className="checkbox_style"
						/>
					)}
				/>
				<label htmlFor="confirm-withdrawal" className="cursor-pointer text-sm text-title">
					I confirm that all the above details are correct.
				</label>
			</div>

			<InputErrorMessage message={form.formState.errors.confirm?.message} />
		</div>
	);
};
