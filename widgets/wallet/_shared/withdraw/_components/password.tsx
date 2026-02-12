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

import { baseWithdrawFormSchema } from "@/lib/validations";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";

type FormValues = z.infer<typeof baseWithdrawFormSchema>;

interface Props {
	form: UseFormReturn<FormValues>;
}
export const Password = ({ form }: Props) => {
	return (
		<div className="relative">
			<Input
				type="password"
				label="Password"
				className="!border-line !text-title placeholder:opacity-50"
				placeholder="Enter account Password"
				{...form.register("password")}
			/>
			<InputErrorMessage message={form.formState.errors.password?.message} />
		</div>
	);
};
