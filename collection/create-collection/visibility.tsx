"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type baseCreateJobSchema } from "@/lib/validations";
import { SelectDropdown } from "@/components/common/select-dropdown";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface JobDescriptionProps {
	form: UseFormReturn<FormValues>;
	disabled?: boolean;
}

export const VISIBILITY_OPTIONS = [
	{ label: "Private", value: "private" },
	{ label: "Public", value: "public" },
];

const JobVisibility = ({ form, disabled }: JobDescriptionProps): ReactElement => {
	return (
		<div className="flex flex-col gap-2 max-sm:w-full">
			<label className="text-sm text-body">Visibility</label>
			<div className="relative">
				<Controller
					name="visibility"
					control={form.control}
					render={({ field: { onChange, value } }) => {
						return (
							<SelectDropdown
								options={VISIBILITY_OPTIONS}
								value={value}
								onChange={onChange}
								placeholder="Select Category"
								disabled={disabled}
								triggerClassName="h-10 w-full sm:w-[180px] sm:text-base"
							/>
						);
					}}
				/>
				<span className="absolute -bottom-5 flex w-full">
					{form.formState.errors.visibility?.message != null && (
						<span className="whitespace-nowrap text-sm text-red-500">
							{form.formState.errors.visibility?.message}
						</span>
					)}
				</span>
			</div>
		</div>
	);
};

export default JobVisibility;
